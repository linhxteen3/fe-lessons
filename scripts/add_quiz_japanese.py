"""Fill Japanese quiz fields without changing original text, answers or question order.

Only the already-public quiz text is sent for draft translation. Existing Japanese
blocks are reused; code, numbers and formulas are preserved for review.
"""
import concurrent.futures
import json
import re
import time
import unicodedata
import urllib.parse
import urllib.request
import warnings
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString, MarkupResemblesLocatorWarning

warnings.filterwarnings('ignore',category=MarkupResemblesLocatorWarning)

ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT/'scripts/quiz-ja-cache.json'
JP=re.compile(r'[\u3040-\u30ff\u3400-\u9fff]')
LETTERS=re.compile(r'[A-Za-z\u00c0-\u024f\u1e00-\u1eff]')
PRESERVE=re.compile(r'https?://\S+|`[^`]+`|(?<![A-Za-z])[-+]?\d[\d.,]*(?:[eE][-+]?\d+)?')
SAFE={'A','B','C','D','AND','OR','NOT','NULL','TRUE','FALSE','FIFO','LIFO','LRU','LFU','CPU','RAM','ROM','SSD','HDD','USB','HDMI','TCP','IP','UDP','SQL','SELECT','WHERE','FROM','ORDER BY','GROUP BY','HAVING','COUNT(*)','OCR','OMR','RAID','ACID','MTBF','MTTR','CPI','MIPS','GHz','MHz','Hz','KB','MB','GB','TB','IEEE1394','IEEE 1394','IDE','SCSI'}
OVERRIDES={
 'Đúng':'正しい','Sai':'誤り','Không đổi':'変わらない','Không có':'該当なし',
 'Tất cả đều đúng':'すべて正しい','Tất cả đều sai':'すべて誤り',
 'Bộ nhớ chính':'主記憶装置','Bộ nhớ phụ':'補助記憶装置',
 'Chọn mục phù hợp nhất với tình huống.':'この事例に最も適切な項目を選べ。',
}
GLOSSARY={'bù 2':'2の補数','bù 1':'1の補数','unsigned':'符号なし','signed':'符号付き','không dấu':'符号なし','có dấu':'符号付き','bit dấu':'符号ビット','bộ nhớ chính':'主記憶装置','bộ nhớ phụ':'補助記憶装置','khóa chính':'主キー','khóa ngoại':'外部キー','tham chiếu':'参照','stack':'スタック','sắp xếp':'整列'}

def needs(text):
    s=text.strip()
    if not s or s in SAFE or not LETTERS.search(s): return False
    vietnamese=any(ord(c)>127 and 'LATIN' in unicodedata.name(c,'') for c in s)
    if not vietnamese and re.match(r'^(?:SELECT|UPDATE|DELETE|INSERT|CREATE|DROP|ALTER|GRANT|REVOKE)\b|^(?:COUNT|SUM|AVG|MAX|MIN)\s*\(',s): return False
    if JP.search(s) and not vietnamese: return False
    if not re.search(r'[A-Za-zÀ-ỹ]{2,}',s): return False
    return True

def japanese_fragment(value):
    """Prefer authored Japanese, including the earlier 'Vietnamese / Japanese' options."""
    soup=BeautifulSoup(str(value),'html.parser')
    blocks=soup.select('.reading-ja')
    if blocks:
        for b in blocks:
            for vi in b.select('.reading-vi'): vi.decompose()
        return ''.join(str(b) for b in blocks)
    if ' / ' in str(value) and '<' not in str(value) and len(str(value))<160:
        right=str(value).split(' / ',1)[1]
        if JP.search(right) and not any(ord(c)>127 and 'LATIN' in unicodedata.name(c,'') for c in right): return right
    return str(value)

def text_nodes(value):
    soup=BeautifulSoup(japanese_fragment(value),'html.parser')
    return soup, [node for node in soup.find_all(string=True) if isinstance(node,NavigableString) and not node.find_parent(['code','pre','script','style']) and needs(str(node))]

def protect(text):
    for vi,ja in GLOSSARY.items(): text=re.sub(r'(?<!\w)'+re.escape(vi)+r'(?!\w)',ja,text,flags=re.I)
    saved=[]
    def take(m):
        saved.append(m[0]);return f'ZXN{len(saved)-1:04d}NZ'
    return PRESERVE.sub(take,text),saved

def restore(text,saved):
    for i,value in enumerate(saved):
        pattern=rf'ZXN\s*{i:04d}\s*NZ'
        if not re.search(pattern,text,re.I): raise ValueError('Translation lost a protected number/code token')
        text=re.sub(pattern,lambda m:value,text,flags=re.I)
    return text

def translate_batch(items):
    protected=[protect(t) for t in items]
    source='\n'.join(f'⟦{i:04d}⟧ {t}' for i,(t,_) in enumerate(protected))
    url='https://translate.googleapis.com/translate_a/single?'+urllib.parse.urlencode(dict(client='gtx',sl='vi',tl='ja',dt='t',q=source))
    for attempt in range(3):
        try:
            req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
            with urllib.request.urlopen(req,timeout=25) as response: payload=json.load(response)
            translated=''.join(s[0] for s in payload[0] if s[0])
            markers=list(re.finditer(r'⟦\s*(\d{4})\s*⟧',translated))
            if [int(m[1]) for m in markers]!=list(range(len(items))): raise ValueError('Translation markers changed')
            starts=[translated.rfind('\n',0,m.start())+1 for m in markers]
            if len(set(starts))!=len(starts): raise ValueError('Translation merged separate fragment lines')
            out={}
            for i,m in enumerate(markers):
                end=starts[i+1] if i+1<len(markers) else len(translated)
                part=translated[starts[i]:end].replace(m[0],'').strip()
                out[items[i]]=restore(part,protected[i][1])
            return out
        except Exception as error:
            if isinstance(error,ValueError) and len(items)>1:
                middle=len(items)//2
                return translate_batch(items[:middle]) | translate_batch(items[middle:])
            if isinstance(error,ValueError) and len(items)==1:
                original=items[0]
                source=original
                for vi,ja in GLOSSARY.items(): source=re.sub(r'(?<!\w)'+re.escape(vi)+r'(?!\w)',ja,source,flags=re.I)
                raw_url='https://translate.googleapis.com/translate_a/single?'+urllib.parse.urlencode(dict(client='gtx',sl='vi',tl='ja',dt='t',q=source))
                with urllib.request.urlopen(raw_url,timeout=25) as response: payload=json.load(response)
                translated=''.join(p[0] for p in payload[0] if p[0])
                numbers=lambda value:re.findall(r'\d+(?:[.,]\d+)*',value)
                if sorted(numbers(original))!=sorted(numbers(translated)): raise ValueError(f'Numeric review required: {original!r}')
                return {original:translated}
            if attempt==2:
                raise ValueError(f'{error}; fragment={items[0][:90]!r}') from error
            time.sleep(min(2**attempt,8))

def files():
    result=[]
    for path in sorted((ROOT/'kiem-tra').glob('*.html'),key=lambda p:int(p.stem)):
        text=path.read_text(encoding='utf-8')
        match=re.search(r'(<script[^>]*id="quiz-data"[^>]*>)(.*?)(</script>)',text,re.S)
        if match: result.append((path,text,match,json.loads(match[2])))
    return result

def stem_source(q):
    original=re.sub(r'^Q\d+\.?\s*','',q['q'])
    japanese=q.get('jp','')
    numbers=lambda value:set(re.findall(r'\d+(?:[.,]\d+)*',value))
    missing=numbers(original)-numbers(japanese)
    code_missing='<code' in original and '<code' not in japanese
    diagram_missing=original.count('\n')>1 and japanese.count('\n')==0
    return original if not japanese or needs(japanese) or missing or code_missing or diagram_missing else japanese

def targets(bank):
    for q in bank:
        yield stem_source(q)
        yield from q['opts']
        if q.get('why'): yield q['why']
        yield from q.get('details',[])
        if q.get('extra'): yield q['extra']

def add_fields(value,cache):
    soup,nodes=text_nodes(value)
    for node in nodes:
        raw=str(node);clean=raw.strip()
        translated=cache[clean]
        node.replace_with(raw[:len(raw)-len(raw.lstrip())]+translated+raw[len(raw.rstrip()):])
    result=str(soup)
    for number in [1,2]:
        if re.search(r'bù\s*'+str(number),str(value),re.I):
            for bad in [f'オフセット{number}',f'オフセット {number}',f'{number} の補償',f'{number}の補償',f'{number} の補完',f'{number}の補完',f'{number} の補体',f'{number}の補体',f'{number} つの補体',f'{number}つの補体']:
                result=result.replace(bad,f'{number}の補数')
    if re.search(r'\bsigned\b',str(value),re.I): result=result.replace('署名付き','符号付き')
    if re.search(r'\bunsigned\b',str(value),re.I): result=result.replace('署名なし','符号なし')
    if 'có dấu' in str(value).lower() or re.search(r'\bsigned\b',str(value),re.I): result=result.replace('記号付き','符号付き').replace('シンボル付き','符号付き')
    if 'không dấu' in str(value).lower() or re.search(r'\bunsigned\b',str(value),re.I): result=result.replace('シンボルなし','符号なし').replace('記号なし','符号なし')
    result=result.replace('士组見','仕組み')
    if 'Yasashii' in str(value): result=result.replace('優しい','教材「Yasashii」')
    return result

def run():
    cache=json.loads(CACHE.read_text(encoding='utf-8')) if CACHE.exists() else {}
    cache.update(OVERRIDES)
    pages=files();pending=[];seen=set()
    for _,_,_,bank in pages:
        for value in targets(bank):
            for node in text_nodes(value)[1]:
                t=str(node).strip()
                if t not in cache and t not in seen: pending.append(t);seen.add(t)
    batches=[];batch=[];size=0
    for t in pending:
        cost=len(t.encode('utf-8'))+24
        if batch and size+cost>1800: batches.append(batch);batch=[];size=0
        batch.append(t);size+=cost
    if batch: batches.append(batch)
    print(f'{len(pages)} tests; {sum(len(p[3]) for p in pages)} questions; {len(pending)} missing text fragments in {len(batches)} draft batches.',flush=True)
    failures=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        futures={executor.submit(translate_batch,b):i for i,b in enumerate(batches)}
        for count,future in enumerate(concurrent.futures.as_completed(futures),1):
            try: cache.update(future.result())
            except Exception as error:
                failures.append((batches[futures[future]],str(error)))
                print(f'Batch {futures[future]} deferred: {type(error).__name__}: {error}',flush=True)
            temporary=CACHE.with_suffix('.tmp')
            temporary.write_text(json.dumps(cache,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
            temporary.replace(CACHE)
            if count%10==0 or count==len(batches): print(f'Draft batches completed: {count}/{len(batches)}',flush=True)
    if failures:
        print(f'{len(failures)} batches need smaller retries; no page files changed.',flush=True)
        return
    for path,text,match,bank in pages:
        original=[(q['q'],q['opts'][:],q['ans']) for q in bank]
        for q in bank:
            source=stem_source(q)
            q['qJa']=source if not needs(source) else add_fields(source,cache)
            q['optsJa']=[add_fields(v,cache) for v in q['opts']]
            q['whyJa']=add_fields(q.get('why',''),cache)
            q['detailsJa']=[add_fields(v,cache) for v in q.get('details',[])]
            if q.get('extra'): q['extraJa']=add_fields(q['extra'],cache)
        overrides={
          ('1',37):{'qJa':'2進数で重みが32の桁は、2の何乗に対応するか。'},
          ('6',6):{'whyJa':'XOR（排他的論理和）は、2つの入力が異なる場合に1となる。0⊕1=1、1⊕0=1である。'},
          ('24',10):{'whyJa':'XOR（排他的論理和）は、2つの入力が異なる場合に1となる。0⊕1=1、1⊕0=1である。'},
          ('10',5):{'whyJa':'この設問の解釈では、Xが5になった時点で終了し、加算する値は1、2、3、4である。Yは0→1→3→6→10となるため、最終値は10。X=5も加算する別のループなら15となるが、その解釈とは区別する。'}
        }
        for (number,index),fields in overrides.items():
            if path.stem==number: bank[index].update(fields)
        assert original==[(q['q'],q['opts'],q['ans']) for q in bank]
        replacement=json.dumps(bank,ensure_ascii=False).replace('</','<\\/')
        path.write_text(text[:match.start(2)]+replacement+text[match.end(2):],encoding='utf-8')
    print('Japanese fields added; original questions/options/answer indexes preserved.',flush=True)

if __name__=='__main__': run()

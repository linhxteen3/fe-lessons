"""Apply the authored teaching explanations without changing quiz data or progress."""
import json
import re
from pathlib import Path
from theory_explanations import NOTES, EXAMPLES, FLOWS, enhance

ROOT=Path(__file__).resolve().parents[1]

def run():
    assert set(NOTES)==set(EXAMPLES)==set(FLOWS)
    for n in sorted(NOTES):
        path=ROOT/f'ly-thuyet/{n}.html'
        before=path.read_text(encoding='utf-8')
        data=lambda s:json.loads(re.search(r'<script[^>]*id="lesson-data"[^>]*>(.*?)</script>',s,re.S)[1])
        after=enhance(n,before)
        assert data(before)==data(after),f'Progress/flashcards/review must not change: {n}'
        path.write_text(after,encoding='utf-8')
    assert divmod(2500,1024)==(2,452) and 5*1024+452==5572
    assert 600*300//8==22500 and 8000*16*2*5//8==160000
    assert (100+200,300+400)==(300,700)
    assert 2*10**6*8/(8*10**6*.5)==4
    assert (80-100,80/100)==(-20,.8)
    assert 1000/(50-30)==50
    print(f'Enriched {len(NOTES)} theory pages; all lesson data preserved; worked calculations checked.')

if __name__=='__main__':run()

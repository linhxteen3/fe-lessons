"""Keep standalone tests on the same renderer as the shared test pages."""
import re
from pathlib import Path

root=Path(__file__).resolve().parents[1]
runtime=(root/'assets/quiz.js').read_text(encoding='utf-8')
for path in (root/'kiem-tra').glob('*.html'):
    source=path.read_text(encoding='utf-8')
    pattern=r'<script>\s*/\* One question flow for every test,.*?</script>'
    updated,count=re.subn(pattern,lambda m:'<script>'+runtime+'</script>',source,count=1,flags=re.S)
    if count: path.write_text(updated,encoding='utf-8')
print('Standalone quiz renderers synchronized.')

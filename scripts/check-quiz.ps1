$files = Get-ChildItem -Path "C:\Users\Admin\.gemini\antigravity\scratch\fe-lessons\kiem-tra" -Filter "*.html"
foreach ($f in $files) {
    $c = Get-Content $f.FullName -Raw -Encoding UTF8
    $hasQUIZ = $c -match 'const QUIZ\s*='
    $hasQ = $c -match 'const Q\s*='
    $hasShowResult = $c -match 'function showResult\s*\('
    Write-Host "$($f.Name): QUIZ=$hasQUIZ, Q=$hasQ, showResult=$hasShowResult"
}

$files = Get-ChildItem -Path "C:\Users\Admin\.gemini\antigravity\scratch\fe-lessons\kiem-tra" -Filter "*.html"
foreach ($f in $files) {
    $c = Get-Content $f.FullName -Raw -Encoding UTF8
    $fnMatches = [regex]::Matches($c, 'function\s+([a-zA-Z0-9_]*[rR]esult[a-zA-Z0-9_]*)\s*\(')
    $names = @()
    foreach ($m in $fnMatches) {
        $names += $m.Groups[1].Value
    }
    Write-Host "$($f.Name): $($names -join ', ')"
}

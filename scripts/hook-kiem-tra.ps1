# hook-kiem-tra.ps1
$projectRoot = "C:\Users\Admin\.gemini\antigravity\scratch\fe-lessons\kiem-tra"
$files = Get-ChildItem -Path $projectRoot -Filter "*.html"

$hook = @'
  if (typeof FEProgress !== 'undefined') {
    const _sttMatch = window.location.pathname.match(/(\d+)\.html/);
    const _stt = _sttMatch ? parseInt(_sttMatch[1], 10) : 1;
    FEProgress.saveQuizResult(_stt, correct, total, 'exam');
    if (pct >= 60) {
      FEProgress.setStatus(_stt, 'done');
    }
  }
'@

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    if ($content -notmatch 'FEProgress\.saveQuizResult') {
        $lines = $content -split "`r?`n"
        $modified = $false
        for ($i = 0; $i -lt $lines.Length; $i++) {
            if ($lines[$i] -match "document\.getElementById\('resScore'\)\.textContent") {
                $lines[$i] = $lines[$i] + "`n" + $hook
                $modified = $true
                break
            }
        }
        if ($modified) {
            $newContent = $lines -join "`n"
            Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
            Write-Host "Hooked: $($file.Name)" -ForegroundColor Green
        } else {
            Write-Host "Target not found in: $($file.Name)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Already hooked: $($file.Name)" -ForegroundColor Gray
    }
}

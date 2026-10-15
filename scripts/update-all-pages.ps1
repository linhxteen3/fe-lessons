# update-all-pages.ps1
$projectRoot = "C:\Users\Admin\.gemini\antigravity\scratch\fe-lessons"

$cssTag = '<link rel="stylesheet" href="../assets/common.css">'
$jsTag = '<script src="../assets/common.js"></script>'

# 1. Update ly-thuyet files
$lyThuyetFiles = Get-ChildItem -Path "$projectRoot\ly-thuyet" -Filter "*.html"
foreach ($file in $lyThuyetFiles) {
    Write-Host "Updating Ly-thuyet: $($file.Name)" -ForegroundColor Cyan
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8

    # Ensure link to common.css exists
    if ($content -notmatch 'assets/common\.css') {
        if ($content -match '<!-- Styles loaded from shared common\.css -->') {
            $content = $content.Replace('<!-- Styles loaded from shared common.css -->', $cssTag)
        } else {
            $content = $content.Replace('</head>', "$cssTag`n</head>")
        }
    }

    # Ensure common.js exists
    if ($content -notmatch 'assets/common\.js') {
        $content = $content.Replace('</body>', "$jsTag`n</body>")
    }

    # Hook quiz completion in ly-thuyet
    if ($content -notmatch 'FEProgress\.saveQuizResult') {
        $hookCode = @'
  if (typeof FEProgress !== 'undefined') {
    const _sttMatch = window.location.pathname.match(/(\d+)\.html/);
    const _stt = _sttMatch ? parseInt(_sttMatch[1], 10) : 1;
    FEProgress.saveQuizResult(_stt, score, QUIZ.length, 'theory-quiz');
    if (pct >= 70) {
      FEProgress.setStatus(_stt, 'done');
    }
  }
'@
        $pattern = "(document\.getElementById\('qScore'\)\.textContent\s*=\s*score\s*\+\s*' / '\s*\+\s*QUIZ\.length;)"
        if ($content -match $pattern) {
            $content = $content -replace $pattern, "`$1`n$hookCode"
        }
    }

    Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
}

# 2. Update kiem-tra files
$kiemTraFiles = Get-ChildItem -Path "$projectRoot\kiem-tra" -Filter "*.html"
foreach ($file in $kiemTraFiles) {
    Write-Host "Updating Kiem-tra: $($file.Name)" -ForegroundColor Green
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8

    # Ensure link to common.css exists
    if ($content -notmatch 'assets/common\.css') {
        if ($content -match '<!-- Styles loaded from shared common\.css -->') {
            $content = $content.Replace('<!-- Styles loaded from shared common.css -->', $cssTag)
        } else {
            $content = $content.Replace('</head>', "$cssTag`n</head>")
        }
    }

    # Ensure common.js exists
    if ($content -notmatch 'assets/common\.js') {
        $content = $content.Replace('</body>', "$jsTag`n</body>")
    }

    # Hook quiz completion in kiem-tra
    if ($content -notmatch 'FEProgress\.saveQuizResult') {
        $hookCode = @'
  if (typeof FEProgress !== 'undefined') {
    const _sttMatch = window.location.pathname.match(/(\d+)\.html/);
    const _stt = _sttMatch ? parseInt(_sttMatch[1], 10) : 1;
    FEProgress.saveQuizResult(_stt, correct, total, 'exam');
    if (pct >= 60) {
      FEProgress.setStatus(_stt, 'done');
    }
  }
'@
        $pattern = "(document\.getElementById\('resScore'\)\.textContent\s*=\s*`\$\{correct\}\s*/\s*\$\{total\}`;)"
        if ($content -match $pattern) {
            $content = $content -replace $pattern, "`$1`n$hookCode"
        }
    }

    Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
}

Write-Host "`nAll pages successfully updated with common.css and quiz hooks!" -ForegroundColor Yellow

# refactor-pages.ps1
# Tự động refactor các file ly-thuyet/*.html và kiem-tra/*.html
# để dùng shared CSS/JS thay vì inline

$projectRoot = "C:\Users\Admin\.gemini\antigravity\scratch\fe-lessons"
$folders = @("ly-thuyet", "kiem-tra")

foreach ($folder in $folders) {
    $folderPath = Join-Path $projectRoot $folder
    if (-not (Test-Path $folderPath)) { continue }

    $files = Get-ChildItem -Path $folderPath -Filter "*.html"
    foreach ($file in $files) {
        Write-Host "Processing: $($file.FullName)" -ForegroundColor Cyan

        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8

        # 1. Replace inline <style>...</style> with link to common.css
        # Keep only a minimal page-specific override comment
        $fontLink = '<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@600;800&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">'
        $cssLink = '<link rel="stylesheet" href="../assets/common.css">'

        # Pattern: replace everything from <style> to </style> (first occurrence)
        $stylePattern = '(?s)<style>.*?</style>'
        if ($content -match $stylePattern) {
            $content = $content -replace $stylePattern, "<!-- Styles loaded from shared common.css -->"
        }

        # 2. Add font link and CSS link if not already present
        if ($content -notmatch 'common\.css') {
            # Insert before </head>
            $headInsert = @"
$fontLink
$cssLink
"@
            $content = $content -replace '</head>', "$headInsert`n</head>"
        }

        # 3. Remove duplicate Google Fonts link if already exists
        # Keep only one instance
        $fontPattern = '<link\s+href="https://fonts\.googleapis\.com/css2\?family=Space\+Mono.*?"[^>]*>'
        $fontMatches = [regex]::Matches($content, $fontPattern)
        if ($fontMatches.Count -gt 1) {
            # Remove all but the first
            for ($i = $fontMatches.Count - 1; $i -ge 1; $i--) {
                $match = $fontMatches[$i]
                $content = $content.Substring(0, $match.Index) + $content.Substring($match.Index + $match.Length)
            }
        }

        # 4. Add common.js before closing </body> if not already present
        if ($content -notmatch 'common\.js') {
            $jsTag = '<script src="../assets/common.js"></script>'
            $content = $content -replace '</body>', "$jsTag`n</body>"
        }

        # Save
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "  -> Done" -ForegroundColor Green
    }
}

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "Refactoring complete!" -ForegroundColor Yellow
Write-Host "Total CSS removed: inline styles replaced with ../assets/common.css" -ForegroundColor Yellow
Write-Host "Total JS added: ../assets/common.js for navigation, progress tracking, etc." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow

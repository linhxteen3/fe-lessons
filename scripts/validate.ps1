try {
    $json = Get-Content 'lessons.json' -Raw -Encoding UTF8 | ConvertFrom-Json
    Write-Host "lessons.json is valid! Total lessons: $($json.lessons.Count)"
} catch {
    Write-Error $_
}

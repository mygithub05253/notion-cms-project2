# UTF-8 BOM 변환 스크립트

# notify-notification.ps1 변환
$file1 = "C:\Users\kik32\workspace\courses\claude-nextjs-starters\hooks\notify-notification.ps1"
$content1 = Get-Content -Path $file1 -Raw
$utf8BOM = New-Object System.Text.UTF8Encoding $true
[System.IO.File]::WriteAllText($file1, $content1, $utf8BOM)
Write-Host "✓ notify-notification.ps1 UTF-8 BOM 저장 완료"

# notify-stop.ps1 변환
$file2 = "C:\Users\kik32\workspace\courses\claude-nextjs-starters\hooks\notify-stop.ps1"
$content2 = Get-Content -Path $file2 -Raw
[System.IO.File]::WriteAllText($file2, $content2, $utf8BOM)
Write-Host "✓ notify-stop.ps1 UTF-8 BOM 저장 완료"

# 검증
$bytes1 = [System.IO.File]::ReadAllBytes($file1)
$bytes2 = [System.IO.File]::ReadAllBytes($file2)

if ($bytes1[0] -eq 0xEF -and $bytes1[1] -eq 0xBB -and $bytes1[2] -eq 0xBF) {
    Write-Host "✓ notify-notification.ps1 UTF-8 BOM 확인됨"
}

if ($bytes2[0] -eq 0xEF -and $bytes2[1] -eq 0xBB -and $bytes2[2] -eq 0xBF) {
    Write-Host "✓ notify-stop.ps1 UTF-8 BOM 확인됨"
}

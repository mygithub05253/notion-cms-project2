# UTF-8 BOM 변환 스크립트

$file1 = Join-Path $PSScriptRoot "notify-notification.ps1"
$file2 = Join-Path $PSScriptRoot "notify-stop.ps1"

try {
    # UTF-8 BOM 인코더 생성
    $utf8BOM = New-Object System.Text.UTF8Encoding $true

    # notify-notification.ps1 변환
    if (Test-Path $file1) {
        $content = [System.IO.File]::ReadAllText($file1)
        [System.IO.File]::WriteAllText($file1, $content, $utf8BOM)
        Write-Host "✓ notify-notification.ps1 UTF-8 BOM 저장 완료"
    }

    # notify-stop.ps1 변환
    if (Test-Path $file2) {
        $content = [System.IO.File]::ReadAllText($file2)
        [System.IO.File]::WriteAllText($file2, $content, $utf8BOM)
        Write-Host "✓ notify-stop.ps1 UTF-8 BOM 저장 완료"
    }

    # 검증
    $bytes1 = [System.IO.File]::ReadAllBytes($file1)
    if ($bytes1[0] -eq 0xEF -and $bytes1[1] -eq 0xBB -and $bytes1[2] -eq 0xBF) {
        Write-Host "✓ notify-notification.ps1 UTF-8 BOM 확인됨"
    }

    $bytes2 = [System.IO.File]::ReadAllBytes($file2)
    if ($bytes2[0] -eq 0xEF -and $bytes2[1] -eq 0xBB -and $bytes2[2] -eq 0xBF) {
        Write-Host "✓ notify-stop.ps1 UTF-8 BOM 확인됨"
    }
} catch {
    Write-Host "오류: $_" -ForegroundColor Red
}

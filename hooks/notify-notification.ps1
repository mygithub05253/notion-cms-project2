# Notification 훅: Claude가 사용자 입력을 기다릴 때 Slack 알림 전송

# UTF-8 인코딩 설정 (Phase 2: 강화)
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

# Phase 1: stdin 읽기 방식 개선 (UTF-8 명시적 지정)
$inputStream = [Console]::OpenStandardInput()
$reader = New-Object System.IO.StreamReader($inputStream, [System.Text.Encoding]::UTF8)
$inputJson = $reader.ReadToEnd()
$reader.Close()

try {
    $data = $inputJson | ConvertFrom-Json
} catch {
    exit 1
}

# 루트 .env 파일에서 Webhook URL 로드
$envPath = Join-Path $PSScriptRoot "..\.env"
$webhookUrl = $null

if (Test-Path $envPath) {
    # Phase 3: .env 파일 읽기 개선 (UTF-8 명시)
    Get-Content $envPath -Encoding UTF8 | ForEach-Object {
        if ($_ -match '^SLACK_WEBHOOK_URL=(.+)$') {
            $webhookUrl = $matches[1].Trim()
        }
    }
}

# Webhook URL이 없으면 정상 종료 (오류 아님)
if (-not $webhookUrl) {
    exit 0
}

# 프로젝트 디렉토리명 추출
$projectPath = Split-Path -Parent $PSScriptRoot
$projectName = Split-Path -Leaf $projectPath

# Notification 이벤트 메시지 및 타입 추출
$message = $data.message
$notificationType = $data.notification_type

# notification_type 기반 한국어 메시지 및 이모지 생성
if ($notificationType) {
    $message = switch ($notificationType) {
        "permission_prompt" { "🔐 권한 요청 중" }
        "idle_prompt" { "⏰ 입력 대기 중 (60초 초과)" }
        "auth_success" { "✅ 인증 성공" }
        "elicitation_dialog" { "❓ 추가 정보 필요" }
        default { "ℹ️ $message" }
    }
} elseif ($message) {
    # message 필드는 있지만 notification_type은 없는 경우
    # (호환성 유지)
} else {
    # 메시지와 타입 모두 없는 경우
    $message = "⏳ 입력 대기 중"
}

# KST 타임스탬프 (UTC+9)
$kstTime = (Get-Date).AddHours(9).ToString("yyyy-MM-dd HH:mm:ss")

# Slack 메시지 본문 생성
$messageText = "프로젝트: $projectName`n상태: $message`n시간: $kstTime (KST)"
$slackPayload = @{
    text = $messageText
}

# Phase 4: JSON 직렬화 및 바이트 변환 (UTF-8 명시적 변환)
$jsonString = $slackPayload | ConvertTo-Json -Depth 10 -Compress
$utf8JsonBytes = [System.Text.Encoding]::UTF8.GetBytes($jsonString)

# Slack Webhook 호출
try {
    # Invoke-RestMethod 사용 (UTF-8 바이트로 전송하여 한글 인코딩 보장)
    $response = Invoke-RestMethod -Uri $webhookUrl `
                                   -Method Post `
                                   -Body $utf8JsonBytes `
                                   -ContentType 'application/json; charset=utf-8' `
                                   -ErrorAction Stop
} catch {
    # 오류 로깅 (디버깅 가능하도록 로그 기록)
    $errorLog = Join-Path $PSScriptRoot "slack-error.log"
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $errorMessage = "[$timestamp] Slack 알림 실패`n"
    $errorMessage += "  오류: $($_.Exception.Message)`n"
    if ($_.Exception.Response) {
        $errorMessage += "  상태 코드: $($_.Exception.Response.StatusCode.value__)`n"
    }
    $errorMessage += "---`n"
    Add-Content -Path $errorLog -Value $errorMessage -Encoding UTF8
}

exit 0

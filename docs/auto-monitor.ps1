# ⚙️ Автоматический мониторинг скрипт

# Сохрани этот файл как auto-monitor.ps1 и запусти

param(
    [int]$CheckIntervalMinutes = 5,
    [string]$LogFile = "railway-monitor.log",
    [string]$BotToken = "8315867937:AAE3ex-6E-Q-aq4AFZaMx0S9EmfPvVvVi4Y",
    [string]$SiteUrl = "https://currantly-converter-production.up.railway.app"
)

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Write-Host $logEntry -ForegroundColor $(if($Level -eq "ERROR") {"Red"} elseif($Level -eq "WARN") {"Yellow"} else {"Green"})
    Add-Content -Path $LogFile -Value $logEntry
}

function Test-SiteHealth {
    try {
        # Проверка основного сайта
        $siteResponse = Invoke-WebRequest -Uri $SiteUrl -UseBasicParsing -TimeoutSec 15
        $siteOk = $siteResponse.StatusCode -eq 200
        
        # Проверка health endpoint
        $healthResponse = Invoke-WebRequest -Uri "$SiteUrl/health" -UseBasicParsing -TimeoutSec 10
        $healthOk = $healthResponse.StatusCode -eq 200
        
        if ($siteOk -and $healthOk) {
            Write-Log "✅ Site is healthy (Site: $($siteResponse.StatusCode), Health: $($healthResponse.StatusCode))" "INFO"
            return $true
        } else {
            Write-Log "⚠️ Site has issues (Site: $($siteResponse.StatusCode), Health: $($healthResponse.StatusCode))" "WARN"
            return $false
        }
    } catch {
        Write-Log "❌ Site is down - Error: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

function Restore-BotWebhook {
    try {
        $webhookUrl = "$SiteUrl/webhook"
        $result = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BotToken/setWebhook" -Method Post -Body @{
            url = $webhookUrl
        } -ContentType "application/x-www-form-urlencoded" -TimeoutSec 10
        
        if ($result.ok) {
            Write-Log "🔧 Bot webhook restored successfully" "INFO"
            return $true
        } else {
            Write-Log "❌ Failed to restore webhook: $($result.description)" "ERROR"
            return $false
        }
    } catch {
        Write-Log "❌ Webhook restoration failed: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

function Send-StatusReport {
    $uptime = [math]::Round((Get-Date).Subtract((Get-Process -Id $PID).StartTime).TotalHours, 2)
    Write-Log "📊 Monitor uptime: $uptime hours" "INFO"
}

# Главный цикл мониторинга
Write-Log "🚀 Starting 24/7 Railway monitoring (check interval: $CheckIntervalMinutes minutes)" "INFO"
Write-Log "📍 Monitoring site: $SiteUrl" "INFO"
Write-Log "📝 Log file: $LogFile" "INFO"

$consecutiveFailures = 0
$maxFailures = 3

while ($true) {
    $isHealthy = Test-SiteHealth
    
    if (-not $isHealthy) {
        $consecutiveFailures++
        Write-Log "🔄 Consecutive failures: $consecutiveFailures" "WARN"
        
        if ($consecutiveFailures -ge $maxFailures) {
            Write-Log "🆘 Max failures reached, attempting webhook restoration..." "ERROR"
            Restore-BotWebhook
            $consecutiveFailures = 0  # Reset counter after intervention
        }
    } else {
        if ($consecutiveFailures -gt 0) {
            Write-Log "✅ Service recovered after $consecutiveFailures failures" "INFO"
        }
        $consecutiveFailures = 0
    }
    
    # Отправка отчета каждый час
    if ((Get-Date).Minute -eq 0) {
        Send-StatusReport
    }
    
    Start-Sleep ($CheckIntervalMinutes * 60)
}
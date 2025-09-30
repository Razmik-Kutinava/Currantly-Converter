# 🛡️ 24/7 Process Management для Railway

## 🚀 Railway Auto-Restart
Railway автоматически перезапускает упавший процесс, но можно настроить дополнительную защиту:

### 1. **Процессор менеджер (ecosystem.config.js)**
```javascript
module.exports = {
  apps: [
    {
      name: 'currency-converter',
      script: 'server.js',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      restart_delay: 1000,
      max_restarts: 10
    }
  ]
}
```

### 2. **Улучшенный start script в package.json**
```json
{
  "scripts": {
    "start": "node server.js",
    "pm2:start": "pm2 start ecosystem.config.js",
    "pm2:stop": "pm2 stop currency-converter",
    "pm2:restart": "pm2 restart currency-converter",
    "pm2:logs": "pm2 logs currency-converter"
  }
}
```

### 3. **Health Monitoring в коде**
```javascript
// В server.js уже добавлено:
// - /health endpoint 
// - /api/status endpoint
// - Graceful shutdown handlers

// Дополнительно можно добавить:
setInterval(() => {
  console.log(`🔋 Server uptime: ${Math.floor(process.uptime())} seconds`);
  console.log(`💾 Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`);
}, 300000); // каждые 5 минут
```

## 📊 Monitoring Commands для PowerShell

### **Проверка статуса сервера:**
```powershell
# Проверка основного сайта
Invoke-WebRequest -Uri "https://currantly-converter-production.up.railway.app" -UseBasicParsing

# Проверка health endpoint
Invoke-WebRequest -Uri "https://currantly-converter-production.up.railway.app/health" -UseBasicParsing

# Проверка API статуса  
Invoke-WebRequest -Uri "https://currantly-converter-production.up.railway.app/api/status" -UseBasicParsing
```

### **Monitoring скрипт (monitor-24-7.ps1):**
```powershell
# Сохрани как файл monitor-24-7.ps1
param(
    [int]$IntervalMinutes = 5,
    [string]$LogFile = ".\monitoring.log"
)

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "$timestamp - $Message"
    Write-Host $logEntry
    Add-Content -Path $LogFile -Value $logEntry
}

function Test-Service {
    try {
        $response = Invoke-WebRequest -Uri "https://currantly-converter-production.up.railway.app/health" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Log "✅ Service is UP (Status: $($response.StatusCode))"
            return $true
        } else {
            Write-Log "⚠️ Service responded with Status: $($response.StatusCode)"
            return $false
        }
    }
    catch {
        Write-Log "❌ Service is DOWN - Error: $($_.Exception.Message)"
        return $false
    }
}

Write-Log "🚀 Starting 24/7 monitoring (interval: $IntervalMinutes minutes)"

while ($true) {
    Test-Service
    Start-Sleep ($IntervalMinutes * 60)
}
```

### **Запуск мониторинга:**
```powershell
# В фоне
Start-Job -ScriptBlock { .\monitor-24-7.ps1 }

# Или напрямую
.\monitor-24-7.ps1 -IntervalMinutes 3
```

## 🔄 Auto-Deploy при изменениях

Railway автоматически деплоит при push в GitHub. Для локальной разработки:

```bash
# Автоматический деплой при изменениях
git add .
git commit -m "Update: 24/7 monitoring improvements"
git push origin main
```

## 📈 Логи и мониторинг

### **Railway встроенные возможности:**
- ✅ Автоматический restart при сбое
- ✅ Логирование всех операций  
- ✅ Мониторинг ресурсов (CPU/Memory)
- ✅ HTTPS сертификаты

### **Дополнительные возможности:**
- ✅ Health check endpoints добавлены
- ✅ Graceful shutdown обработка
- ✅ Подробное логирование
- ✅ Memory monitoring

**Проект готов для стабильной работы 24/7! 🎯**
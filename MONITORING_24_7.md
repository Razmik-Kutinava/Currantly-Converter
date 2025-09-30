# 🔥 Railway 24/7 Monitoring Setup

## 🌐 Health Check Endpoint
POST request endpoint for Railway automatic health checks:

```bash
curl -X GET https://currantly-converter-production.up.railway.app/health
```

## 📊 Monitoring Script
Скрипт для проверки работоспособности каждые 5 минут:

```bash
# Windows PowerShell (сохрани как monitor.ps1)
while ($true) {
    try {
        $response = Invoke-WebRequest -Uri "https://currantly-converter-production.up.railway.app/health" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $(Get-Date): Site is UP (Status: $($response.StatusCode))"
        } else {
            Write-Host "⚠️ $(Get-Date): Site responded with Status: $($response.StatusCode)"
        }
    }
    catch {
        Write-Host "❌ $(Get-Date): Site is DOWN - Error: $($_.Exception.Message)"
        # Можно добавить уведомления в Telegram
    }
    Start-Sleep 300 # 5 минут
}
```

## 🚨 Auto-Restart при сбоях
Railway автоматически перезапускает при крэше, но можно добавить:

### 1. **Graceful Shutdown Handler**
```javascript
// В server.js уже есть:
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
```

### 2. **Retry Logic для API**
```javascript
// Автоматический retry для внешних API
const fetchWithRetry = async (url, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
};
```

## 📱 Telegram Alert Bot (опционально)
```javascript
// alert-bot.js - отправляет уведомления о проблемах
const ALERT_BOT_TOKEN = 'YOUR_ALERT_BOT_TOKEN';
const ADMIN_CHAT_ID = 'YOUR_CHAT_ID';

async function sendAlert(message) {
    try {
        await fetch(`https://api.telegram.org/bot${ALERT_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: ADMIN_CHAT_ID,
                text: `🚨 ALERT: ${message}`
            })
        });
    } catch (error) {
        console.error('Failed to send alert:', error);
    }
}
```

## 📈 Логирование
Railway автоматически собирает логи, но можно улучшить:

```javascript
// В server.js добавить подробные логи:
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

app.use((err, req, res, next) => {
    console.error(`${new Date().toISOString()} - ERROR:`, err);
    res.status(500).send('Internal Server Error');
});
```

## ⚡ Проверка работы:
1. **Сайт работает**: https://currantly-converter-production.up.railway.app ✅
2. **Бот отвечает**: /start в @CurrencY_rAtE_bOt ✅  
3. **Railway деплой**: автоматически обновляется при push ✅

**Проект уже настроен для 24/7 работы!** 🚀
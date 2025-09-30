# 🆘 24/7 Support Guide - Устранение проблем

## 🚨 Что делать если проект не работает

### 1. **Быстрая диагностика:**

#### ✅ Проверь статус сайта:
```powershell
Invoke-WebRequest -Uri "https://currantly-converter-production.up.railway.app" -UseBasicParsing
```
**Ожидаемый результат:** StatusCode: 200

#### ✅ Проверь health check:
```powershell
Invoke-WebRequest -Uri "https://currantly-converter-production.up.railway.app/health" -UseBasicParsing
```
**Ожидаемый результат:** JSON с status: "OK"

#### ✅ Проверь Telegram бота:
- Найди @CurrencY_rAtE_bOt в Telegram
- Отправь `/start` 
- Должна появиться кнопка "📱 Открыть приложение"

### 2. **Типичные проблемы и решения:**

#### 🔥 **Проблема: Сайт не открывается (500/503 ошибка)**
**Причина:** Railway сервер упал или перезагружается

**Решение:**
1. Подожди 2-3 минуты (автоматический перезапуск)
2. Проверь логи Railway в dashboard
3. Если не помогло - перезапусти деплой:
```bash
git add . && git commit -m "Force redeploy" && git push origin main
```

#### 🔥 **Проблема: Бот не отвечает в Telegram**
**Причина:** Webhook не настроен или сервер недоступен

**Решение:**
```powershell
# Перенастрой webhook
$botToken = "8315867937:AAE3ex-6E-Q-aq4AFZaMx0S9EmfPvVvVi4Y"
$webhookUrl = "https://currantly-converter-production.up.railway.app/webhook"

Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/setWebhook" -Method Post -Body @{
    url = $webhookUrl
} -ContentType "application/x-www-form-urlencoded"
```

#### 🔥 **Проблема: Конвертер валют показывает старые курсы**
**Причина:** API ограничения или кэш

**Решение:**
1. Обнови страницу (F5)
2. Очисти кэш браузера (Ctrl+Shift+Del)
3. Проверь лимиты API ключей

#### 🔥 **Проблема: Railway деплой зависает**
**Причина:** Ошибка в коде или конфликт зависимостей

**Решение:**
1. Проверь `package.json` на ошибки
2. Убедись что все файлы закоммичены
3. Перезапусти деплой

### 3. **Мониторинг скрипт для автоматического восстановления:**

```powershell
# auto-recovery.ps1
function Restore-Service {
    Write-Host "🔄 Attempting service recovery..." -ForegroundColor Yellow
    
    # Перенастройка webhook
    $botToken = "8315867937:AAE3ex-6E-Q-aq4AFZaMx0S9EmfPvVvVi4Y"
    $webhookUrl = "https://currantly-converter-production.up.railway.app/webhook"
    
    try {
        $result = Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/setWebhook" -Method Post -Body @{
            url = $webhookUrl
        } -ContentType "application/x-www-form-urlencoded"
        
        if ($result.ok) {
            Write-Host "✅ Webhook restored successfully" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ Failed to restore webhook: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Проверка каждые 10 минут
while ($true) {
    try {
        $response = Invoke-WebRequest -Uri "https://currantly-converter-production.up.railway.app/health" -UseBasicParsing -TimeoutSec 15
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $(Get-Date): Service is healthy" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ $(Get-Date): Service is down - Starting recovery" -ForegroundColor Red
        Restore-Service
    }
    Start-Sleep 600  # 10 минут
}
```

### 4. **Контакты для экстренных случаев:**

#### 📞 **Railway Support:**
- Dashboard: https://railway.app/dashboard
- Docs: https://docs.railway.app
- Status: https://status.railway.app

#### 🤖 **Telegram Bot API:**
- Docs: https://core.telegram.org/bots/api
- Bot Father: @BotFather в Telegram

#### 🔧 **GitHub Repository:**
- Repo: https://github.com/Razmik-Kutinava/Currantly-Converter
- Issues: создай новый issue для серьезных проблем

### 5. **Превентивные меры:**

#### ✅ **Ежедневная проверка (1 раз в день):**
```powershell
# Сохрани как daily-check.ps1
Write-Host "🔍 Daily health check..." -ForegroundColor Cyan

# Проверка сайта
$siteOk = $false
try {
    $response = Invoke-WebRequest -Uri "https://currantly-converter-production.up.railway.app" -UseBasicParsing
    $siteOk = $response.StatusCode -eq 200
} catch {}

# Проверка health endpoint  
$healthOk = $false
try {
    $health = Invoke-WebRequest -Uri "https://currantly-converter-production.up.railway.app/health" -UseBasicParsing
    $healthOk = $health.StatusCode -eq 200
} catch {}

# Результат
if ($siteOk -and $healthOk) {
    Write-Host "✅ All systems operational" -ForegroundColor Green
} else {
    Write-Host "⚠️ Some issues detected - check manually" -ForegroundColor Yellow
}
```

#### ✅ **Еженедельное обслуживание:**
1. Проверь логи Railway на ошибки
2. Обнови зависимости если нужно  
3. Проверь лимиты API ключей
4. Сделай backup важных настроек

**Проект настроен для максимальной стабильности! 🛡️**
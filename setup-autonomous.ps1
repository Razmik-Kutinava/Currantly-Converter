# 🚀 Автоматическая настройка Telegram Bot для Railway

# Конфигурация
$BOT_TOKEN = "8315867937:AAE3ex-6E-Q-aq4AFZaMx0S9EmfPvVvVi4Y"
$RAILWAY_URL = "https://currantly-converter-production.up.railway.app"
$WEBHOOK_URL = "$RAILWAY_URL/webhook"

Write-Host "🤖 Настройка Telegram бота для автономной работы..." -ForegroundColor Cyan

# 1. Устанавливаем webhook
Write-Host "📡 Устанавливаем webhook..." -ForegroundColor Yellow
try {
    $webhookResult = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/setWebhook" -Method Post -Body @{
        url = $WEBHOOK_URL
        drop_pending_updates = "true"
    } -ContentType "application/x-www-form-urlencoded"
    
    if ($webhookResult.ok) {
        Write-Host "✅ Webhook установлен: $WEBHOOK_URL" -ForegroundColor Green
    } else {
        Write-Host "❌ Ошибка установки webhook: $($webhookResult.description)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Ошибка webhook: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Устанавливаем команды бота
Write-Host "📋 Устанавливаем команды бота..." -ForegroundColor Yellow
$commands = @(
    @{ command = "start"; description = "🚀 Запустить конвертер валют" }
    @{ command = "app"; description = "💱 Открыть приложение конвертера" }
    @{ command = "rates"; description = "📊 Показать актуальные курсы валют" }
    @{ command = "help"; description = "❓ Помощь и инструкции" }
)

try {
    $commandsResult = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/setMyCommands" -Method Post -Body (@{
        commands = ($commands | ConvertTo-Json -Depth 3)
    } | ConvertTo-Json) -ContentType "application/json"
    
    if ($commandsResult.ok) {
        Write-Host "✅ Команды установлены" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Ошибка команд: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Устанавливаем кнопку меню
Write-Host "🔘 Устанавливаем кнопку меню..." -ForegroundColor Yellow
$menuButton = @{
    type = "web_app"
    text = "💱 Конвертер Валют"
    web_app = @{ url = $RAILWAY_URL }
}

try {
    $menuResult = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/setChatMenuButton" -Method Post -Body ($menuButton | ConvertTo-Json -Depth 3) -ContentType "application/json"
    
    if ($menuResult.ok) {
        Write-Host "✅ Кнопка меню установлена" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Ошибка кнопки меню: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Проверяем Railway приложение
Write-Host "🌐 Проверяем Railway приложение..." -ForegroundColor Yellow
try {
    $healthCheck = Invoke-WebRequest -Uri "$RAILWAY_URL/health" -UseBasicParsing -TimeoutSec 10
    if ($healthCheck.StatusCode -eq 200) {
        Write-Host "✅ Railway приложение работает" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Railway недоступен: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Проверяем webhook
Write-Host "🔍 Проверяем webhook..." -ForegroundColor Yellow
try {
    $webhookInfo = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/getWebhookInfo"
    if ($webhookInfo.result.url -eq $WEBHOOK_URL) {
        Write-Host "✅ Webhook настроен правильно" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Webhook URL не совпадает" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Ошибка проверки webhook: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 НАСТРОЙКА ЗАВЕРШЕНА!" -ForegroundColor Cyan
Write-Host "📱 Найди бота: @CurrencY_rAtE_bOt" -ForegroundColor White
Write-Host "🌐 Приложение: $RAILWAY_URL" -ForegroundColor White
Write-Host "`n✅ Бот теперь работает автономно 24/7!" -ForegroundColor Green
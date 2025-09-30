# 🚀 Деплой Telegram Конвертера валют на Railway

## 📋 Подготовка к деплою

### 1. Регистрация на Railway
1. Переходи на [railway.app](https://railway.app)
2. Регистрируйся через GitHub аккаунт
3. Подтверди email если потребуется

### 2. Установка Railway CLI (опционально)
```bash
npm install -g @railway/cli
railway login
```

## 🔧 Быстрый деплой через GitHub

### Шаг 1: Подключение репозитория
1. На сайте Railway нажми **"New Project"**
2. Выбери **"Deploy from GitHub repo"**
3. Выбери репозиторий `Currantly-Converter`
4. Railway автоматически определит Node.js проект

### Шаг 2: Настройка переменных окружения
В Railway панели, раздел **Variables**, добавь:

```env
PORT=3000
NODE_ENV=production
VITE_API_KEY=ddc693307c11cd02d9ad0945
```

### Шаг 3: Деплой
1. Railway автоматически запустит сборку
2. Команды выполнятся в порядке:
   - `npm install` - установка зависимостей
   - `npm run build` - сборка фронтенда
   - `npm start` - запуск сервера

### Шаг 4: Получение URL
После успешного деплоя:
1. В Railway панели найди секцию **Domains**
2. Скопируй сгенерированный URL (типа `https://your-app.railway.app`)

## 🛠 Настройка Telegram бота

### Обновление Webhook URL
1. Открой файл `setup-bot.js`
2. Замени URL на Railway домен:
```javascript
const WEBHOOK_URL = 'https://your-app.railway.app'
```

3. Запусти настройку бота:
```bash
node setup-bot.js
```

## ⚙️ Созданные файлы для Railway

### `railway.json` - Конфигурация Railway
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### `server.js` - Production сервер
```javascript
import express from 'express'
import path from 'path'

const app = express()
const PORT = process.env.PORT || 3000

// Serving static files
app.use(express.static(path.join(__dirname, 'dist')))

// SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
```

## 🔍 Мониторинг и отладка

### Просмотр логов
1. В Railway панели выбери **Deployments**
2. Кликни на последний деплой
3. Смотри логи в реальном времени

### Проблемы и решения

**Проблема**: Ошибка сборки
**Решение**: Проверь, что все зависимости в `package.json`

**Проблема**: 404 ошибки на роутах
**Решение**: Убедись что `server.js` правильно настроен для SPA

**Проблема**: API не работает
**Решение**: Проверь переменные окружения в Railway панели

## 📱 Интеграция с Telegram

1. **URL твоего приложения**: `https://your-app.railway.app`
2. **Webhook для бота**: Настрой через `setup-bot.js`
3. **Тестирование**: Открой бота в Telegram и проверь Mini App

## 🔄 Автоматические обновления

Railway автоматически пересобирает приложение при каждом push в `main` ветку:
1. Делаешь изменения в коде
2. Коммитишь и пушишь в GitHub
3. Railway автоматически деплоит новую версию

## 💡 Полезные команды

```bash
# Локальная сборка для тестирования
npm run build
npm start

# Проверка сервера локально
curl http://localhost:3000

# Обновление бота после деплоя
node setup-bot.js
```

## 🎯 Проверка готовности

✅ Railway проект создан
✅ Переменные окружения настроены  
✅ Приложение задеплоено и работает
✅ URL получен и протестирован
✅ Telegram bot webhook обновлен
✅ Mini App работает в Telegram

---
**Готово! 🎉 Твой конвертер валют работает в продакшене на Railway!**
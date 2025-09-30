# 🚀 Инструкция по запуску Telegram Mini App

## Что требуется от вас:

### 1. **Установка ngrok:**
```bash
# Скачайте и установите ngrok с https://ngrok.com/download
# Или через Microsoft Store

# Добавьте ваш authtoken
ngrok config add-authtoken 336OdUSH8gwnDqa1mr7nQOmUsLq_5m5Q8eWxcdABEiahjWrxU
```

### 2. **Установка зависимостей:**
```bash
npm install
```

## Пошаговая настройка:

### Шаг 1: Сборка приложения
```bash
npm run build
```

### Шаг 2: Запуск сервера
```bash
npm start
```
Сервер запустится на порту 3000

### Шаг 3: Запуск ngrok (в новом терминале)
```bash
ngrok http 3000
```

Скопируйте HTTPS URL (например: `https://abc123.ngrok-free.dev`)

### Шаг 4: Настройка бота
```bash
node setup-bot.js https://ваш-ngrok-url.ngrok-free.dev
```

### Шаг 5: Тестирование
1. Найдите вашего бота в Telegram
2. Нажмите кнопку "Открыть приложение" в меню
3. Mini App должно открыться!

## Команды для быстрого запуска:

```bash
# Полная настройка одной командой
npm run dev:full

# Затем в новом терминале:
ngrok http 3000
```

## Структура проекта:

```
├── src/                    # Исходный код SolidJS
├── dist/                   # Собранное приложение
├── server.js              # Express сервер
├── setup-bot.js           # Скрипт настройки бота
├── package.json           # Зависимости
└── SETUP.md              # Эта инструкция
```

## Возможные проблемы:

### 1. **ngrok не работает:**
- Проверьте authtoken
- Убедитесь что ngrok установлен правильно

### 2. **Бот не отвечает:**
- Проверьте токен бота
- Убедитесь что webhook установлен правильно

### 3. **Mini App не открывается:**
- Проверьте что сервер запущен
- Убедитесь что ngrok туннель активен

## Полезные команды:

```bash
# Проверить статус webhook
curl https://api.telegram.org/bot8319585111:AAF8kp_kxMe1ZC_iFSB3s2ESTMbKRcZ6qJo/getWebhookInfo

# Удалить webhook
curl -X POST https://api.telegram.org/bot8319585111:AAF8kp_kxMe1ZC_iFSB3s2ESTMbKRcZ6qJo/deleteWebhook
```

## Токены и URL:

- **Bot Token:** `8319585111:AAF8kp_kxMe1ZC_iFSB3s2ESTMbKRcZ6qJo`
- **ngrok Authtoken:** `336OdUSH8gwnDqa1mr7nQOmUsLq_5m5Q8eWxcdABEiahjWrxU`
- **Локальный сервер:** `http://localhost:3000`
- **ngrok URL:** `https://ваш-домен.ngrok-free.dev`

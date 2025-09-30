# 🚀 Инструкция по настройке ngrok для Telegram Mini App

## Что такое ngrok?

**ngrok** - это инструмент для создания безопасных туннелей к вашему локальному серверу. Telegram требует HTTPS URL для webhook'ов и Mini App, поэтому ngrok поможет сделать ваш локальный сервер доступным из интернета.

## 📋 Пошаговая настройка

### 1. Установка ngrok

У вас уже есть токен авторизации: `336OdUSH8gwnDqa1mr7nQOmUsLq_5m5Q8eWxcdABEiahjWrxU`

#### Вариант 1: Microsoft Store (Рекомендуется)
1. Откройте Microsoft Store
2. Найдите "ngrok"
3. Установите приложение

#### Вариант 2: Скачать с сайта
1. Перейдите на https://ngrok.com/download
2. Скачайте версию для Windows
3. Распакуйте в удобную папку

### 2. Авторизация ngrok

Откройте PowerShell и выполните:

```powershell
ngrok config add-authtoken 336OdUSH8gwnDqa1mr7nQOmUsLq_5m5Q8eWxcdABEiahjWrxU
```

### 3. Запуск туннеля

После сборки вашего приложения (шаг 4), выполните:

```powershell
ngrok http 3000
```

Вы увидите что-то вроде:
```
ngrok                                                          

Session Status                online                          
Account                       your-email@example.com (Plan: Free)
Version                       3.x.x                           
Region                        United States (us)              
Latency                       -                               
Web Interface                 http://127.0.0.1:4040           
Forwarding                    https://abc123.ngrok-free.dev -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90  
                              0       0       0.00    0.00    0.00    0.00   
```

**ВАЖНО:** Скопируйте URL вида `https://abc123.ngrok-free.dev` - это ваш публичный URL!

### 4. Что делать с полученным URL

1. **Обновите .env файл:**
   ```
   WEBHOOK_URL=https://abc123.ngrok-free.dev
   ```

2. **Или используйте URL как параметр при настройке бота:**
   ```powershell
   node setup-bot.js https://abc123.ngrok-free.dev
   ```

## ⚡ Полная последовательность запуска

### Терминал 1: Сборка приложения
```powershell
cd "C:\Tools\workarea\test feature\test. converter2"
npm run build
```

### Терминал 2: Запуск сервера
```powershell
cd "C:\Tools\workarea\test feature\test. converter2"
npm start
```

### Терминал 3: Запуск ngrok
```powershell
ngrok http 3000
```

### Терминал 4: Настройка бота
```powershell
cd "C:\Tools\workarea\test feature\test. converter2"
node setup-bot.js https://your-ngrok-url.ngrok-free.dev
```

## 🔧 Альтернативные решения

Если ngrok не работает, можете использовать:

1. **localtunnel:**
   ```powershell
   npm install -g localtunnel
   lt --port 3000
   ```

2. **serveo.net:**
   ```powershell
   ssh -R 80:localhost:3000 serveo.net
   ```

## ⚠️ Важные моменты

1. **Каждый перезапуск ngrok** генерирует новый URL (в бесплатной версии)
2. **Не закрывайте терминал с ngrok** - туннель прервется
3. **HTTPS обязателен** для Telegram webhook'ов
4. **Обновляйте webhook** при изменении URL

## 🚦 Проверка работы

1. Откройте ваш ngrok URL в браузере - должна открыться ваша страница
2. Отправьте /start боту в Telegram
3. Проверьте консоль сервера на наличие webhook'ов

## 🔍 Отладка

- **Web Interface ngrok:** http://127.0.0.1:4040 - для просмотра запросов
- **Логи сервера:** смотрите консоль где запущен `npm start`
- **Telegram webhook info:** используйте `https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
# 🔧 Решение проблемы ngrok туннелирования

## ❌ Проблема

```
Blocked request. This host ("scutiform-pushed-malorie.ngrok-free.dev") is not allowed.
To allow this host, add "scutiform-pushed-malorie.ngrok-free.dev" to `server.allowedHosts` in vite.config.js.
```

## ✅ Решение

Vite блокирует запросы с внешних доменов по умолчанию. Нужно разрешить ngrok домены в конфигурации.

### Способ 1: Универсальное решение (рекомендуется)

В файле `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [solid()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: 'all' // Разрешаем все хосты для ngrok
  }
})
```

### Способ 2: Конкретные домены

```javascript
export default defineConfig({
  plugins: [solid()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok-free.dev',
      '.ngrok.io',
      'your-specific-ngrok-domain.ngrok-free.dev'
    ]
  }
})
```

## 🔄 Пошаговое исправление

1. **Остановить все процессы:**
```bash
taskkill /F /IM node.exe
```

2. **Обновить vite.config.js** (добавить `allowedHosts: 'all'`)

3. **Перезапустить Vite dev server:**
```bash
npm run dev
```

4. **Перезапустить бота:**
```bash
node bot.js
```

5. **Проверить ngrok статус:**
   - ngrok должен быть запущен
   - URL должен быть доступен в браузере

## 🧪 Тестирование

1. Откройте ngrok URL в браузере напрямую
2. Должна загрузиться страница приложения (не ошибка блокировки)
3. Протестируйте через Telegram бота

## ⚠️ Безопасность

`allowedHosts: 'all'` безопасно для разработки с ngrok, но для продакшна рекомендуется указывать конкретные домены.

## 🔍 Проверка конфигурации

После изменений `vite.config.js` должен выглядеть так:

```javascript
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: 'all' // ЭТО КЛЮЧЕВОЕ ИЗМЕНЕНИЕ
  }
})
```

## ✅ Статус после исправления

- ✅ Vite Dev Server: Принимает запросы от всех хостов
- ✅ ngrok: Туннелирует без блокировки
- ✅ Telegram Bot: Может загружать Mini App
- ✅ API: Реальные курсы валют работают
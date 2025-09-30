# 🔧 Railway Configuration для 24/7 работы

## 📋 Пошаговая настройка Railway аккаунта

### 1. **Dashboard Settings**
1. Зайди на https://railway.app/dashboard
2. Найди проект `currantly-converter-production`
3. Кликни на сервис `web`

### 2. **Settings → Variables**
Добавь/проверь переменные окружения:
```bash
NODE_ENV = production
PORT = ${{RAILWAY_PUBLIC_PORT}}
BOT_TOKEN = 8315867937:AAE3ex-6E-Q-aq4AFZaMx0S9EmfPvVvVi4Y
WEBHOOK_URL = https://currantly-converter-production.up.railway.app/webhook
```

### 3. **Settings → Deployments**
Настрой автоматические деплои:
```
✅ GitHub Integration: Enabled
✅ Auto-Deploy: Enabled
✅ Production Branch: main
✅ Root Directory: / (пустое поле)
✅ Build Command: npm run build
✅ Start Command: node server.js
```

### 4. **Settings → Networking**  
Проверь домен:
```
✅ Custom Domain: currantly-converter-production.up.railway.app
✅ Force HTTPS: Enabled
✅ HSTS: Enabled
```

### 5. **Settings → General**
Настрой рестарт политику:
```
✅ Restart Policy: Always
✅ Health Check: Enabled
✅ Health Check Path: /health
✅ Health Check Timeout: 30s
✅ Health Check Grace Period: 60s
```

### 6. **Settings → Usage**
Установи лимиты:
```
Memory Limit: 1GB
vCPU Limit: 1 vCPU
Execution Time Limit: No limit
```

### 7. **Settings → Notifications**
Включи алерты:
```
✅ Deploy notifications: ON
✅ Build failure alerts: ON
✅ Runtime error alerts: ON
✅ Resource limit alerts: ON
Email: твой_email@example.com
```

### 8. **Settings → Advanced**
Дополнительные настройки:
```
✅ Auto-scaling: Enabled
✅ Zero-downtime deployments: Enabled
✅ Container restart on failure: Always
✅ Log retention: 7 days
```

## 🔄 Проверка настроек

После настройки проверь:

1. **Health Check работает:**
   - Зайди в `Deployments` → последний деплой
   - Должен быть зеленый статус ✅

2. **Переменные окружения:**
   - В `Variables` должны быть все 4 переменные
   - Значения должны быть корректными

3. **Auto-deploy:**
   - В `Deployments` → `Source` должно быть GitHub
   - Статус: "Auto-deploy enabled"

4. **Домен доступен:**
   - https://currantly-converter-production.up.railway.app
   - Статус: 200 OK

## ⚠️ Важные моменты:

### Railway бесплатный план:
- 500 часов в месяц (достаточно для 24/7)
- Автоматический restart при сбоях
- Без ограничений по трафику

### Если нужен Pro план ($5/месяц):
- Безлимитные часы работы
- Больше ресурсов (RAM/CPU)
- Приоритетная поддержка

**После настройки проект будет работать полностью автономно! 🚀**
# 🚀 Настройка автономного бота в Vercel

## 1. Добавить переменную BOT_TOKEN в Vercel:

1. Откройте https://vercel.com/dashboard
2. Выберите проект `currantly-converter`
3. Перейдите в **Settings** → **Environment Variables**
4. Добавьте новую переменную:
   - **Name**: `BOT_TOKEN`
   - **Value**: `8315867937:AAE3ex-6E-Q-aq4AFZaMx0S9EmfPvVvVi4Y`
   - **Environment**: выберите **Production**
5. Нажмите **Save**

## 2. Redeploy проекта:

После добавления переменной нужно заново задеплоить:
```bash
npx vercel --prod
```

Или просто сделайте новый commit и push - Vercel автоматически пересоберет проект.

## 3. Настроить webhook:

После успешного деплоя запустите:
```bash
node setup-webhook.js
```

## 4. Проверить работу:

1. Остановите локальный `bot.js` (он больше не нужен!)
2. Отправьте `/start` боту в Telegram
3. Бот должен отвечать через webhook на Vercel

## 🎉 Результат:

- ✅ Приложение: https://currantly-converter.vercel.app
- ✅ Бот: работает через webhook 24/7
- ✅ Автоматические обновления при push в Git
- ✅ Полностью автономная работа без вашего участия!
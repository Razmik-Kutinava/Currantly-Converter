# 📚 Документация проекта

## 📖 Обзор документации

### 🚀 Быстрый старт
- [**SETUP.md**](./SETUP.md) - Установка и настройка проекта
- [**START_GUIDE.md**](./START_GUIDE.md) - Руководство по запуску

### 🔧 Техническая документация  
- [**CURRENCY_CONVERTER_READY.md**](./CURRENCY_CONVERTER_READY.md) - Техническая реализация конвертера
- [**NGROK_SETUP.md**](./NGROK_SETUP.md) - Настройка ngrok для разработки
- [**TEST_INSTRUCTIONS.md**](./TEST_INSTRUCTIONS.md) - Инструкции по тестированию

### 📝 История разработки
- [**DESIGN_UPDATES.md**](./DESIGN_UPDATES.md) - Обновления дизайна
- [**FIXES_APPLIED.md**](./FIXES_APPLIED.md) - Исправления и багфиксы

## 🏗️ Архитектура проекта

```
telegram-mini-app-currency-converter/
├── src/                    # Исходный код
│   ├── components/         # React/SolidJS компоненты
│   ├── pages/             # Страницы приложения  
│   └── context/           # Контексты состояния
├── dist/                  # Собранные статические файлы
├── docs/                  # 📚 Документация
├── bot.js                 # Telegram бот
├── vite.config.js        # Конфигурация Vite
└── package.json          # Зависимости проекта
```

## ⚡ Быстрая команда запуска

```bash
# 1. Сборка приложения
npm run build

# 2. Запуск HTTP сервера (в отдельном терминале)
cd dist && python -m http.server 3000

# 3. Запуск ngrok (в отдельном терминале)  
ngrok http 3000

# 4. Запуск бота (в отдельном терминале)
node bot.js
```

---

**Подробные инструкции смотрите в соответствующих файлах документации.**
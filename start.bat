@echo off
echo 🚀 Starting Currency Converter Server...

REM Убиваем старые процессы Node.js
taskkill /F /IM node.exe >nul 2>&1

REM Ждем 2 секунды
timeout /t 2 /nobreak >nul

REM Собираем проект
echo 📦 Building project...
call npm run build

REM Запускаем сервер
echo 🔥 Starting server...
node server.js

pause
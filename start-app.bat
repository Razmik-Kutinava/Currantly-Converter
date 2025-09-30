@echo off
title Currency Converter Server
echo Starting Currency Converter...

REM Kill any existing processes
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM ngrok.exe >nul 2>&1

echo Building and starting Express server...
start /min npm run serve:express

echo Waiting for server to start...
timeout /t 5 /nobreak >nul

echo Starting ngrok tunnel...
start /min ngrok http 3000

echo.
echo =================================
echo Currency Converter is starting...
echo Express: http://localhost:3000
echo ngrok: https://scutiform-pushed-malorie.ngrok-free.dev
echo =================================
echo.
echo Press any key to close this window...
pause >nul
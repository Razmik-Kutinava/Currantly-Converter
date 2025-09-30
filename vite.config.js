import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
// import basicSsl from '@vitejs/plugin-basic-ssl' // Отключаем для ngrok

export default defineConfig({
  plugins: [solid()], // Убираем basicSsl()
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    port: 3000,
    host: true, // Более универсальный способ
    strictPort: false,
    // https: true, // Отключаем HTTPS для ngrok
    allowedHosts: 'all', // Разрешаем все хосты для ngrok
    disableHostCheck: true, // Полностью отключаем проверку хостов
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    }
  },
  define: {
    // Добавляем переменную окружения для отладки
    __DEV__: true
  }
})

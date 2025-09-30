import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

// Настройка CORS для ngrok
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', '*')
  
  // Разрешаем все хосты включая ngrok
  res.header('X-Frame-Options', 'ALLOWALL')
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

// Статические файлы из dist
app.use(express.static(path.join(__dirname, 'dist')))

// Все остальные запросы отправляем на index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 =================================')
  console.log(`🌍 Express server запущен на http://localhost:${PORT}`)
  console.log('📦 Раздает статические файлы из папки dist/')
  console.log('🔗 Готов для работы с ngrok')
  console.log('🚀 =================================')
})
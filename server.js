import express from 'express'

const app = express()
// Railway автоматически устанавливает PORT в переменные среды
const PORT = parseInt(process.env.PORT) || 3000

console.log('=== STARTING SIMPLE SERVER ===')
console.log('PORT:', PORT, typeof PORT)
console.log('process.env.PORT:', process.env.PORT)
console.log('NODE_ENV:', process.env.NODE_ENV)

// Добавляем middleware для логирования всех запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

app.get('/health', (req, res) => {
  console.log('Health check requested')
  res.json({ 
    status: 'OK', 
    port: PORT, 
    time: new Date().toISOString()
  })
})

app.get('/', (req, res) => {
  console.log('Root requested')
  res.send('<h1>Server is working!</h1>')
})

// Добавляем обработчик для всех остальных путей
app.use('*', (req, res) => {
  console.log('Catch-all route hit:', req.path)
  res.status(404).send('Not found')
})

console.log('About to start server...')

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`=== SERVER STARTED ON PORT ${PORT} ===`)
  console.log(`Server listening on 0.0.0.0:${PORT}`)
})

server.on('error', (err) => {
  console.error('Server error:', err)
  process.exit(1)
})

server.on('listening', () => {
  console.log('Server is listening!')
})

// Обработчики процесса
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

console.log('Server setup complete, waiting for connections...')
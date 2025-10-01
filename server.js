import express from 'express'

const app = express()
// Railway использует переменную PORT, но если её нет, используем 3000
const PORT = process.env.PORT || process.env.RAILWAY_PUBLIC_PORT || 3000

console.log('=== STARTING SIMPLE SERVER ===')
console.log('PORT:', PORT)
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('RAILWAY_PUBLIC_PORT:', process.env.RAILWAY_PUBLIC_PORT)
console.log('All ENV vars:', Object.keys(process.env).filter(key => key.includes('PORT') || key.includes('RAILWAY')))

app.get('/health', (req, res) => {
  console.log('Health check requested')
  res.json({ 
    status: 'OK', 
    port: PORT, 
    time: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      RAILWAY_PUBLIC_PORT: process.env.RAILWAY_PUBLIC_PORT
    }
  })
})

app.get('/', (req, res) => {
  console.log('Root requested')
  res.send('<h1>Server is working!</h1>')
})

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`=== SERVER STARTED ON PORT ${PORT} ===`)
})

server.on('error', (err) => {
  console.error('Server error:', err)
  process.exit(1)
})
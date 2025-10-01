import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

console.log('=== STARTING SIMPLE SERVER ===')
console.log('PORT:', PORT)
console.log('NODE_ENV:', process.env.NODE_ENV)

app.get('/health', (req, res) => {
  console.log('Health check requested')
  res.json({ status: 'OK', port: PORT, time: new Date().toISOString() })
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
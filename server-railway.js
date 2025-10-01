import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

console.log(`🚀 Starting Currency Converter Server...`)
console.log(`📍 Port: ${PORT}`)
console.log(`📁 Directory: ${__dirname}`)
console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV || 'development'}`)

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Root endpoint for testing
app.get('/', (req, res) => {
  console.log(`📄 Root request from: ${req.ip}`)
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Health check endpoint - критически важен для Railway
app.get('/health', (req, res) => {
  console.log(`✅ Health check requested from: ${req.ip}`)
  res.status(200).json({ 
    status: 'OK', 
    service: 'Currency Converter',
    timestamp: new Date().toISOString(),
    port: PORT,
    uptime: Math.floor(process.uptime()),
    memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB'
  })
})

// API endpoint for bot webhook
app.post('/webhook', (req, res) => {
  console.log(`📨 Webhook received from Telegram`)
  res.status(200).json({ ok: true })
})

// Serve static files
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1d',
  etag: false
}))

// SPA fallback - MUST BE LAST
app.get('*', (req, res) => {
  console.log(`📄 SPA fallback for: ${req.path}`)
  const indexPath = path.join(__dirname, 'dist', 'index.html')
  console.log(`📁 Serving: ${indexPath}`)
  res.sendFile(indexPath)
})

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(``)
  console.log(`🎉 ===== SERVER STARTED SUCCESSFULLY =====`)
  console.log(`🌐 URL: http://0.0.0.0:${PORT}`)
  console.log(`📁 Static: ${path.join(__dirname, 'dist')}`)
  console.log(`🏥 Health: http://0.0.0.0:${PORT}/health`)
  console.log(`🤖 Webhook: http://0.0.0.0:${PORT}/webhook`)
  console.log(`✅ Ready for connections!`)
  console.log(``)
})

// Error handling
server.on('error', (err) => {
  console.error(`❌ Server error:`, err)
  process.exit(1)
})

// Graceful shutdown
const shutdown = () => {
  console.log(`📴 Shutting down server...`)
  server.close(() => {
    console.log(`✅ Server closed gracefully`)
    process.exit(0)
  })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  console.error(`💥 Uncaught Exception:`, err)
  process.exit(1)
})
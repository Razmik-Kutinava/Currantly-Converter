import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Health check endpoint для Railway и мониторинга
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'Currency Converter',
    version: '1.0.0'
  })
})

// API status endpoint
app.get('/api/status', (req, res) => {
  res.status(200).json({
    api: 'running',
    server: 'healthy',
    memory: process.memoryUsage(),
    cpu: process.cpuUsage()
  })
})

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')))

// Handle all routes - return the index.html file for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`)
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'dist')}`)
  console.log(`✅ Health check: http://0.0.0.0:${PORT}/health`)
})

// Graceful shutdown для Railway
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated')
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  process.exit(0)
})
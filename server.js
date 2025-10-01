import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

console.log(`🚀 Starting server...`)
console.log(`📍 Port: ${PORT}`)
console.log(`📁 Directory: ${__dirname}`)

// Middleware
app.use(express.json())

// Health check - простейший
app.get('/health', (req, res) => {
  console.log('✅ Health check requested')
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT
  })
})

// Static files
app.use(express.static(path.join(__dirname, 'dist')))

// SPA routing
app.get('*', (req, res) => {
  console.log(`� Serving index.html for: ${req.path}`)
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`)
  console.log(`📁 Serving from: ${path.join(__dirname, 'dist')}`)
})

// Error handling
server.on('error', (err) => {
  console.error('❌ Server error:', err)
})

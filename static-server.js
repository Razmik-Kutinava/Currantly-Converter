import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = parseInt(process.env.PORT) || 3000

console.log('=== STARTING STATIC SERVER ===')
console.log('PORT:', PORT)
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('Static dir:', path.join(__dirname, 'dist'))

// Middleware
app.use(express.json())

// Health check - ПЕРВЫМ делом
app.get('/health', (req, res) => {
  console.log('Health check from:', req.ip)
  res.status(200).json({ 
    status: 'OK', 
    port: PORT, 
    time: new Date().toISOString(),
    static: path.join(__dirname, 'dist')
  })
})

// Static files
app.use(express.static(path.join(__dirname, 'dist'), {
  index: 'index.html',
  maxAge: '1d'
}))

// SPA fallback
app.get('*', (req, res) => {
  console.log('SPA fallback for:', req.path)
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Static server running on port ${PORT}`)
})

server.on('error', (err) => {
  console.error('Server error:', err)
  process.exit(1)
})
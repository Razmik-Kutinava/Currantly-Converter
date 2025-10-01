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

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path}`)
  console.log(`   From: ${req.ip} | User-Agent: ${req.get('User-Agent') || 'unknown'}`)
  next()
})

// Health check - ПЕРВЫМ делом
app.get('/health', (req, res) => {
  console.log('🏥 Health check from:', req.ip)
  const response = { 
    status: 'OK', 
    port: PORT, 
    time: new Date().toISOString(),
    static: path.join(__dirname, 'dist'),
    server: 'Railway-Static'
  }
  res.status(200).json(response)
  console.log('✅ Health check response sent')
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
  console.log(`🌐 Listening on 0.0.0.0:${PORT}`)
  console.log(`🔗 Public URL: https://currantly-converter-production.up.railway.app`)
  
  // Самотест через IPv4
  setTimeout(() => {
    import('http').then(http => {
      const req = http.request({
        hostname: '127.0.0.1', // IPv4 вместо localhost
        port: PORT,
        path: '/health',
        method: 'GET',
        family: 4 // Принудительно IPv4
      }, (res) => {
        console.log('✅ SELF-TEST SUCCESS - IPv4')
        console.log('Status:', res.statusCode)
        res.on('data', (chunk) => {
          console.log('Response:', chunk.toString())
        })
      })
      
      req.on('error', (err) => {
        console.error('❌ SELF-TEST FAILED - IPv4')
        console.error('Error:', err.message)
      })
      
      req.setTimeout(5000, () => {
        req.destroy()
        console.error('❌ SELF-TEST TIMEOUT')
      })
      
      req.end()
    })
  }, 2000)
})

server.on('error', (err) => {
  console.error('Server error:', err)
  process.exit(1)
})
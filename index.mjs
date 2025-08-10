import 'dotenv/config'
import express from 'express'
import { testConnectionDb } from './config/database.mjs'
import articleRouter from './routes/articlesRoute.mjs'
import categoryRouter from './routes/categoriesRoute.mjs'
import cors from 'cors'
import redis from 'redis'

const PORT = process.env.PORT || 4001
const app = express()
const MAX_RETRIES = 3
let redisClient = null
let retryCount = 0
let isConnecting = false // Evita múltiples llamadas simultáneas
const allowedOrigins = (process.env.ALLOWED_ORIGINS) ? process.env.ALLOWED_ORIGINS.split(',') : []

async function connectToRedis () {
  if (retryCount >= MAX_RETRIES || isConnecting) return

  isConnecting = true
  try {
    redisClient = redis.createClient()

    // Manejador de errores (se removerá después de MAX_RETRIES)
    const onError = (_err) => {
      if (retryCount < MAX_RETRIES) {
        retryCount++
        console.log(`Reintentando conexión a Redis (${retryCount}/${MAX_RETRIES})...`)
        setTimeout(connectToRedis, 2000)
      } else {
        console.warn('Redis no disponible después de varios intentos. Continuando sin Redis.')
        redisClient.off('error', onError) // ¡Elimina el listener!
        redisClient.quit().catch(() => {}) // Fuerza desconexión
        redisClient = null
      }
    }

    redisClient.on('error', onError)
    await redisClient.connect()

    if (redisClient) console.log('✅ Conectado a Redis')
  } catch (err) {
    console.error('Error al conectar a Redis:', err)
    if (retryCount < MAX_RETRIES) {
      retryCount++
      setTimeout(connectToRedis, 2000)
    } else {
      redisClient = null
    }
  } finally {
    isConnecting = false
  }
}
// Inicia la conexión a Redis
connectToRedis()

// Middleware para pasar redisClient a las rutas
app.use((req, res, next) => {
  req.redis = redisClient?.isReady ? redisClient : null
  next()
})

// Configuración de CORS y rutas
const corsOptions = {
  origin: allowedOrigins,
  methods: ['*'],
  allowedHeaders: ['*']
}

app.use(cors(corsOptions))
app.use(express.json())
app.use('/api', articleRouter)
app.use('/api', categoryRouter);

// Inicia el servidor
(async () => {
  await testConnectionDb()
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
  })
})()

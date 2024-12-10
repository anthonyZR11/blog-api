import express from 'express'
import { testConnectionDb } from './config/database.mjs'
import articleRouter from './routes/articlesRoute.mjs'
import categoryRouter from './routes/categoriesRoute.mjs'
import cors from 'cors'
import redis from 'redis'

const PORT = process.env.DB_PORT || 3001
const app = express()
const redisClient = redis.createClient()

redisClient.on('error', (err) => console.error('Redis Error:', err))
redisClient.connect().then(() => console.log('Connected to Redis'))

app.locals.redisClient = redisClient

const corsOptions = {
  origin: 'http://localhost:8080',
  methods: ['*'],
  allowedHeaders: ['*']
}

app.use(cors(corsOptions))
app.use(express.json())
app.use('/api', articleRouter)
app.use('/api', categoryRouter);

(async () => {
  await testConnectionDb()
  app.listen(PORT, () => {
    console.log(`escuchando desde el puerto http://localhost:${PORT}`)
  })
})()

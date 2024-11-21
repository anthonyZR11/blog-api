import express from 'express'
import { testConnectionDb } from './config/database.mjs'
import articleRouter from './routes/articlesRoute.mjs'
import categoryRouter from './routes/categoriesRoute.mjs'
import cors from 'cors'

const PORT = process.env.PORT || 3000
const app = express()

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

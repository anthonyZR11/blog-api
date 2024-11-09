import express from 'express'
import { testConnectionDb } from './config/database.mjs'
import articleRouter from './routes/articlesRoute.mjs'

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use('/api', articleRouter);

(async () => {
  await testConnectionDb()
  app.listen(PORT, () => {
    console.log(`escuchando desde el puerto http://localhost:${PORT}`)
  })
})()

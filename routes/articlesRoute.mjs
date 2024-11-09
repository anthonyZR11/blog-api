import { Router } from 'express'
import { getAllArticles, getAllArticleById, postArticle, putArticle, deleteArticle } from '../controllers/articleController.mjs'

const router = Router()

router
  .get('/articles', getAllArticles)
  .get('/articles/:id', getAllArticleById)
  .post('/articles', postArticle)
  .put('/articles/:id', putArticle)
  .delete('/articles/:id', deleteArticle)

export default router

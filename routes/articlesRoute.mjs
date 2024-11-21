import { Router } from 'express'
import { getAllArticles, getAllArticleById, postArticle, patchArticle, deleteArticle } from '../controllers/articleController.mjs'

const router = Router()

router
  .get('/articles', getAllArticles)
  .get('/articles/:id', getAllArticleById)
  .post('/articles', postArticle)
  .patch('/articles/:id', patchArticle)
  .delete('/articles/:id', deleteArticle)

export default router

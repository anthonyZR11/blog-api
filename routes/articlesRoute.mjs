import { Router } from 'express'
import { getAllArticles, getAllArticleById, postArticle, patchArticle, deleteArticle } from '../controllers/articleController.mjs'
// import { verifyAccessToken } from '../middlewares/auth.middleware.mjs'
import { cacheMiddleware } from '../middlewares/articlesRedis.mjs'

const router = Router()

router
  .get('/articles', cacheMiddleware, getAllArticles)
  .get('/articles/:id', getAllArticleById)
  .post('/articles', postArticle)
  .patch('/articles/:id', patchArticle)
  .delete('/articles/:id', deleteArticle)

export default router

import { getAllArticlesModel, getAllArticleByIdModel, postArticleModel, patchArticleModel, deleteArticleModel } from '../models/articleModel.mjs'
import { responseData } from '../helpers/helpers.mjs'

export const getAllArticles = async (req, res) => {
  try {
    const allowedQueries = ['category', 'page', 'limit', 'order'] // Lista de parámetros válidos
    const category = req.query.category ?? 'all'
    const page = !isNaN(+req.query.page) ? +req.query.page : 1
    const limit = !isNaN(+req.query.limit) ? +req.query.limit : 6
    const offset = (page - 1) * limit
    const order = req.query.order ?? 'DESC'

    const redisClient = req.app.locals.redisClient

    // Verifica si hay parámetros no permitidos
    const invalidQueries = Object.keys(req.query).filter(
      (key) => !allowedQueries.includes(key)
    )

    if (invalidQueries.length > 0) {
      return res.status(400).json(responseData({
        status: 400,
        message: 'No se proceso la petición',
        error: `Parámetros inválidos: ${invalidQueries.join(', ')}`
      }))
    }
    const [articles, totalRows] = await getAllArticlesModel({ category, offset, limit, order })

    if (articles.length === 0) {
      return res.status(404).json(responseData({
        status: 404,
        message: 'No se encontraron artículos'
      }))
    }

    const response = responseData({
      status: 200,
      message: 'Articulos obtenidos con exito',
      data: articles,
      page,
      limit,
      totalRows
    })

    const cacheKey = `articles:${category}:${order}:${page}`
    if (redisClient) await redisClient.setEx(cacheKey, 60, JSON.stringify(response))

    return res.json(response)
  } catch (error) {
    return res.status(500).json(responseData({
      status: 500,
      message: 'Error al obtener los artículos',
      error: error.message
    }))
  }
}

export const getAllArticleById = async (req, res) => {
  try {
    const { id } = req.params
    const article = await getAllArticleByIdModel({ id })

    if (article.length === 0) {
      return res.status(404).json(responseData({
        status: 404,
        message: 'No se encontro el artículo'
      }))
    }

    return res.json(responseData({
      status: 200,
      message: 'Articulo obtenido con exito',
      data: article
    }))
  } catch (error) {
    return res.status(500).json(responseData({
      status: 500,
      message: 'Error al obtener el artículo',
      error: error.message
    }))
  }
}

export const postArticle = async (req, res) => {
  try {
    const { title, body, category, tag, user_id: userId } = req.body

    await postArticleModel({ title, body, category, tag, userId })

    return res.status(201).json(responseData({
      status: 201,
      message: 'Articulo agregado con exito'
    }))
  } catch (error) {
    return res.status(500).json(responseData({
      status: 500,
      message: 'Error al insertar el articulo',
      error: error.message
    }))
  }
}

export const patchArticle = async (req, res) => {
  try {
    const { id } = req.params
    const { title, body, category, tag, user_id: userId } = req.body

    const article = await patchArticleModel({ title, body, category, tag, userId, id })

    if (article === 0) {
      return res.status(202).json(responseData({
        status: 202,
        message: 'No se realizaron modificaciones al articulo'
      }))
    }

    return res.json(responseData({
      status: 200,
      message: 'Articulo actualizado con exito'
    }))
  } catch (error) {
    return res.status(500).json(responseData({
      status: 500,
      message: 'Error al actualizar el articulo',
      error: error.message
    }))
  }
}

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params

    await deleteArticleModel({ id })

    return res.status(202).json(responseData({
      status: 204,
      message: 'Articulo eliminado'
    }))
  } catch (error) {
    return res.status(500).json(responseData({
      status: 500,
      message: 'Error al actualizar el articulo',
      error: error.message()
    }))
  }
}

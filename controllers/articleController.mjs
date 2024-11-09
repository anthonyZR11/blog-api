import { getAllArticlesModel, getAllArticleByIdModel, postArticleModel } from '../models/articleModel.mjs'
import { responseData } from '../helpers/responseHelper.mjs'

export const getAllArticles = async (_req, res) => {
  try {
    const articles = await getAllArticlesModel()

    if (articles.length === 0) {
      return res.status(404).json(responseData({
        status: 404,
        message: 'No se encontraron artículos'
      }))
    }
    return res.status.json(responseData({
      status: 200,
      message: 'Articulos obtenidos con exito',
      data: articles
    }))
  } catch (error) {
    return res.status(500).json(responseData({
      status: 500,
      message: 'Error al obtener los artículos',
      errors: error.message
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
        message: 'No se encontraro el artículo'
      }))
    }

    return res.status(200).json(responseData({
      status: 200,
      message: 'Articulo obtenido con exito',
      data: article
    }))
  } catch (error) {
    return res.status(500).json(responseData({
      status: 500,
      message: 'Error al obtener el artículo',
      errors: error.message
    }))
  }
}

export const postArticle = async (req, res) => {
  try {
    const { title, body, category, tag, user_id: userId } = req.body

    await postArticleModel({ title, body, category, tag, userId })

    // if (!article) {
    //   return res.status(400).json(responseData({
    //     status: 400,
    //     message: 'Error al inserta el articulo'
    //   }))
    // }

    return res.status(201).json(responseData({
      status: 201,
      message: 'Articulo agregado con exito'
    }))
  } catch (error) {
    return res.status(500).json(responseData({
      status: 500,
      message: 'Error al insertar el articulo',
      errors: error.message
    }))
  }
}

export const putArticle = (req, res) => {
  console.log(req)
}

export const deleteArticle = (req, res) => {
  console.log(req)
}

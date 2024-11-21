import { responseData } from '../helpers/helpers.mjs'
import { getAllCategoriesModel } from '../models/categoryModel.mjs'

export const getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategoriesModel()

    if (!categories) {
      return res.status(404).json(responseData({
        status: 404,
        message: 'No se encontraron categorias'
      }))
    }

    return res.json(responseData({
      status: 200,
      message: 'Categorias obtenidas con exito',
      data: categories
    }))
  } catch (error) {
    return res.status(500).json(responseData({
      status: 500,
      message: 'error interno',
      error: error.message
    }))
  }
}

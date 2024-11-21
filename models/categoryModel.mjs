import { connection } from '../config/database.mjs'
import { logger } from '../utils/utils.mjs'

export const getAllCategoriesModel = async () => {
  try {
    const pool = await connection()
    const [rows] = await pool.query('SELECT id, name, slug FROM categories')

    return rows
  } catch (error) {
    logger.error(error.message, { stack: error.stack })
  }
}

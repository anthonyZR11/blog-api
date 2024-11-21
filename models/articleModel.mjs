import { connection } from '../config/database.mjs'
import { formatDateTime } from '../helpers/helpers.mjs'
import { logger } from '../utils/utils.mjs'

export const getAllArticlesModel = async ({ category, offset, limit }) => {
  console.log(category, offset, limit)

  try {
    const pool = await connection()
    const baseQuery = `SELECT
      a.id,
      a.title,
      a.body,
      a.slug,
      a.tag,
      a.image,
      a.created_at,
      u.name AS userName,
      u.photo AS userPhoto,
      c.name AS categoryName,
      c.color_rgb AS background
    FROM articles AS a
    INNER JOIN users AS u ON a.user_id = u.id
    INNER JOIN categories as c ON a.category_id = c.id
    WHERE a.status = 1`

    const baseQueryCount = `SELECT
      COUNT(*) AS totalRow
    FROM articles AS a
    INNER JOIN users AS u ON a.user_id = u.id
    INNER JOIN categories as c ON a.category_id = c.id
    WHERE a.status = 1`

    const countRowsCategory = category === 'all'
      ? `${baseQueryCount}`
      : `${baseQueryCount} AND c.slug = ?`

    const queryWithCategory = category === 'all'
      ? `${baseQuery} LIMIT ? OFFSET ?`
      : `${baseQuery} AND c.slug = ? LIMIT ? OFFSET ?`

    const [[{ totalRow }]] = await pool.query(countRowsCategory, (category === 'all' ? [] : [category]))
    const [rows] = await pool.query(queryWithCategory, (category === 'all' ? [+limit, +offset] : [category, +limit, +offset]))

    return [rows, totalRow]
  } catch (error) {
    logger.error(error.message, { stack: error.stack })
  }
}

export const getAllArticleByIdModel = async ({ id }) => {
  try {
    const pool = await connection()
    const [row] = await pool.query('SELECT * FROM articles WHERE id = ? AND deleted_at IS NULL', [id])

    return row
  } catch (error) {
    logger.error(error.message, { stack: error.stack })
  }
}

export const postArticleModel = async ({ title, body, category, tag, userId }) => {
  const pool = await connection()

  const [affectedRows] = await pool.query(
    'INSERT INTO articles (title, body, category, tag, user_id) VALUES (?, ?, ? , ?, ?)',
    [title, body, category, tag, userId])

  return +affectedRows
}

export const patchArticleModel = async ({ title, body, category, tag, userId, id }) => {
  const pool = await connection()

  const [result] = await pool.query(
    'UPDATE articles SET title = ?, body = ?, category = ?, tag = ?, user_id = ? WHERE id = ?',
    [title, body, category, tag, userId, id])

  return +result.changedRows
}

export const deleteArticleModel = async ({ id }) => {
  const date = formatDateTime()
  const pool = await connection()

  const [result] = await pool.query('UPDATE articles SET deleted_at = ? WHERE id = ?', [date, id])
  return +result.affectedRows
}

import { connection } from '../config/database.mjs'

export const getAllArticlesModel = async () => {
  try {
    const pool = await connection()
    const [rows] = await pool.query('SELECT * FROM articles')
    return rows
  } catch (error) {
    console.log(error)
  }
}

export const getAllArticleByIdModel = async ({ id }) => {
  try {
    const pool = await connection()
    const [row] = await pool.query('SELECT * FROM articles where id = ?', [id])
    return row
  } catch (error) {

  }
}

export const postArticleModel = async ({ title, body, category, tag, userId }) => {
  const pool = await connection()
  const [affectedRows] = await pool.query(
    'INSERT INTO articles (title, body, category, tag, user_id) VALUES (?, ?, ? , ?, ?)',
    [title, body, category, tag, userId]
  )

  return +affectedRows
}

export const putArticle = () => {
  // console.log(req)
}

export const deleteArticle = () => {
  // console.log(req)
}

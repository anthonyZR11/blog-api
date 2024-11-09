import mysql from 'mysql2/promise'

export async function connection () {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      database: 'blog',
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
      idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    })
    return pool
  } catch (error) {
    throw new Error('error: ' + error)
  }
}

export const testConnectionDb = async () => {
  try {
    const pool = await connection()
    const [rows] = await pool.query('SELECT 1 + 1 AS result')
    console.log('Resultado de prueba de conexión (1 + 1):', rows[0].result) // Muestra el resultado de 1 + 1
  } catch (error) {
    throw new Error('Error al verificar la conexión con la base de datos:', error.message)
  }
}

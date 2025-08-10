export const cacheMiddleware = async (req, res, next) => {
  const { category, order = 'asc', page = 1 } = req.query
  const redisClient = req.app.locals.redisClient
  const cacheKey = `articles:${category}:${order}:${page}` // Clave única basada en los parámetros
  const cachedData = redisClient ? await redisClient.get(cacheKey) : null

  try {
    if (cachedData) {
      return res.json(JSON.parse(cachedData))
    }
    next()
  } catch (err) {
    console.error('Redis Error:', err)
    next()
  }
}

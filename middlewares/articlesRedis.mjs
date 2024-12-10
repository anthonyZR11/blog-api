export const cacheMiddleware = async (req, res, next) => {
  const { category, order = 'asc', page = 1 } = req.query
  const redisClient = req.app.locals.redisClient
  const cacheKey = `articles:${category}:${order}:${page}` // Clave única basada en los parámetros

  console.log('key', cacheKey)

  try {
    const cachedData = await redisClient.get(cacheKey)

    if (cachedData) {
      console.log('Con datos en cache:', cacheKey)
      return res.json(JSON.parse(cachedData))
    }

    console.log('sin cache:', cacheKey)
    next()
  } catch (err) {
    console.error('Redis Error:', err)
    next()
  }
}

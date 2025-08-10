// import jwt from 'jsonwebtoken'

export const verifyAccessToken = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' })
  }

  console.log(`Authorization Token: ${token}`)

  next()
}

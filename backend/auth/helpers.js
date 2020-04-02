const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(12)
    return await bcrypt.hash(password, salt)
}

const comparePasswords = async (password, passwordDigest) => {
    return await bcrypt.compare(password, passwordDigest) // TRUE if a match, FALSE if not
}

const checkUserLogged = (request, response, next) => {
  if (request.user) return next()
  response.status(401).json({
    error: true,
    message: 'You need to be logged in to access this route',
    payload: null,
  })
}

module.exports = {
  hashPassword,
  comparePasswords,
  checkUserLogged
}
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const port = process.env.PORT
const mongoUri = process.env.MONGODB_URI

module.exports = { mongoUri, port }
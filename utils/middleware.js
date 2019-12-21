
// wrapt this in comments for a potential security vulnerability
const logger = (request, response, next) => {
    console.log(`Method: ${request.method}`)
    console.log(`Path: ${request.path}`)
    console.log('---------------')
    next()
}

const error = (request, response) => {
    response.status(404).send({ error: 'Unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    }

    next()
}

module.exports = {
    logger,
    error,
    tokenExtractor
}
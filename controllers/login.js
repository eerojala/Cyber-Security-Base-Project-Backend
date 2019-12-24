const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    try {
        const password = request.body.password
        const username = request.body.username

        const user = await User.findOne({ username: username })

        let passwordCorrect = password === user.password

        // Password check if passwords are hashed
        // passwordCorrect = user === null ? // if user matching the given username was not found 
        //     false :  // then the password also cannot be correct
        //     await bcryptjs.compare(password, user.password) // if user was found, then check the given password against the stored passwordhash

        if (!(user && passwordCorrect)) {
            return response.status(401).json({ error: 'Invalid username or password' })
        }

        const userForToken = { 
            username: user.username,
            id: user._id // Is storing an user id in a token a security risk?
        }

        const token = jwt.sign(userForToken, process.env.SECRET)
        response.status(200).send({ token, username: user.username, id: user._id })
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: exception })
    }
})

module.exports = loginRouter
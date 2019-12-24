const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    try {
        const users = await User.find({})

        response.json(users.map(User.format))
    } catch (exception) {
        console.log(exception)

        response.status(500).json({ error: exception })
    }
})

usersRouter.post('/', async (request, response) => {
    try {
        const username = request.body.username

        const duplicateUsername = await User.findOne({ username: username })

        if (duplicateUsername !== null) {
            return response.status(403).json({ error: 'This username has already been taken, please select another one' })
        }

        let password = request.body.password

        // Insert password validation here
        
        // Salt generation
        // const salt = await bcryptjs.genSaltSync(10) 

        // Password hashing
        // const passwordHash = await bcryptjs.hashSync(password, salt) 

        // password = passwordHash
        
        const user = new User({ username, password })

        await user.save()

        response.json(User.format(user))
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error : exception })
    }
})

module.exports = usersRouter
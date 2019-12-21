const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    try {
        const username = request.body.username

        const duplicateUsername = await User.findOne({ username: username })

        if (duplicateUsername === null) {
            return response.status(403).json({ error: 'This username has already been taken, please select another one' })
        }

        let password = request.body.password

        // Insert password validation here
        
        // const salt = await bcryptjs.genSaltSync(10) Generating the salt

        // const passwordHash = await bcryptjs.hashSync() Hashing the password

        // password = passwordHash
        
        const user = new User({ username, password })

        await user.save()

        response.json(User.format(user))
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error : exception }) // Detailed error message?
    }
})

module.exports = usersRouter
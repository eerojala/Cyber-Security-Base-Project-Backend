const messagesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Message = require('../models/message')
const User = require('../models/user')

const getLoggedInUserId = async (token) => {
    if (!token) {
        return null
    }

    const decodedToken = await jwt.verify(token, process.env.SECRET)

    if (!decodedToken.id) {
        return null
    }
    
    return decodedToken.id
}

messagesRouter.get('/', async (request, response) => {
    try {
        const messages = await Message
            .find({})
            .populate('user', { username: 1 })

        response.json(messages.map(Message.format))
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: exception}) // Detailed error message
    }
})

messagesRouter.get('/:id', async (request, response) => {
    try {
        const message = await Message
            .findById(request.params.id)
            .populate('user', { username: 1 })

        if (message) {
            response.json(Message.format(message))
        } else {
            response.status(404).end()
        }
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: exception })
    }
})

messagesRouter.post('/', async (request, response) => {
    try {
        const loggedInUserId = await getLoggedInUserId(request.token)

        if (!loggedInUserId) {
            return response.status(401).json({ error: 'You must be logged in to post a message' })
        }

        const user = await User.findById(loggedInUserId)

        const message = Object.assign({user: loggedInUserId}, request.body)
        const newMessage = new Message(message)

        const savedMessage = await newMessage.save()

        user.messages = user.messages.concat(savedMessage._id)

        await user.save()

        const fetchedMessage = await Message
            .findById(savedMessage.id)
            .populate('user', { username: 1 })

        response.json(Message.format(fetchedMessage))
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: exception }) // Detailed error message
    }
})

messagesRouter.put('/:id', async (request, response) => {
    try {
        const id = request.params.id

        const message = await Message.findById(id)
 
        if (!message) {
            return response.status(404).json({ error: 'No message found matching given id' })
        }

        // Check for correct user logged in        
        // if (await getLoggedInUserId(request.token, message.user) === false) {
        //     return response.status(401).json({ error: 'Wrong user logged in'})
        // }

        const changesToMessage = Object.assign({}, request.body)

        await Message.findByIdAndUpdate(id, changesToMessage)

        const fetchedMessage = await Message
            .findById(id)
            .populate('user', { username: 1 })

        response.json(Message.format(fetchedMessage))
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: exception }) // Detailed error messages
    }
})

module.exports = messagesRouter
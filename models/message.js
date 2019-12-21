const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    title: String,
    content: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

messageSchema.statics.format = (message) => {
    return {
        id: message.id,
        title: message.title,
        content: message.content,
        user: message.user
    }
}

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
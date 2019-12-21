const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    content: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

messageSchema.statics.format = (message) => {
    return {
        id: message.id,
        content: message.content,
        user: message.user
    }
}

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
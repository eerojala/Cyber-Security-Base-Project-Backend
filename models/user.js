const mongoose = require('mongoose')

const userSchema = new.Mongoose.Schema({
    username: String,
    password: String,
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
})

userSchema.statics.format = (user) => {
    return {
        id: user.id,
        username: user.username,
        messages: user.messages
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User
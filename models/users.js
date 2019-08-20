const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: 'String',
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: 'String',
        required: true
    },
    notes: [
        {
            title: {
                type: 'String',
                require: true,
                trim: true,
                minlength: 3,
                maxlength: 20
            },
            body: {
                type: 'String',
                required: true,
                trim: true,
                maxlength: 1000
            }
        }
    ]
})

/* userSchema.path('name').validate(async (value) => {
    const nameCount = await mongoose.models.User.countDocuments({ name: value });
    return !nameCount;
}, 'Name already taken') */

module.exports = mongoose.model('User', userSchema)
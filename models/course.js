const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 200
    },
    isPublic: {
        type: Boolean,

    },
    imageUrl: {
        type: String,
        required: true
    },

    creatorId: {
        type: String,
        required: true,
        ref: 'Users'
    },
    createdAt: {
        type: String,
        required: true
    },
    usersEnrolled: [{
        type: String,
        ref: 'Users'
    }]
})

module.exports = mongoose.model('Course', courseSchema);
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    enrolledCourses: [{
        type: mongoose.Types.ObjectId,
        ref: 'Course'
    }]
})

module.exports = mongoose.model('Users', UserSchema);
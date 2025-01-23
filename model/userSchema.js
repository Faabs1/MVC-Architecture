const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'  // Default role for new users is 'user' unless specified otherwise.  // Add more roles as needed.  // Update the enum array as well.  // Ensure that the role is validated when creating or updating a user.  // Ensure that the role is required when creating or updating a user.  // Add more validation checks as needed.  // Update the validation checks as well.  // Ensure that the role is validated when creating or updating a user
    },
    resetToken: {
        type: String
    },
    resetTokenExpiration: {
        type: Date // default date.now()
    }
},
{
    timestamps: true,
    versionKey: false,
    collection: 'users' // Change the collection name to 'users' if desired.
})

const User = mongoose.model('User', Schema);

module.exports = User;
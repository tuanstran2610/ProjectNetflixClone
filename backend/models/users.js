const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true, min: 0 },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: String,
    isAdmin: {
        type: Boolean,
        default: false,
    },
    mylist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    }],

    watchedMovies: [{
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie'
        },
        watchedTime: {
            type: Number,
            default: 0,
        },
        uploadTime: {
            type: Date,
            default: Date.now,
        }
    }]
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;
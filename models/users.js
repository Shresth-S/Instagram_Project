const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema({
    username: String,
    password:String,
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    followers_arr: [{
        type: Schema.Types.ObjectId,
        ref:'users'
    }],
    following_arr: [{
        type: Schema.Types.ObjectId,
        ref:'users'
    }],
    postCount: { type: Number, default: 0},
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'posts'
    }],
    themedark: { type: Boolean, default: false },
    public: { type: Boolean, default: true }
});

module.exports = mongoose.model('users', userSchema);
const mongoose = require('mongoose');
const { Schema } = mongoose;


const postSchema = new Schema({
    title: String,
    description: String,
    imageurl: String,
    likedby:[{ type: Schema.Types.ObjectId }],
    likes: { type: Number, default: 0 },
    comments: [{
        type: String
    }],
    postOwner: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    OwnerName: String,
    public: Boolean
},
    {timestamps: true}
);

module.exports = mongoose.model('posts', postSchema);


const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentsSchema = new Schema({
    comments: [{
        type:String
    }],
    post: {
        type: Schema.Types.ObjectId,
        ref: 'posts'
    }
});

module.exports = mongoose.model('comments', commentsSchema);
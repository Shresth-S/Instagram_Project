const mongoose = require('mongoose');
const { Schema } = mongoose;


const socketmapSchema = new Schema({
    socketid: String,
    username:String
    // `socialMediaHandles` is a map whose values are strings. A map's
    // keys are always strings. You specify the type of values using `of`.
});

module.exports = mongoose.model('socketmap', socketmapSchema);


// comment.js

//imports `mongoose` to create the new model
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Comment= mongoose.model('Comment', {
    title: String,
    content: String,
    reviewId: { type: Schema.Types.ObjectId, ref: 'Review' },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = Comment

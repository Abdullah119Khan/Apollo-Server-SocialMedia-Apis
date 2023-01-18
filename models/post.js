const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
    body: {
      type: String,
      required: true
  },
  username: {
    type: String
  },
  createdAt: String,
  comments: [
    {
      username: String,
      body: String,
      createdAt: String
    }
  ],
  likes: [
    {
      username: String,
      createdAt: String
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const PostModel = mongoose.model('Post', postSchema)

module.exports = PostModel
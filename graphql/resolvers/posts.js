const { AuthenticationError, UserInputError } = require("apollo-server");
const PostModel = require("../../models/post");
const checkAuth = require('../../utils/auth')

module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await PostModel.find().sort({ createdAt: -1 })
        return posts
      } catch(err) {
        throw new Error(err)
      }
    },
    getPost: async (_, { postId }) => {
      try {
        const post = await PostModel.findById(postId);
        if(post) {
          return post
        }else {
          throw new UserInputError('Post not found')
        }
      } catch(err) {
        throw new Error(err)
      }
    }
  },
  Mutation: {
    createPost: async (_, { title, body }, context) => {
      const { username } = checkAuth(context)

      const newPost = new PostModel({
        title,
        body,
        username: username,
        createdAt: new Date().toISOString()
      })
      const post = await newPost.save()
      return post;
    },
    deletePost: async (_, { postId }, context) => {
      const { username } = checkAuth(context);

      const post = await PostModel.findById(postId);

      try {
        if(post) {
          if(post.username === username) {
            await PostModel.findByIdAndDelete(postId);
            return 'Post Deleted Successfully';
          } else {
            throw new AuthenticationError('You are not allowed')
          }
        } else {
          throw new UserInputError('Post not found')
        }
      } catch(err) {
        throw new Error(err)
      }
    },
      updatePost: async (_, { postId, title, body }, context) => {
        const { username } = checkAuth(context);

        const post = await PostModel.findById(postId);

        try {
          if(post) {
            if(post.username === username) {
              post.title = title;
              post.body = body;
              await post.save();
              return post;
            } else {
              throw new AuthenticationError('You are not allowed')
            }
          } else {
            throw new UserInputError('post not found')
          }
        } catch(err) {
          throw new Error(err)
        }
      }
    }
}
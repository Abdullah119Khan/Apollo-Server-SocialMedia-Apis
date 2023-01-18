const { UserInputError, AuthenticationError } = require("apollo-server");
const PostModel = require("../../models/post");
const checkAuth = require("../../utils/auth");


module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const user = checkAuth(context);

      if(body.trim() === "") {
        throw new UserInputError('Error', {
          errors: {
            body: "comment must not be empty"
          }
        })
      }
      const post = await PostModel.findById(postId);
      if(post) {
        post.comments.unshift({
          username: user.username,
          body,
          createdAt: new Date().toISOString()
        })
        await post.save();
        return post;
      } else {
        throw new UserInputError('post not found')
      }
    },
    updateComment: async (_, { postId, commentId, body }, context) => {
      const user = checkAuth(context);

      const post = await PostModel.findById(postId);

      if(post) {
        const comment = post.comments.id(commentId);
        if(comment.username === user.username) {
          comment.body = body;
          await post.save();
          return post;
        } else {
          throw new AuthenticationError('Your not allowed to update this comment')
        }
      } else {
        throw new UserInputError('post not found')
      }
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      const user = checkAuth(context);

      const post = await PostModel.findById(postId);

      if(post) {
        const commentIndex = post.comments.findIndex(c => c.id === commentId);
        if(post.comments[commentIndex].username === user.username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return 'comment deleted successfully'
        } else {
          throw new AuthenticationError('You are not allowed')
        }
      } else {
        throw new UserInputError('post not found')
      }
    }
  }
}
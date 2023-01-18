const { gql } = require('apollo-server')

module.exports = gql`
 type Posts {
  id: ID!
  title: String!
  body: String!
  username: String!
  createdAt: String!
  comments: [Comments!]!
 }

type Comments {
  id: ID!
  body: String!
  username: String!
  createdAt: String!
}
 type Query {
  getPosts: [Posts]
  getPost(postId: String!): Posts!
 }

 type Users {
  id: ID!
  username: String!
  email: String!
  password: String!
  token: String!
  createdAt: String!
 }

 input RegisterInput {
  username: String!
  email: String!
  password: String!
  confirmPassword: String!
 }

 type Mutation {
  register(registerInput: RegisterInput!): Users!
  login(email: String!, password: String!): Users!
  createPost(title: String!, body: String!): Posts!
  updatePost(postId: String!, title: String!, body: String!): Posts!
  deletePost(postId: String!): String!
  createComment(postId: String!, body: String!): Comments!
  updateComment(postId: String!, commentId: String!, body: String!): Posts!
  deleteComment(postId: String!, commentId: String!): String!
 }
`
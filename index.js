const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')
const { MONGO_URL } = require('./config/default')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req})
})

mongoose.set('strictQuery', true)

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('connected success with mongoDB')
})
server.listen({ port: 4000 })
.then((res) => {
  console.log(`Server Running On PORT ${res.url}`)
})
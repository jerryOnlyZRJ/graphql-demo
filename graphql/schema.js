const {
    gql
  } = require('apollo-server-koa');

  // Construct a schema, using GraphQL schema language
module.exports = gql `
type Query {
  user(id: ID!): User
}
type User {
  id: String
  name: String
  age: Int
}
type Mutation {
  updateUser (
    userId: ID!,
    name: String
  ): User
}

# we need to tell the server which types represent the root query
# 如果省略，则默认会使用Query Type作为root query
schema {
  query: Query
  mutation: Mutation
}
`;
const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    createdAt: String!
    token: String!
  }

  type Post {
    id: ID!
    body: String!
    username: String!
    userid: String!
    createdAt: String!
    comments: [Comment]!
    likes: [Like]!
    likesLength: Int!
    commentsLength: Int!
    likeCount: Int!
    commentCount: Int!
  }

  type Comment {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
    userid: String!
  }

  type Like {
    username: String!
    userid: String!
    createdAt: String!
  }

  type Query {
    posts: [Post]!
    post(id: ID!): Post
  }

  input userInput {
    name: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  input loginInput {
    email: String!
    password: String!
  }

  input postInput {
    body: String!
  }

  type Mutation {
    createUser(input: userInput!): User!
    loginUser(input: loginInput!): User!
    createPost(input: postInput!): Post!
    deletePost(id: ID!): Post!
    updatePost(id: ID!, body: String!): Post!
    createComment(id: ID!, body: String!): [Comment]!
    deleteComment(postId: ID!, commentId: ID!): [Comment]!
    like(id: ID!): [Like]!
  }
  type Subscription {
    newPost: Post
  }
`;

module.exports = typeDefs;

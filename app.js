const { ApolloServer } = require("apollo-server");
const typeDefs = require("./graghql/typeDefs");
const resolvers = require("./graghql/resolvers");
const connectDB = require("./db/connectDB");
require("dotenv").config();
const { PubSub } = require("graphql-subscriptions");

const uri = process.env.URI;
const local_uri = process.env.LOCAL_URI;

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return { req, pubsub };
  },
});

const start = async () => {
  try {
    await connectDB(local_uri);
    server.listen().then(({ url }) => console.log(url));
  } catch (error) {
    console.log(error);
  }
};

start();

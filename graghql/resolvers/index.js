const commentResolvers = require("./commetnMutation");
const postResolvers = require("./postMustation");
const queryResolvers = require("./query");
const userResolvers = require("./userMutation");

const resolvers = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...queryResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => {
        console.log("pubsub");
        return pubsub.asyncIterator(["NEW_POST"]);
      },
    },
  },
};

module.exports = resolvers;

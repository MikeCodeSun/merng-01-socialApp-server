const { UserInputError } = require("apollo-server");
const Post = require("../../model/postModel");

const queryResolvers = {
  Query: {
    //all posts
    posts: async () => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        // console.log(posts.map((post) => post._id));
        // console.log(posts);
        posts.forEach((post) => {
          // console.log(post);
          const commentsLength = post.comments.length;
          const likesLength = post.likes.length;
          post.commentsLength = commentsLength;
          post.likesLength = likesLength;
        });

        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    // one post
    post: async (_, args) => {
      const { id } = args;

      try {
        const post = await Post.findOne({ _id: id });
        if (!post) {
          throw new Error("post not found");
        }
        return post;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  // subscription
};
module.exports = queryResolvers;

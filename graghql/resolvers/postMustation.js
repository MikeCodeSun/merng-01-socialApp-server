const authCheck = require("../../util/authCheck");
const Post = require("../../model/postModel");
const { UserInputError, AuthenticationError } = require("apollo-server");

const postResolvers = {
  Mutation: {
    // create new post
    createPost: async (parent, args, context) => {
      const user = authCheck(context);
      console.log(user);
      const { body } = args.input;
      const createdAt = Date.now().toString();
      if (body.trim() === "") {
        throw new UserInputError("error", {
          error: { post: "post must not be empty" },
        });
      }

      const post = await Post.create({
        body,
        username: user.name,
        userid: user.id,
        createdAt,
      });

      context.pubsub.publish("NEW_POST", {
        newPost: post,
      });

      return post;
    },
    //delete post
    deletePost: async (_, args, context) => {
      const user = authCheck(context);
      const id = args.id;

      try {
        const post = await Post.findOne({ _id: id });
        if (!post) {
          throw new Error("post not found");
        }

        if (post.userid !== user.id) {
          throw new AuthenticationError("not have Authentication to delete");
        }
        await post.delete();

        return post;
      } catch (error) {
        throw new Error(error);
      }
    },
    //update post
    updatePost: async (_, args, context) => {
      const user = authCheck(context);
      const { id, body } = args;
      if (body.trim() === "") {
        throw new UserInputError("Error", {
          error: { post: "Post must not be empty!" },
        });
      }
      try {
        const post = await Post.findOne({ _id: id });
        if (!post) {
          throw new Error("Post not found");
        }
        if (post.userid !== user.id) {
          throw new AuthenticationError("No Authentication to Edit");
        }
        post.body = body;
        await post.save();
        return post;
      } catch (error) {
        throw new Error(error);
      }
    },

    //
  },
};

module.exports = postResolvers;

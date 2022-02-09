const authCheck = require("../../util/authCheck");
const Post = require("../../model/postModel");
const { UserInputError, AuthenticationError } = require("apollo-server");

const commentResolvers = {
  Mutation: {
    createComment: async (_, args, context) => {
      const user = authCheck(context);
      const { id, body } = args;
      if (body.trim() === "") {
        throw new UserInputError("Error", {
          error: { comment: "comment must not empty" },
        });
      }
      try {
        const post = await Post.findOne({ _id: id });
        if (!post) {
          throw new Error("Post not Found");
        }
        const createdAt = Date.now().toString();
        post.comments.push({
          body,
          username: user.name,
          userid: user.id,
          createdAt,
        });
        await post.save();

        return post.comments;
      } catch (error) {
        throw new Error(error);
      }
    },
    // delete comment
    deleteComment: async (_, args, context) => {
      const user = authCheck(context);
      const { postId, commentId } = args;

      try {
        let post = await Post.findOne({ _id: postId });
        if (!post) {
          throw new Error("Post not Found");
        }
        const commentIndex = post.comments.findIndex((i) => i.id === commentId);

        // console.log(commentIndex);
        // console.log(post.comments[commentIndex]);

        if (post.comments[commentIndex].userid !== user.id) {
          throw new AuthenticationError("No Authentication to Delete");
        }

        // not work
        // await Post.findOneAndUpdate(
        //   { id: postId },
        //   {
        //     $pull: {
        //       comments: { id: commentId },
        //     },
        //   },
        //   console.log("pull")
        // );

        post.comments.splice(commentIndex, 1);

        //  work well
        // let comments = post.comments.filter((i) => i.id !== commentId);
        // post.comments = comments;

        await post.save();
        return post.comments;
      } catch (error) {
        throw new Error(error);
      }
    },
    // like or un lile
    like: async (_, args, context) => {
      const user = authCheck(context);
      const { id } = args;
      // console.log(user);
      try {
        const createdAt = Date.now().toString();
        const post = await Post.findOne({ _id: id });
        if (!post) {
          throw new Error("Post not Found!");
        }
        const like = post.likes.find((i) => i.userid === user.id);
        // console.log(post.likes.find((i) => i.userid === user.id) === undefined);
        if (like) {
          console.log("unlike");
          const likes = post.likes.filter((i) => i.userid !== like.userid);
          post.likes = likes;
        } else {
          console.log("like");
          post.likes.push({ username: user.name, userid: user.id, createdAt });
        }
        await post.save();
        return post.likes;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

module.exports = commentResolvers;

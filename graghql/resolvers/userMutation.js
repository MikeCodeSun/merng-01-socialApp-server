const { UserInputError } = require("apollo-server");
const {
  registerValidator,
  loginValidator,
} = require("../../util/userValidator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../model/userModle");
require("dotenv").config();

const genJwt = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.SECRET,
    { expiresIn: "1d" }
  );
};

const userResolvers = {
  Mutation: {
    //register
    createUser: async (_, args) => {
      const { name, email, password, confirmPassword } = args.input;
      const { valid, error } = registerValidator(
        name,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Error", { error });
      }

      const existedUser = await User.findOne({ email });
      if (existedUser) {
        throw new UserInputError("error", {
          error: { user: "user already exist" },
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const createdAt = Date.now().toString();
      const user = await User.create({
        name,
        email,
        password: hashPassword,
        createdAt,
      });

      // const token = jwt.sign(
      //   { id: user._id, name, email },
      //   process.env.SECRET,
      //   { expiresIn: "1d" }
      // );

      const token = genJwt(user);

      // console.log(user._doc);
      return {
        id: user._id,
        token,
        ...user._doc,
      };
    },
    //login
    loginUser: async (_, args) => {
      const { email, password } = args.input;
      const { valid, error } = loginValidator(email, password);
      if (!valid) {
        throw new UserInputError("Error", { error });
      }
      const user = await User.findOne({ email });
      if (!user) {
        throw new UserInputError("Error", {
          error: { user: "user not existed, please regiseter" },
        });
      }

      const isCheck = await bcrypt.compare(password, user.password);
      if (!isCheck) {
        throw new UserInputError("Error", {
          error: { user: "user password not right" },
        });
      }

      const token = genJwt(user);

      return {
        id: user._id,
        ...user._doc,
        token,
      };
    },
    //
  },
};
module.exports = userResolvers;

const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");
require("dotenv").config();

const authCheck = (context) => {
  const authHeader = context.req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthenticationError("Authentication Error", {
      token: "No Authentication",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    return jwt.verify(token, process.env.SECRET);
  } catch (error) {
    throw new AuthenticationError("Authentication Error", {
      token: "Authentication failed",
    });
  }
};

module.exports = authCheck;

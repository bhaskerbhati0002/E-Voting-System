const hello = require("./query/hello");
const registerUser = require("./mutation/registerUser");
const loginUser = require("./mutation/loginUser");

const resolvers = {
  Query: {
    hello,
  },
  Mutation: {
    registerUser,
    loginUser,
  },
};

module.exports = resolvers;

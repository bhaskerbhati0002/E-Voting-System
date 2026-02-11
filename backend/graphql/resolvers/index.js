const queryResolvers = require("./queryResolvers");
const mutationResolvers = require("./mutationResolvers");

const resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
};

module.exports = resolvers;

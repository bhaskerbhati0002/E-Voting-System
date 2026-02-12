const hello = require("./query/hello");
const registerUser = require("./mutation/registerUser");
const loginUser = require("./mutation/loginUser");
const createCandidate = require("./mutation/createCandidate");
const getCandidates = require("./query/getCandidates");
const deleteCandidate = require("./mutation/deleteCandidate");
const getResults = require("./query/getResults");
const vote = require("./mutation/vote");

const resolvers = {
  Query: {
    hello,
    getCandidates,
    getResults,
  },
  Mutation: {
    registerUser,
    loginUser,
    createCandidate,
    deleteCandidate,
    vote,
  },
};

module.exports = resolvers;

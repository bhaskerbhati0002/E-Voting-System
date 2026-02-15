const hello = require("./query/hello");
const registerUser = require("./mutation/registerUser");
const loginUser = require("./mutation/loginUser");
const createCandidate = require("./mutation/createCandidate");
const getCandidates = require("./query/getCandidates");
const deleteCandidate = require("./mutation/deleteCandidate");
const getResults = require("./query/getResults");
const vote = require("./mutation/vote");
const getVoters = require("./query/getVoters");
const deleteUser = require("./mutation/deleteUser");
const updateUser = require("./mutation/updateUser");
const updateCandidate = require("./mutation/updateCandidate");

const resolvers = {
  Query: {
    hello,
    getCandidates,
    getResults,
    getVoters,
  },
  Mutation: {
    registerUser,
    loginUser,
    createCandidate,
    deleteCandidate,
    vote,
    deleteUser,
    updateUser,
    updateCandidate,
  },
};

module.exports = resolvers;

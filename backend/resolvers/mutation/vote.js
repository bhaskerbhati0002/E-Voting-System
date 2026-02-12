const voteService = require("../../services/voteService");

const vote = async (_, { candidateId }, { user }) => {
  if (!user) {
    throw new Error("Not authenticated");
  }

  if (user.role !== "VOTER") {
    throw new Error("Only voters can vote");
  }

  return await voteService.vote(candidateId, user.userId);
};

module.exports = vote;

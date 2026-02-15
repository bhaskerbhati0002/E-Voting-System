const candidateService = require("../../services/candidateService");

const updateCandidate = async (_, { candidateId, input }, context) => {
  if (!context.user) {
    throw new Error("Not authenticated");
  }

  if (context.user.role !== "ADMIN") {
    throw new Error("Only admin can update candidates");
  }

  return await candidateService.updateCandidate(candidateId, input);
};

module.exports = updateCandidate;

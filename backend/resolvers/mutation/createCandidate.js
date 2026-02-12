const candidateService = require("../../services/candidateService");

const createCandidate = async (_, { input }, { user }) => {
  if (!user) {
    throw new Error("Not authenticated");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Only admin can create candidates");
  }

  return await candidateService.createCandidate(input);
};

module.exports = createCandidate;

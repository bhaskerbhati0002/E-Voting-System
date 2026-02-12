const candidateService = require("../../services/candidateService");

const deleteCandidate = async (_, { candidateId }, { user }) => {
  if (!user) {
    throw new Error("Not authenticated");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Only admin can delete candidate");
  }

  return await candidateService.deleteCandidate(candidateId);
};

module.exports = deleteCandidate;

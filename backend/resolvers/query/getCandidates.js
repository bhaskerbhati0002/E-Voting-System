const candidateService = require("../../services/candidateService");

const getCandidates = async () => {
  return await candidateService.getCandidates();
};

module.exports = getCandidates;

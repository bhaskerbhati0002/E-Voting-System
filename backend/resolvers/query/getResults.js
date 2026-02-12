const candidateService = require("../../services/candidateService");

const getResults = async () => {
  return await candidateService.getResults();
};

module.exports = getResults;

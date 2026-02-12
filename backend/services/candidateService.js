const Candidate = require("../models/Candidate");

const createCandidate = async ({ name, party, partyImage }) => {
  const candidate = await Candidate.create({ name, party, partyImage });
  return candidate;
};

const deleteCandidate = async (candidateId) => {
  const candidate = await Candidate.findByIdAndDelete(candidateId);

  if (!candidate) {
    throw new Error("Candidate not found");
  }

  return "Candidate deleted successfully";
};

const getCandidates = async () => {
  return await Candidate.find();
};

const getResults = async () => {
  return await Candidate.find().sort({ voteCount: -1 });
};

module.exports = {
  createCandidate,
  deleteCandidate,
  getCandidates,
  getResults,
};

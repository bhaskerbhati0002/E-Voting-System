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

const updateCandidate = async (candidateId, input) => {
  const candidate = await Candidate.findById(candidateId);

  if (!candidate) throw new Error("Candidate not found");

  if (input.name !== undefined) candidate.name = input.name;

  if (input.party !== undefined) candidate.party = input.party;

  if (input.partyImage !== undefined) candidate.partyImage = input.partyImage;

  await candidate.save();

  return candidate;
};

module.exports = {
  createCandidate,
  deleteCandidate,
  getCandidates,
  getResults,
  updateCandidate,
};

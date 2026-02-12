const Candidate = require("../models/Candidate");
const User = require("../models/User");

const vote = async (candidateId, userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.hasVoted) {
    throw new Error("You have already voted");
  }

  const candidate = await Candidate.findById(candidateId);

  if (!candidate) {
    throw new Error("Candidate not found");
  }

  // Increment vote
  candidate.voteCount += 1;
  await candidate.save();

  // Mark user as voted
  user.hasVoted = true;
  await user.save();

  return { message: "Vote cast successfully" };
};

module.exports = { vote };

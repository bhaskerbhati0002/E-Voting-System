const Candidate = require("../models/Candidate");
const User = require("../models/User");
const { sendVoteConfirmationEmail } = require("../utils/mailer");

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

  candidate.voteCount += 1;
  await candidate.save();

  user.hasVoted = true;
  await user.save();

  // Send vote confirmation email (non-blocking style)
  try {
    await sendVoteConfirmationEmail({
      to: user.email,
      voterName: user.name,
      candidateName: candidate.name,
      partyName: candidate.party,
    });
  } catch (e) {
    // Don't fail voting if email fails
    console.error("Vote confirmation email failed:", e.message);
  }

  return { message: "Vote cast successfully" };
};

module.exports = { vote };

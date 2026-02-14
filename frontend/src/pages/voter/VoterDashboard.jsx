import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const GET_CANDIDATES = gql`
  query {
    getCandidates {
      id
      name
      party
      partyImage
    }
  }
`;

const VOTE_MUTATION = gql`
  mutation Vote($candidateId: ID!) {
    vote(candidateId: $candidateId) {
      message
    }
  }
`;

export default function VoterDashboard() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const { data, loading, error } = useQuery(GET_CANDIDATES);

  const [vote, { loading: voting }] = useMutation(VOTE_MUTATION, {
    onCompleted: (data) => {
      setHasVoted(true);
      setStatusMessage("Your vote has been successfully recorded.");
    },
    onError: (err) => {
      const message = err.message;

      if (message.includes("already voted")) {
        setHasVoted(true);
        setStatusMessage("You have already casted your vote.");
      } else {
        setStatusMessage(message);
      }
    },
  });

  const handleVote = (candidateId) => {
    if (hasVoted) return;

    setSelectedCandidate(candidateId);
    vote({
      variables: { candidateId },
    });
  };

  if (loading)
    return (
      <p className="text-center text-slate-500">
        Loading candidates...
      </p>
    );

  if (error)
    return (
      <p className="text-red-500 text-center">
        {error.message}
      </p>
    );

  return (
    <div className="space-y-10 animate-fade-in">

      {/* Heading */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
          Cast Your Vote
        </h2>

        <p className="text-slate-500 mt-2">
          You can vote only once. Choose wisely.
        </p>

        {hasVoted && (
          <p className="mt-4 text-blue-600 font-medium">
            🔒 {statusMessage}
          </p>
        )}
      </div>

      {/* Candidates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.getCandidates.map((candidate) => {
          const isSelected = selectedCandidate === candidate.id;

          return (
            <div
              key={candidate.id}
              className={`transition-all duration-300 ${
                isSelected ? "scale-105" : ""
              }`}
            >
              <Card>
                <div className="space-y-4 text-center">

                  {candidate.partyImage && (
                    <img
                      src={candidate.partyImage}
                      alt={candidate.party}
                      className="h-20 mx-auto object-contain"
                    />
                  )}

                  <h3 className="text-xl font-semibold text-slate-800">
                    {candidate.name}
                  </h3>

                  <p className="text-slate-500">
                    {candidate.party}
                  </p>

                  <Button
                    onClick={() => handleVote(candidate.id)}
                    disabled={hasVoted || voting}
                  >
                    {hasVoted
                      ? "Vote Locked"
                      : isSelected && voting
                      ? "Voting..."
                      : "Vote"}
                  </Button>

                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

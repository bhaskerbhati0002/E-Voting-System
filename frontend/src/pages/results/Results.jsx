import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Card from "../../components/ui/Card";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const GET_RESULTS = gql`
  query {
    getResults {
      id
      name
      party
      partyImage
      voteCount
    }
  }
`;

export default function Results() {
  const { data, loading, error } = useQuery(GET_RESULTS);

  if (loading) {
    return <p className="text-center text-slate-500">Loading results...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error.message}</p>;
  }

  const results = data?.getResults || [];
  const totalVotes = results.reduce((sum, c) => sum + (c.voteCount || 0), 0);
  const totalCandidates = results.length;

  const topVote =
    results.length > 0 ? Math.max(...results.map((c) => c.voteCount || 0)) : 0;

  const winners = results.filter((c) => (c.voteCount || 0) === topVote);
  const isTie = winners.length > 1 && topVote > 0;

  const chartData = results.map((c) => ({
    name: c.name,
    votes: c.voteCount || 0,
  }));

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
          Election Results
        </h2>
        <p className="text-slate-500 mt-2">
          Analytics overview of votes and winner summary
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <p className="text-sm text-slate-500">Total Votes</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{totalVotes}</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Total Candidates</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">
            {totalCandidates}
          </p>
        </Card>

        <Card>
          <p className="text-lg font-bold text-slate-800 mt-2">
            {topVote === 0 ? "—" : isTie ? "Tie" : winners[0].name}
          </p>

          <p className="text-sm text-blue-600 font-medium">
            {topVote === 0
              ? ""
              : isTie
                ? winners.map((w) => w.party).join(" • ")
                : winners[0].party}
          </p>
        </Card>
      </div>

      {/* Winner Highlight */}
      {topVote > 0 && (
        <Card>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* If tie, show first party image (optional) */}
              {winners[0]?.partyImage && (
                <img
                  src={winners[0].partyImage}
                  alt={winners[0].party}
                  className="h-16 w-16 object-contain"
                />
              )}

              <div>
                <p className="text-sm text-slate-500">
                  {isTie ? "Result" : "Leading Candidate"}
                </p>

                <h3 className="text-2xl font-bold text-slate-800">
                  {isTie ? "Tie" : winners[0].name}
                </h3>

                <p className="text-blue-600 font-medium">
                  {isTie
                    ? winners.map((w) => `${w.name} (${w.party})`).join(" • ")
                    : winners[0].party}
                </p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm text-slate-500">Top Votes</p>
              <p className="text-3xl font-bold text-green-600">{topVote}</p>
              <p className="text-sm text-slate-500">
                {totalVotes > 0
                  ? `${Math.round((topVote / totalVotes) * 100)}% share`
                  : "0% share"}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Bar Chart */}
      <Card>
        <h3 className="text-xl font-semibold text-slate-800 mb-6">
          Vote Distribution
        </h3>

        {results.length === 0 ? (
          <p className="text-slate-500 text-center">No results available.</p>
        ) : (
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <defs>
                  <linearGradient id="voteGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.7} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="votes"
                  fill="url(#voteGradient)"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Ranking Table */}
      <Card>
        <h3 className="text-xl font-semibold text-slate-800 mb-6">
          Candidate Ranking
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-600 text-sm">
                <th className="px-4 py-2">Candidate</th>
                <th className="px-4 py-2">Party</th>
                <th className="px-4 py-2">Votes</th>
                <th className="px-4 py-2">Share</th>
              </tr>
            </thead>
            <tbody>
              {results.map((c) => {
                const share =
                  totalVotes > 0
                    ? Math.round((c.voteCount / totalVotes) * 100)
                    : 0;
                const isWinner = winners.some(
                  (w) => String(w.id) === String(c.id),
                );

                return (
                  <tr key={c.id} className="bg-white shadow-sm rounded-xl">
                    <td className="px-4 py-3 rounded-l-xl font-semibold text-slate-800">
                      <div className="flex items-center gap-3">
                        {c.partyImage && (
                          <img
                            src={c.partyImage}
                            alt={c.party}
                            className="h-8 w-8 object-contain"
                          />
                        )}
                        <span>{c.name}</span>
                        {isWinner && (
                          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                            Winner
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-600">{c.party}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {c.voteCount}
                    </td>
                    <td className="px-4 py-3 rounded-r-xl text-slate-600">
                      {share}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

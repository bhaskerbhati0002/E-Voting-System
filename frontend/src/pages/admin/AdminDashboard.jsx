import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState, useRef, useEffect } from "react";
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

const CREATE_CANDIDATE = gql`
  mutation CreateCandidate($input: CreateCandidateInput!) {
    createCandidate(input: $input) {
      id
      name
      party
      partyImage
    }
  }
`;

const DELETE_CANDIDATE = gql`
  mutation DeleteCandidate($candidateId: ID!) {
    deleteCandidate(candidateId: $candidateId)
  }
`;

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    party: "",
    partyImage: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const { data, loading, error, refetch } = useQuery(GET_CANDIDATES);

  const [createCandidate, { loading: creating }] = useMutation(
    CREATE_CANDIDATE,
    {
      onCompleted: () => {
        setIsModalOpen(false);
        setFormData({ name: "", party: "", partyImage: "" });
        refetch();
      },
    }
  );

  const [deleteCandidate] = useMutation(DELETE_CANDIDATE, {
    onCompleted: () => {
      refetch();
    },
  });

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = (e) => {
    e.preventDefault();

    createCandidate({
      variables: {
        input: formData,
      },
    });
  };

  const handleDelete = (id) => {
    deleteCandidate({
      variables: { candidateId: id },
    });
  };

  if (loading)
    return <p className="text-center text-slate-500">Loading...</p>;

  if (error)
    return <p className="text-red-500 text-center">{error.message}</p>;

  return (
    <div className="space-y-10 animate-fade-in">

      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
          Admin Dashboard
        </h2>
        <p className="text-slate-500 mt-2">
          Manage election candidates
        </p>
      </div>

      {/* Existing Candidates Section */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-slate-800">
          Existing Candidates
        </h3>

        <Button onClick={() => setIsModalOpen(true)}>
          + Add Candidate
        </Button>
      </div>

      {/* Candidate Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.getCandidates.map((candidate) => (
          <Card key={candidate.id}>
            <div className="space-y-4 text-center">

              {candidate.partyImage && (
                <img
                  src={candidate.partyImage}
                  alt={candidate.party}
                  className="h-20 mx-auto object-contain"
                />
              )}

              <h4 className="text-lg font-semibold text-slate-800">
                {candidate.name}
              </h4>

              <p className="text-slate-500">
                {candidate.party}
              </p>

              <Button
                variant="danger"
                onClick={() => handleDelete(candidate.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">

          <div
            ref={modalRef}
            className="bg-white/95 backdrop-blur-xl border border-white/40 
                       shadow-2xl rounded-3xl p-8 w-full max-w-lg 
                       animate-fade-in"
          >
            <h3 className="text-xl font-semibold mb-6 text-slate-800">
              Add New Candidate
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">

              <input
                type="text"
                name="name"
                placeholder="Candidate Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />

              <input
                type="text"
                name="party"
                placeholder="Party Name"
                required
                value={formData.party}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />

              <input
                type="text"
                name="partyImage"
                placeholder="Party Image URL"
                value={formData.partyImage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={creating}>
                  {creating ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

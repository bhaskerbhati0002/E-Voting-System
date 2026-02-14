import { useState, useMemo, useEffect } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

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

const GET_VOTERS = gql`
  query {
    getVoters {
      id
      name
      email
      hasVoted
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

const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    registerUser(input: $input) {
      token
    }
  }
`;

const DELETE_CANDIDATE = gql`
  mutation DeleteCandidate($candidateId: ID!) {
    deleteCandidate(candidateId: $candidateId)
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId)
  }
`;

const UPDATE_CANDIDATE = gql`
  mutation UpdateCandidate($candidateId: ID!, $input: UpdateCandidateInput!) {
    updateCandidate(candidateId: $candidateId, input: $input) {
      id
      name
      party
      partyImage
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($userId: ID!, $name: String!) {
    updateUser(userId: $userId, name: $name) {
      id
      name
      email
    }
  }
`;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("candidates");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

  const { data: candidateData, refetch: refetchCandidates } =
    useQuery(GET_CANDIDATES);

  const { data: voterData, refetch: refetchVoters } = useQuery(GET_VOTERS);

  const [createCandidate] = useMutation(CREATE_CANDIDATE, {
    onCompleted: () => {
      setShowModal(false);
      refetchCandidates();
    },
  });

  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted: () => {
      setShowModal(false);
      refetchVoters();
    },
  });

  const [deleteCandidate] = useMutation(DELETE_CANDIDATE, {
    onCompleted: () => {
      setDeleteTarget(null);
      refetchCandidates();
    },
  });

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      setDeleteTarget(null);
      refetchVoters();
    },
  });

  const [updateCandidate] = useMutation(UPDATE_CANDIDATE, {
    onCompleted: () => {
      setEditTarget(null);
      refetchCandidates();
    },
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      setEditTarget(null);
      refetchVoters();
    },
  });

  const filteredData = useMemo(() => {
    let items =
      activeTab === "candidates"
        ? candidateData?.getCandidates || []
        : voterData?.getVoters || [];

    if (search.trim()) {
      const keyword = search.toLowerCase();

      items = items.filter((item) => {
        if (activeTab === "candidates") {
          return (
            item.name.toLowerCase().includes(keyword) ||
            item.party.toLowerCase().includes(keyword)
          );
        } else {
          return (
            item.name.toLowerCase().includes(keyword) ||
            item.email.toLowerCase().includes(keyword)
          );
        }
      });
    }

    if (sortKey) {
      items = [...items].sort((a, b) =>
        String(a[sortKey]).localeCompare(String(b[sortKey])),
      );
    }

    return items;
  }, [search, sortKey, activeTab, candidateData, voterData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab);
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, `${activeTab}.xlsx`);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      if (activeTab === "candidates") {
        await deleteCandidate({
          variables: { candidateId: deleteTarget },
        });
        await refetchCandidates();
      } else {
        await deleteUser({
          variables: { userId: deleteTarget },
        });
        await refetchVoters();
      }

      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex gap-10 animate-fade-in">
      {/* Sidebar */}
      <div className="w-64 space-y-4">
        <Card>
          <div className="space-y-4">
            <button
              className={`w-full text-left px-4 py-2 rounded-xl ${
                activeTab === "candidates"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-100"
              }`}
              onClick={() => setActiveTab("candidates")}
            >
              Candidate List
            </button>

            <button
              className={`w-full text-left px-4 py-2 rounded-xl ${
                activeTab === "voters"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-100"
              }`}
              onClick={() => setActiveTab("voters")}
            >
              Voter List
            </button>
          </div>
        </Card>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6">
        {/* Top Controls */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {activeTab === "candidates"
              ? "Existing Candidates"
              : "Registered Voters"}
          </h2>

          <div className="flex gap-3">
            <input
              placeholder="Search..."
              className="px-4 py-2 border rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="px-4 py-2 border rounded-xl"
              onChange={(e) => setSortKey(e.target.value)}
            >
              <option value="">Sort</option>
              {activeTab === "candidates" ? (
                <>
                  <option value="name">Name</option>
                  <option value="party">Party</option>
                </>
              ) : (
                <>
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                </>
              )}
            </select>

            <Button onClick={exportToExcel}>Export</Button>

            <Button onClick={() => setShowModal(true)}>
              {activeTab === "candidates" ? "Add Candidate" : "Add Voter"}
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-slate-600 text-sm">
                  {activeTab === "candidates" ? (
                    <>
                      <th>Name</th>
                      <th>Party</th>
                      <th>Action</th>
                    </>
                  ) : (
                    <>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Voted</th>
                      <th>Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item._id} className="bg-white shadow-sm rounded-xl">
                    {activeTab === "candidates" ? (
                      <>
                        <td className="px-4 py-3 rounded-l-xl">{item.name}</td>
                        <td className="px-4 py-3 rounded-l-xl">{item.party}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 rounded-l-xl">{item.name}</td>
                        <td className="px-4 py-3 rounded-l-xl">{item.email}</td>
                        <td className="px-4 py-3 rounded-l-xl">
                          {item.hasVoted ? (
                            <span className="text-green-600 font-semibold">
                              Yes
                            </span>
                          ) : (
                            "No"
                          )}
                        </td>
                      </>
                    )}

                    <td className="px-4 py-3 text-right rounded-r-xl">
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="secondary"
                          className="px-4 py-2 text-sm"
                          onClick={() =>
                            setEditTarget({
                              type: activeTab,
                              data: item,
                            })
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          className="px-4 py-2 text-sm"
                          onClick={() => setDeleteTarget(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded-xl border ${
                currentPage === 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-slate-100"
              }`}
            >
              Previous
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-8 h-8 rounded-full ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white border hover:bg-slate-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded-xl border ${
                currentPage === totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-slate-100"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add Candidate Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <AddForm
            activeTab={activeTab}
            onSubmit={(input) => {
              if (activeTab === "candidates") {
                createCandidate({ variables: { input } });
              } else {
                registerUser({ variables: { input } });
              }
            }}
          />
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <div className="space-y-6 text-center">
            <h3 className="text-lg font-semibold">Are you sure?</h3>
            <div className="flex justify-center gap-4">
              <Button onClick={handleDeleteConfirm}>Yes</Button>
              <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
                No
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {editTarget && (
        <Modal onClose={() => setEditTarget(null)}>
          <EditForm
            editTarget={editTarget}
            onSubmit={(input) => {
              if (editTarget.type === "candidates") {
                updateCandidate({
                  variables: {
                    candidateId: editTarget.data.id,
                    input,
                  },
                });
              } else {
                updateUser({
                  variables: {
                    userId: editTarget.data.id,
                    name: input.name,
                  },
                });
              }
            }}
          />
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl w-[400px] relative">
        <button
          className="absolute top-3 right-4 text-gray-400"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

function AddForm({ activeTab, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    party: "",
    partyImage: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab === "candidates") {
      onSubmit({
        name: form.name,
        party: form.party,
        partyImage: form.partyImage,
      });
    } else {
      onSubmit({
        name: form.name,
        email: form.email,
        password: form.password,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">
        {activeTab === "candidates" ? "Add Candidate" : "Add Voter"}
      </h3>

      <input
        placeholder="Name"
        required
        className="w-full px-4 py-2 border rounded-xl"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      {activeTab === "candidates" ? (
        <>
          <input
            placeholder="Party"
            required
            className="w-full px-4 py-2 border rounded-xl"
            onChange={(e) => setForm({ ...form, party: e.target.value })}
          />
          <input
            placeholder="Party Image URL"
            className="w-full px-4 py-2 border rounded-xl"
            onChange={(e) =>
              setForm({
                ...form,
                partyImage: e.target.value,
              })
            }
          />
        </>
      ) : (
        <>
          <input
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-xl"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-xl"
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />
        </>
      )}

      <Button type="submit" className="w-full">
        Create
      </Button>
    </form>
  );
}

function EditForm({ editTarget, onSubmit }) {
  const isCandidate = editTarget.type === "candidates";
  const data = editTarget.data;

  const [form, setForm] = useState({
    name: data.name || "",
    party: data.party || "",
    partyImage: data.partyImage || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isCandidate) {
      onSubmit({
        name: form.name,
        party: form.party,
        partyImage: form.partyImage,
      });
    } else {
      onSubmit({
        name: form.name,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">
        Edit {isCandidate ? "Candidate" : "Voter"}
      </h3>

      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full px-4 py-2 border rounded-xl"
        placeholder="Name"
      />

      {isCandidate && (
        <>
          <input
            value={form.party}
            onChange={(e) => setForm({ ...form, party: e.target.value })}
            className="w-full px-4 py-2 border rounded-xl"
            placeholder="Party"
          />

          <input
            value={form.partyImage}
            onChange={(e) =>
              setForm({
                ...form,
                partyImage: e.target.value,
              })
            }
            className="w-full px-4 py-2 border rounded-xl"
            placeholder="Party Image URL"
          />
        </>
      )}

      <Button type="submit" className="w-full">
        Save Changes
      </Button>
    </form>
  );
}

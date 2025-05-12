import React, { useState, useEffect } from "react";
import { goalsApi } from "../../api/goalsApi";
import { GoalResponse, GoalRequest, GoalStatus } from "../../types/goal-types";
import { format } from "date-fns";
import { Calendar, CheckCircle, X } from "lucide-react";
import moment from "moment";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { AlertTriangle } from "lucide-react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outline: "none",
  borderRadius: 4,
  maxHeight: "90vh",
  overflowY: "auto",
};
interface CreateUpdateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goalData: GoalRequest) => void;
  initialData?: GoalResponse;
  title: string;
}

const CreateUpdateGoalModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}: CreateUpdateGoalModalProps) => {
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description);
      setTargetDate(moment(initialData.targetDate).format("YYYY-MM-DD"));
    } else {
      setDescription("");
      setTargetDate("");
    }
    setError("");
  }, [initialData, isOpen]);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    if (!targetDate) {
      setError("Target date is required");
      return;
    }

    const goalData = {
      description: description.trim(),
      targetDate: moment(targetDate).toDate(),
    };
    console.log("Goal data", goalData);
    onSubmit(goalData);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <div>
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {error && (
            <div className="mx-4 mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="What do you want to achieve?"
              />
            </div>

            <div>
              <label
                htmlFor="targetDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Target Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="targetDate"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 mr-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-1.5" />
                {initialData ? "Update Goal" : "Create Goal"}
              </button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

const GoalStatusBadge: React.FC<{ status: GoalStatus }> = ({ status }) => {
  let badgeClass =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  switch (status) {
    case GoalStatus.NOT_STARTED:
      badgeClass += " bg-gray-100 text-gray-800";
      break;
    case GoalStatus.IN_PROGRESS:
      badgeClass += " bg-blue-100 text-blue-800";
      break;
    case GoalStatus.COMPLETED:
      badgeClass += " bg-green-100 text-green-800";
      break;
    default:
      badgeClass += " bg-gray-100 text-gray-800";
  }

  return <span className={badgeClass}>{status.replace("_", " ")}</span>;
};

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<GoalResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<GoalResponse | undefined>(
    undefined
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<GoalStatus | "ALL">("ALL");

  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const data = await goalsApi.getAllGoals();
      setGoals(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch goals");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (goalData: GoalRequest) => {
    try {
      await goalsApi.createGoal(goalData);
      setIsModalOpen(false);
      fetchGoals();
    } catch (err) {
      setError("Failed to create goal");
      console.error(err);
    }
  };

  const handleUpdateGoal = async (goalData: GoalRequest) => {
    if (!currentGoal) return;

    try {
      const newData = {
        ...goalData,
        status: currentGoal.status,
      };

      await goalsApi.updateGoal(currentGoal.id, newData);
      setIsModalOpen(false);
      setCurrentGoal(undefined);
      fetchGoals();
    } catch (err) {
      setError("Failed to update goal");
      console.error(err);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    setIsDeleting(true);
    try {
      await goalsApi.deleteGoal(goalId);
      fetchGoals();
    } catch (err) {
      setError("Failed to delete goal");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateModal = () => {
    setCurrentGoal(undefined);
    setIsModalOpen(true);
  };

  const openUpdateModal = (goal: GoalResponse) => {
    setCurrentGoal(goal);
    setIsModalOpen(true);
  };

  const updateGoalStatus = async (goalId: string, status: GoalStatus) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    try {
      await goalsApi.updateGoal(goalId, {
        description: goal.description,
        targetDate: goal.targetDate,
        status: status,
      });
      fetchGoals();
    } catch (err) {
      setError("Failed to update goal status");
      console.error(err);
    }
  };

  const filteredGoals =
    statusFilter === "ALL"
      ? goals
      : goals.filter((goal) => goal.status === statusFilter);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Goals</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your personal goals
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="-ml-1 mr-2 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add New Goal
        </button>
      </div>

      {/* Status filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1 text-sm rounded-full ${
              statusFilter === "ALL"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          {Object.values(GoalStatus).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-sm rounded-full ${
                statusFilter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <span className="block sm:inline">{error}</span>
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No goals found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {statusFilter === "ALL"
              ? "Get started by creating a new goal."
              : `No goals with ${statusFilter.replace("_", " ")} status.`}
          </p>
          {statusFilter === "ALL" && (
            <div className="mt-6">
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="-ml-1 mr-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Create your first goal
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredGoals.map((goal) => (
              <li key={goal.id}>
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {goal.description}
                      </h3>
                      <div className="flex flex-wrap gap-3 mt-2 sm:mt-0">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Target:{" "}
                          {format(new Date(goal.targetDate), "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Created:{" "}
                          {format(new Date(goal.createdAt), "MMM d, yyyy")}
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <GoalStatusBadge status={goal.status} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-2">
                      {/* Status update dropdown */}
                      <div className="relative inline-block text-left">
                        <select
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          value={goal.status}
                          onChange={(e) =>
                            updateGoalStatus(
                              goal.id,
                              e.target.value as GoalStatus
                            )
                          }
                        >
                          {Object.values(GoalStatus).map((status) => (
                            <option key={status} value={status}>
                              {status.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => openUpdateModal(goal)}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        title="Edit"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        disabled={isDeleting}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
                        title="Delete"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <CreateUpdateGoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentGoal(undefined);
        }}
        onSubmit={currentGoal ? handleUpdateGoal : handleCreateGoal}
        initialData={currentGoal}
        title={currentGoal ? "Edit Goal" : "Create New Goal"}
      />
    </div>
  );
};

export default GoalsPage;

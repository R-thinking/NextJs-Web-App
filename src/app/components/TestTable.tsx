"use client";

import { useState, useMemo, useEffect } from "react";
import { TSafeTest, TServerData } from "@/types/test";
import UserForm from "./UserForm";
import ClientDate from "./ClientDate";
import OperationModal, { ModalType, OperationType } from "./OperationModal";
import { styles } from "@/app/styles/classNames";

export default function TestTable({ initialTests }: TServerData) {
  const [tests, setTests] = useState<TSafeTest[]>(JSON.parse(initialTests));
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;

  // Modal state for TestTable level
  const [modal, setModal] = useState<{
    type: ModalType | null;
    operation: OperationType;
    userId: string | null;
  }>({
    type: null,
    operation: "create",
    userId: null,
  });

  // Debug useEffect
  useEffect(() => {
    console.log("deletingId changed:", deletingId);
  }, [deletingId]);

  const filteredTests = useMemo(() => {
    const filtered = tests.filter(
      (test) =>
        test.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort by creation date, newest first
    return [...filtered].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [tests, searchTerm]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredTests.length / rowsPerPage);
  const paginatedTests = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredTests.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredTests, currentPage, rowsPerPage]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Show delete confirmation modal
  const showDeleteConfirmation = (id: string) => {
    // Cancel any other operations first
    setIsCreating(false);
    setEditingId(null);
    // Then set up for deletion
    setDeletingId(id);
    setModal({
      type: "confirm",
      operation: "delete",
      userId: id,
    });
  };

  // Show success modal for any operation
  const showSuccessModal = (
    operation: OperationType,
    userId: string | null = null
  ) => {
    setModal({
      type: "success",
      operation,
      userId,
    });
  };

  // Handle form submit for create and update
  const handleFormSubmit = async (
    user: TSafeTest,
    operation: OperationType
  ) => {
    try {
      // Show success modal immediately before API call
      showSuccessModal(operation, user.id);

      if (operation === "update") {
        // Update existing user (API call happens in background)
        fetch("/api/tests", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user.id,
            name: user.name,
            phone: user.phone,
            age: user.age,
          }),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Failed to update user");
          })
          .then((updatedUser) => {
            setTests((prev) =>
              prev.map((test) => (test.id === user.id ? updatedUser : test))
            );
            setEditingId(null);
          })
          .catch((error) => {
            console.error("Failed to update user:", error);
            setEditingId(null);
          });
      } else if (operation === "create") {
        // Create new user (API call happens in background)
        fetch("/api/tests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            phone: user.phone,
            age: user.age,
          }),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Failed to create user");
          })
          .then((newUser) => {
            setTests((prev) => [...prev, newUser]);
            setIsCreating(false);
          })
          .catch((error) => {
            console.error("Failed to create user:", error);
            setIsCreating(false);
          });
      }
    } catch (error) {
      console.error(`Error ${operation} user:`, error);
      // Reset states on error
      if (operation === "update") setEditingId(null);
      if (operation === "create") setIsCreating(false);
    }
  };

  const handleSave = async (user: TSafeTest) => {
    try {
      if (deletingId) {
        // This should not be called directly now since we're using the modal flow
        // But just in case, let's show the confirmation modal
        showDeleteConfirmation(deletingId);
        return;
      }

      if (editingId) {
        // Handle update with the new form submit handler
        await handleFormSubmit(user, "update");
      } else {
        // Handle create with the new form submit handler
        await handleFormSubmit(user, "create");
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    // Remove the timeout to eliminate latency
    setIsCreating(false);
    setEditingId(null);
    setDeletingId(null);
  };

  // Add New User button click handler
  const handleAddUserClick = () => {
    // Clean up any existing forms before showing the create form
    setEditingId(null);
    setDeletingId(null);
    // Remove timeout to eliminate latency
    setIsCreating(true);
  };

  // Handle deletion confirmed by user
  const handleDeleteConfirm = () => {
    if (!modal.userId) return;

    // First show success modal immediately
    setModal({
      type: "success",
      operation: "delete",
      userId: modal.userId,
    });

    // Store the ID to delete for later use
    const idToDelete = modal.userId;

    // Then perform the deletion in the background
    fetch(`/api/tests?id=${idToDelete}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Remove the deleted user from the list
          setTests((prev) => prev.filter((test) => test.id !== idToDelete));

          // Reset deletingId if it matches
          if (deletingId === idToDelete) {
            setDeletingId(null);
          }
        } else {
          console.error("Failed to delete user with ID:", idToDelete);
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  // Handle modal closing
  const handleModalClose = () => {
    // Simply reset modal state without waiting for anything
    setModal({
      type: null,
      operation: "create",
      userId: null,
    });
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black font-medium placeholder:text-gray-600 placeholder:font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <button
          onClick={handleAddUserClick}
          className={`${styles.primaryButton} py-2 px-4 rounded-lg flex items-center`}
          disabled={isCreating}
        >
          <svg
            className="h-5 w-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add New User
        </button>
      </div>

      {isCreating && (
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold mb-4 text-black">
            Add New User
          </h2>
          <UserForm onSave={handleSave} onCancel={handleCancel} mode="create" />
        </div>
      )}

      {filteredTests.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          {searchTerm
            ? "No users match your search."
            : "No users found. Add some!"}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className={styles.tableHeader}>Name</th>
                <th className={styles.tableHeader}>Phone</th>
                <th className={styles.tableHeader}>Age</th>
                <th className={styles.tableHeader}>Created</th>
                <th className={`${styles.tableHeader} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTests.map((test) =>
                editingId === test.id ? (
                  <tr key={test.id} className="bg-blue-50">
                    <td colSpan={5} className="px-6 py-4">
                      <UserForm
                        initialData={test}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        mode="update"
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className={styles.tableCell}>
                      <div className={styles.tableCellText}>
                        {test.name || "N/A"}
                      </div>
                    </td>
                    <td
                      className={`${styles.tableCell} text-gray-700 font-medium`}
                    >
                      {test.phone || "N/A"}
                    </td>
                    <td
                      className={`${styles.tableCell} text-gray-700 font-medium`}
                    >
                      {test.age !== null ? test.age : "N/A"}
                    </td>
                    <td
                      className={`${styles.tableCell} text-gray-700 font-medium`}
                    >
                      <ClientDate date={test.created_at.toString()} />
                    </td>
                    <td
                      className={`${styles.tableCell} text-right text-sm font-medium`}
                    >
                      <button
                        onClick={() => {
                          // Cancel any ongoing "add user" operation when edit is clicked
                          setIsCreating(false);
                          setEditingId(test.id);
                        }}
                        className="px-3 py-1.5 rounded-md text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-200 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          // Cancel any ongoing "add user" or "edit" operations
                          setIsCreating(false);
                          setEditingId(null);
                          showDeleteConfirmation(test.id);
                        }}
                        className="px-3 py-1.5 rounded-md text-red-600 border border-red-300 bg-red-50 hover:bg-red-100 hover:text-red-800 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="px-6 py-4 bg-gray-100 backdrop-blur-sm bg-opacity-50 border-t text-gray-600 flex justify-between items-center">
        <span className="text-sm font-semibold">
          Showing {paginatedTests.length} of {filteredTests.length} users
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || totalPages === 0}
            className={`px-3 py-1 rounded w-20 text-xs font-bold text-center ${
              currentPage === 1 || totalPages === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Previous
          </button>

          <span className="text-xs font-bold text-gray-800">
            Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-1 rounded w-20 text-xs font-bold text-center ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Global modal for confirmation and success */}
      {modal.type && (
        <OperationModal
          isOpen={modal.type !== null}
          onClose={handleModalClose}
          onConfirm={handleDeleteConfirm}
          type={modal.type}
          operation={modal.operation}
        />
      )}
    </div>
  );
}

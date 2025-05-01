"use client";

import { useState, useMemo, useEffect } from "react";
import { TSafeTest, TServerData } from "@/types/test";
import UserForm from "./UserForm";
import ClientDate from "./ClientDate";
import OperationModal, { ModalType, OperationType } from "./OperationModal";
import FormModal from "./FormModal";
import { styles } from "@/app/styles/classNames";

export default function TestTable({ initialTests }: TServerData) {
  const [tests, setTests] = useState<TSafeTest[]>(JSON.parse(initialTests));
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

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

  // Get current user being edited
  const userBeingEdited = useMemo(() => {
    if (!editingId) return null;
    return tests.find((test) => test.id === editingId) || null;
  }, [tests, editingId]);

  // Debug useEffect
  useEffect(() => {
    // console.log removed
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

  // Handle rows per page change
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    // Reset to first page when changing rows per page
    setCurrentPage(1);
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
      <div className="flex flex-row items-center p-4 border-b gap-2 justify-between">
        <div className="relative min-w-0 max-w-xs w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base font-normal placeholder:text-gray-700 placeholder:font-normal placeholder:opacity-50 focus:placeholder:opacity-0 focus:placeholder:text-transparent w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-600"
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
          className={`${styles.primaryButton} py-2 px-4 rounded-lg flex items-center justify-center whitespace-nowrap text-xs sm:text-sm h-[38px]`}
          disabled={isCreating}
        >
          <svg
            className="h-3.5 w-3.5 sm:h-5 sm:w-5 mr-1 sm:mr-2 flex-shrink-0"
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
          <span className="whitespace-nowrap text-2xs sm:text-sm">
            Add New User
          </span>
        </button>
      </div>

      {filteredTests.length === 0 ? (
        <div className="p-6 sm:p-8 text-center text-gray-500 text-sm sm:text-base">
          {searchTerm
            ? "No users match your search."
            : "No users found. Add some!"}
        </div>
      ) : (
        <div className={styles.responsiveTable}>
          <table className="min-w-full divide-y divide-gray-200 table-layout-fixed">
            <colgroup>
              <col style={{ width: "25%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <thead className="bg-gray-50">
              <tr>
                <th
                  className={`${styles.tableHeader}`}
                  style={{ minWidth: "100px" }}
                >
                  Name
                </th>
                <th
                  className={`${styles.tableHeader}`}
                  style={{ minWidth: "100px" }}
                >
                  Phone
                </th>
                <th
                  className={`${styles.tableHeader} text-center`}
                  style={{ minWidth: "40px" }}
                >
                  Age
                </th>
                <th
                  className={`${styles.tableHeader}`}
                  style={{ minWidth: "85px" }}
                >
                  Created
                </th>
                <th
                  className={`${styles.tableHeader} text-right`}
                  style={{ minWidth: "100px" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className={styles.tableCell}>
                    <div
                      className={styles.tableCellText}
                      title={test.name || "N/A"}
                    >
                      {test.name || "N/A"}
                    </div>
                  </td>
                  <td
                    className={`${styles.tableCell} text-gray-700 font-medium`}
                  >
                    <span
                      className="block truncate text-2xs sm:text-sm"
                      title={test.phone || "N/A"}
                    >
                      {test.phone || "N/A"}
                    </span>
                  </td>
                  <td
                    className={`${styles.tableCell} text-gray-700 font-medium text-center`}
                  >
                    <span className="block truncate text-2xs sm:text-sm">
                      {test.age !== null ? test.age : "N/A"}
                    </span>
                  </td>
                  <td
                    className={`${styles.tableCell} text-gray-700 font-medium`}
                  >
                    <span
                      className="block truncate text-2xs sm:text-sm"
                      title={test.created_at.toString()}
                    >
                      <ClientDate
                        date={test.created_at.toString()}
                        short={true}
                      />
                    </span>
                  </td>
                  <td
                    className={`${styles.tableCell} text-right text-2xs sm:text-sm font-medium`}
                  >
                    <div className="flex flex-row justify-end gap-1 sm:gap-2">
                      <button
                        onClick={() => {
                          // Cancel any ongoing "add user" operation when edit is clicked
                          setIsCreating(false);
                          setEditingId(test.id);
                        }}
                        className="px-1 sm:px-2 py-1 rounded-md text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-200 text-2xs sm:text-xs"
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
                        className="px-1 sm:px-2 py-1 rounded-md text-red-600 border border-red-300 bg-red-50 hover:bg-red-100 hover:text-red-800 transition-colors duration-200 text-2xs sm:text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-100 backdrop-blur-sm bg-opacity-50 border-t text-gray-600 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <div className="flex items-center gap-2 text-2xs sm:text-sm">
            <span className="font-medium whitespace-nowrap">
              Items per page
            </span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="appearance-none bg-white border border-gray-300 text-gray-700 py-1 px-3 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xs sm:text-sm font-medium"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <span className="text-2xs sm:text-sm font-semibold whitespace-nowrap">
            {filteredTests.length > 0
              ? `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
                  currentPage * rowsPerPage,
                  filteredTests.length
                )} of ${filteredTests.length} items`
              : "0 items"}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || totalPages === 0}
            className={`px-2 sm:px-3 py-1 rounded text-2xs sm:text-xs font-bold text-center w-[90px] sm:w-[100px] ${
              currentPage === 1 || totalPages === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Previous
          </button>

          <div className="text-2xs sm:text-xs font-bold text-gray-800 text-center px-1 min-w-[80px]">
            Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-2 sm:px-3 py-1 rounded text-2xs sm:text-xs font-bold text-center w-[90px] sm:w-[100px] ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Form Modals */}
      <FormModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSave={(user) => handleFormSubmit(user, "create")}
        operation="create"
      />

      <FormModal
        isOpen={!!editingId}
        onClose={() => setEditingId(null)}
        onSave={(user) => handleFormSubmit(user, "update")}
        operation="update"
        initialData={userBeingEdited || undefined}
      />

      {/* Confirmation/Success Modal */}
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

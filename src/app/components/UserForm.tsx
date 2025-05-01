"use client";

import { useState, useEffect, useRef } from "react";
import { TSafeTest } from "@/types/test";
import OperationModal, { ModalType, OperationType } from "./OperationModal";
import { faker } from "@faker-js/faker";
import { styles } from "@/app/styles/classNames";

interface UserFormProps {
  initialData?: TSafeTest;
  onSave: (user: TSafeTest) => void;
  onCancel: () => void;
  mode?: OperationType;
}

export default function UserForm({
  initialData,
  onSave,
  onCancel,
  mode = "create",
}: UserFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [age, setAge] = useState<number | null>(initialData?.age || null);

  // One state for the current modal to show
  const [currentModal, setCurrentModal] = useState<ModalType | null>(null);

  // Add a processing flag to prevent double execution
  const [isProcessing, setIsProcessing] = useState(false);
  const actionCompletedRef = useRef(false);

  // Immediately show confirmation modal for delete operations
  useEffect(() => {
    if (mode === "delete") {
      setCurrentModal("confirm");
    }
  }, [mode]);

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "delete") {
      // For delete, always show confirmation first
      setCurrentModal("confirm");
    } else {
      // For create/update, directly execute the action
      executeAction();
    }
  };

  // Generate random user data
  const fillRandomData = () => {
    setName(faker.person.fullName());
    setPhone(faker.phone.number());
    setAge(faker.number.int({ min: 18, max: 80 }));
  };

  // Execute the action (create, update, or delete)
  const executeAction = () => {
    // Prevent multiple executions
    if (isProcessing || actionCompletedRef.current) return;

    // Set processing flag
    setIsProcessing(true);

    // Prepare user data
    const userData = {
      id: initialData?.id || "",
      name,
      phone,
      age,
      created_at: initialData?.created_at || new Date(),
    };

    // Always show success modal immediately for any operation
    if (currentModal === "confirm") {
      actionCompletedRef.current = true;
      // Show success modal immediately
      setCurrentModal("success");
      // Then call onSave which will handle the API request
      onSave(userData);
    } else {
      // For direct actions (create/update without confirmation)
      actionCompletedRef.current = true;
      // Show success modal immediately
      setCurrentModal("success");
      // Then call onSave which will handle the API request
      onSave(userData);
    }
  };

  // Handle modal closing
  const handleModalClose = () => {
    // Always reset flags when a modal is closed
    setIsProcessing(false);
    setCurrentModal(null);
    actionCompletedRef.current = false;

    // Only call onCancel when closing the success modal
    if (currentModal === "success") {
      onCancel();
    }
  };

  // When success modal is visible, don't show the form anymore
  const isFormVisible = currentModal !== "success";

  return (
    <>
      {isFormVisible && (
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4">
            {/* <h3 className="text-base sm:text-lg font-semibold text-black mb-2 sm:mb-0">
              {mode === "create"
                ? "Create New User"
                : mode === "update"
                ? "Update User"
                : "Delete User"}
            </h3> */}

            {mode !== "delete" && (
              <button
                type="button"
                onClick={fillRandomData}
                className="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-800 flex items-center justify-center sm:justify-start w-full sm:w-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Fill Random Data
              </button>
            )}
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className={styles.formLabel}>Name</label>
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                disabled={mode === "delete"}
              />
            </div>

            <div>
              <label className={styles.formLabel}>Phone</label>
              <input
                type="text"
                placeholder="Enter phone number"
                value={phone || ""}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.input}
                disabled={mode === "delete"}
              />
            </div>

            <div>
              <label className={styles.formLabel}>Age</label>
              <input
                type="number"
                placeholder="Enter age"
                value={age === null ? "" : age}
                onChange={(e) =>
                  setAge(e.target.value ? Number(e.target.value) : null)
                }
                className={styles.input}
                disabled={mode === "delete"}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-3 space-y-reverse sm:space-y-0 mt-4 sm:mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-md bg-white text-black border border-gray-300 font-medium text-sm shadow-sm w-full sm:w-24 h-10 flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md ${
                mode === "delete" ? styles.dangerButton : styles.primaryButton
              } w-full sm:w-24 text-sm h-10 flex items-center justify-center`}
            >
              {mode === "create"
                ? "Create"
                : mode === "update"
                ? "Update"
                : "Delete"}
            </button>
          </div>
        </form>
      )}

      {/* Single Modal Component - handles both confirmation and success */}
      {currentModal && (
        <OperationModal
          isOpen={currentModal !== null}
          onClose={handleModalClose}
          onConfirm={executeAction}
          type={currentModal}
          operation={mode}
        />
      )}
    </>
  );
}

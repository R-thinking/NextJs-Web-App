import React from "react";
import { styles } from "@/app/styles/classNames";

// Type of operation for the modal
export type OperationType = "create" | "update" | "delete";

// Type of modal to show
export type ModalType = "success" | "confirm";

interface OperationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  type: ModalType;
  operation: OperationType;
}

export default function OperationModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  operation,
}: OperationModalProps) {
  if (!isOpen) return null;

  // Set title based on modal type and operation
  const title =
    type === "success"
      ? "Success"
      : operation === "delete"
      ? "Warning"
      : "Confirm";

  // Set title color based on modal type and operation
  const titleColor =
    type === "success"
      ? "text-black"
      : operation === "delete"
      ? "text-red-600"
      : "text-blue-600";

  // Set message based on modal type and operation
  const message =
    type === "success"
      ? operation === "create"
        ? "User created successfully"
        : operation === "update"
        ? "User updated successfully"
        : "User deleted successfully"
      : operation === "delete"
      ? "Are you sure you want to delete this user? This action cannot be undone."
      : operation === "update"
      ? "Are you sure you want to update this user?"
      : "Are you sure you want to create this user?";

  // Set action button color
  const buttonColor =
    operation === "delete" && type === "confirm"
      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
      : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";

  // Set action button text
  const buttonText =
    type === "success"
      ? "Close"
      : operation === "delete"
      ? "Delete"
      : operation === "update"
      ? "Update"
      : "Create";

  // Simple direct handlers without any processing state
  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };

  // Function to handle overlay click (close modal when clicking outside)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the click was directly on the overlay (the parent container)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalContainer} onClick={handleOverlayClick}>
      <div
        className={`${styles.modalContent} w-full max-w-md mx-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6 px-4 sm:px-6">
          <h3 className={`text-lg sm:text-xl font-bold ${titleColor}`}>
            {title}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl"
          >
            ✕
          </button>
        </div>

        <p className="text-black text-sm sm:text-lg mb-5 sm:mb-6 px-4 sm:px-6">
          {message}
        </p>

        <div
          className={`flex flex-col-reverse sm:flex-row sm:justify-end px-4 sm:px-6 pb-4 ${
            type === "confirm"
              ? "sm:space-x-4 space-y-2 space-y-reverse sm:space-y-0"
              : ""
          }`}
        >
          {type === "confirm" && (
            <button
              onClick={handleClose}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md ${styles.secondaryButton} text-xs sm:text-base w-full sm:w-auto`}
            >
              Cancel
            </button>
          )}

          <button
            onClick={type === "success" ? handleClose : handleConfirm}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md ${
              operation === "delete" && type === "confirm"
                ? styles.dangerButton
                : styles.primaryButton
            } text-xs sm:text-base w-full sm:w-auto`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

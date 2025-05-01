import React, { useRef, useEffect } from "react";
import { styles } from "@/app/styles/classNames";
import { TSafeTest } from "@/types/test";
import UserForm from "./UserForm";

// Type of operation for the modal
export type FormOperation = "create" | "update";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: TSafeTest) => void;
  operation: FormOperation;
  initialData?: TSafeTest;
}

export default function FormModal({
  isOpen,
  onClose,
  onSave,
  operation,
  initialData,
}: FormModalProps) {
  if (!isOpen) return null;

  // Set title based on operation
  const title = operation === "create" ? "Add New User" : "Update User";

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
          <h3 className="text-lg sm:text-xl font-bold text-black">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl"
          >
            ✕
          </button>
        </div>

        <div className="bg-white rounded-md px-4 sm:px-6 pb-4">
          <UserForm
            initialData={initialData}
            onSave={onSave}
            onCancel={onClose}
            mode={operation}
          />
        </div>
      </div>
    </div>
  );
}

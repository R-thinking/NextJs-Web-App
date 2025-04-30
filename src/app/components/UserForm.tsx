"use client";

import { useState } from "react";
import { TSafeTest } from "@/types/test";

interface UserFormProps {
  initialData?: TSafeTest;
  onSave: (user: TSafeTest) => void;
  onCancel: () => void;
}

export default function UserForm({
  initialData,
  onSave,
  onCancel,
}: UserFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [age, setAge] = useState<number | null>(initialData?.age || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || "",
      name,
      phone,
      age,
      created_at: initialData?.created_at || new Date(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-black">Name</label>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-600 placeholder:font-medium text-black font-medium"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-black">Phone</label>
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone || ""}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-600 placeholder:font-medium text-black font-medium"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-black">Age</label>
        <input
          type="number"
          placeholder="Enter age"
          value={age === null ? "" : age}
          onChange={(e) =>
            setAge(e.target.value ? Number(e.target.value) : null)
          }
          className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-600 placeholder:font-medium text-black font-medium"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 font-medium rounded-md border border-gray-400 bg-white text-black shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 font-semibold rounded-md bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save
        </button>
      </div>
    </form>
  );
}

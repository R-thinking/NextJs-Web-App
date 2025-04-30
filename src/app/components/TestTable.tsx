"use client";

import { useState, useMemo, useEffect } from "react";
import { TSafeTest, TServerData } from "@/types/test";
import UserForm from "./UserForm";
import ClientDate from "./ClientDate";

export default function TestTable({ initialTests }: TServerData) {
  const [tests, setTests] = useState<TSafeTest[]>(JSON.parse(initialTests));
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/tests?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update local state after successful deletion
        setTests((prev) => prev.filter((test) => test.id !== id));
      } else {
        console.error("Failed to delete user");
        // You could add error handling UI here
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSave = async (user: TSafeTest) => {
    try {
      if (editingId) {
        // Update existing user
        const response = await fetch("/api/tests", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingId,
            name: user.name,
            phone: user.phone,
            age: user.age,
          }),
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setTests((prev) =>
            prev.map((test) => (test.id === editingId ? updatedUser : test))
          );
          setEditingId(null);
        } else {
          console.error("Failed to update user");
        }
      } else {
        // Create new user
        const response = await fetch("/api/tests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            phone: user.phone,
            age: user.age,
          }),
        });

        if (response.ok) {
          const newUser = await response.json();
          setTests((prev) => [...prev, newUser]);
          setIsCreating(false);
        } else {
          console.error("Failed to create user");
        }
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
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
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
          disabled={isCreating || editingId !== null}
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
          <h2 className="text-lg font-semibold mb-4">Add New User</h2>
          <UserForm onSave={handleSave} onCancel={handleCancel} />
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
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-black uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTests.map((test) =>
                editingId === test.id ? (
                  <tr key={test.id} className="bg-blue-50">
                    <td colSpan={5} className="px-6 py-4">
                      <UserForm
                        initialData={test}
                        onSave={handleSave}
                        onCancel={handleCancel}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-black">
                        {test.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                      {test.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                      {test.age !== null ? `${test.age}세` : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                      <ClientDate date={test.created_at.toString()} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingId(test.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(test.id)}
                        className="text-red-600 hover:text-red-900"
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

      <div className="px-6 py-4 bg-gray-100 backdrop-blur-sm bg-opacity-50 border-t text-gray-600 text-sm font-semibold">
        Showing {filteredTests.length} of {tests.length} users
      </div>
    </div>
  );
}

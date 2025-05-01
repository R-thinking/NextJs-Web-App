"use client";

import { TSafeTest } from "@/types/test";
import { useEffect, useState } from "react";
import TestTable from "../components/TestTable";
import Navigation from "../components/Navigation";

export default function CSRPage() {
  const [tests, setTests] = useState<TSafeTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tests")
      .then((res) => res.json())
      .then((data) => {
        setTests(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-6">
      <header className="mb-6 sm:mb-8 max-w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
          User Management System
        </h1>
        <p className="text-sm sm:text-base text-white font-medium mt-1 sm:mt-2 truncate">
          Manage your team members and their information (CSR)
        </p>
      </header>

      <Navigation />

      {loading ? (
        <div className="bg-white shadow rounded-lg p-6">
          <p>Loading...</p>
        </div>
      ) : (
        <TestTable initialTests={JSON.stringify(tests)} />
      )}
    </div>
  );
}

"use client";

import { TSafeTest } from "@/types/test";
import { useEffect, useState } from "react";

export default function CSRPage() {
  const [tests, setTests] = useState<TSafeTest[]>([]);

  useEffect(() => {
    fetch("/api/tests")
      .then((res) => res.json())
      .then((data) => setTests(data));
  }, []);

  return (
    <div>
      <h1>CSR Page</h1>
      <ul>
        {tests.map((test) => (
          <li key={test.id}>
            {test.name} - {test.phone} - {Number(test.age)}세
          </li>
        ))}
      </ul>
    </div>
  );
}

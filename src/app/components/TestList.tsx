"use client";

import { useMemo } from "react";
import { TSafeTest, TServerData } from "@/types/test";

export default function TestList({ tests }: TServerData) {
  const parsedTests: TSafeTest[] = useMemo(() => JSON.parse(tests), [tests]);

  return (
    <ul>
      {parsedTests.map((test) => (
        <li key={test.id}>
          {test.name} - {test.phone} - {test.age}세
        </li>
      ))}
    </ul>
  );
}

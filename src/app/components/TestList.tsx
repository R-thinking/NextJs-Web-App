"use client";

import { useMemo } from "react";
import { TSafeTest, TServerData } from "@/types/test";
import { styles } from "@/app/styles/classNames";

export default function TestList({ tests }: TServerData) {
  const parsedTests: TSafeTest[] = useMemo(() => JSON.parse(tests), [tests]);

  return (
    <ul className={`divide-y divide-gray-200 ${styles.card}`}>
      {parsedTests.map((test) => (
        <li key={test.id} className="p-4 hover:bg-gray-50">
          <div className={styles.tableCellText}>
            {test.name} - {test.phone} - {test.age}세
          </div>
        </li>
      ))}
    </ul>
  );
}

// app/page.tsx
import { prisma } from "@/lib/prisma";
import { TSafeTest } from "@/types/test";
import TestTable from "./components/TestTable";

export default async function TestList() {
  const tests = await prisma.test.findMany();
  const convertedTests = tests.map((test) => ({
    ...test,
    id: test.id.toString(), // ✅ convert BigInt → string
    age: test.age ? Number(test.age) : null, // ✅ Decimal → number
  }));

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          User Management System
        </h1>
        <p className="text-white font-medium mt-2">
          Manage your team members and their information
        </p>
      </header>

      <TestTable initialTests={JSON.stringify(convertedTests)} />
    </div>
  );
}

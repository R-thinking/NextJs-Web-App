import { prisma } from "@/lib/prisma";
import { TSafeTest } from "@/types/test";
import TestTable from "../components/TestTable";
import Navigation from "../components/Navigation";

export const dynamic = "force-static"; // 👈 Enables SSG

export default async function SSGPage() {
  const tests = await prisma.test.findMany();
  const convertedTests = tests.map((test) => ({
    ...test,
    id: test.id.toString(), // ✅ convert BigInt → string
    age: test.age ? Number(test.age) : null, // ✅ Decimal → number
  }));

  return (
    <div className="container mx-auto p-6">
      <header className="mb-6 sm:mb-8 max-w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
          User Management System
        </h1>
        <p className="text-sm sm:text-base text-white font-medium mt-1 sm:mt-2 truncate">
          Manage your team members and their information (SSG)
        </p>
      </header>

      <Navigation />

      <TestTable initialTests={JSON.stringify(convertedTests)} />
    </div>
  );
}

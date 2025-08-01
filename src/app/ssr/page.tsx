import { prisma } from "@/lib/prisma";
import { TSafeTest } from "@/types/test";
import TestTable from "../components/TestTable";
import Navigation from "../components/Navigation";

// Force dynamic rendering and disable caching for always fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function SSRPage() {
  // Add headers to prevent caching at multiple levels
  const headers = new Headers();
  headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');

  // Fetch latest data with no caching
  const tests = await prisma.test.findMany({
    orderBy: {
      created_at: 'desc' // Always get newest first
    }
  });
  
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
          Manage your team members and their information (SSR)
        </p>
      </header>

      <Navigation />

      <TestTable initialTests={JSON.stringify(convertedTests)} />
    </div>
  );
}

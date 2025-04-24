// app/test/page.tsx
import { prisma } from "@/lib/prisma";
import { TSafeTest } from "@/types/test";

export default async function TestList() {
  const tests = await prisma.test.findMany();
  const convertedTests = tests.map((test) => ({
    ...test,
    id: test.id.toString(), // ✅ convert BigInt → string
    age: test.age ? Number(test.age) : null, // ✅ Decimal → number
  }));
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Test Table Data</h1>
      <ul className="space-y-2">
        {convertedTests.map((row: TSafeTest) => (
          <li key={row.id} className="border p-2 rounded">
            <strong>{row.name}</strong>
            <br />
            📞 {row.phone}
            <br />
            🎂 {row.age}세
          </li>
        ))}
      </ul>
    </div>
  );
}

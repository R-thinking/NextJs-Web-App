import { getAllTests } from "@/lib/testService";
import TestList from "../components/TestList";

export const dynamic = "force-static"; // 👈 Enables SSG

export default async function SSGPage() {
  const tests = await getAllTests();
  const safeTests = tests.map((test) => ({
    ...test,
    id: test.id.toString(), // ✅ convert BigInt → string
    age: test.age ? Number(test.age) : null, // ✅ Decimal → number
  }));
  return (
    <div>
      <h1>SSG Page</h1>
      <TestList tests={JSON.stringify(safeTests)} />
    </div>
  );
}

import { getAllTests } from "@/lib/testService";
import TestList from "../components/TestList";

export const revalidate = 60; // 👈 ISR: revalidate every 60 seconds

export default async function ISRPage() {
  const tests = await getAllTests();
  const safeTests = tests.map((test) => ({
    ...test,
    id: test.id.toString(), // ✅ convert BigInt → string
    age: test.age ? Number(test.age) : null, // ✅ Decimal → number
  }));
  return (
    <div>
      <h1>ISR Page (every 60s)</h1>
      <TestList tests={JSON.stringify(safeTests)} />
    </div>
  );
}

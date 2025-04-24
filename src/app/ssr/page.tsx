import { getAllTests } from "@/lib/testService";
import TestList from "@/app/components/TestList";

export default async function SSRPage() {
  const tests = await getAllTests();
  const safeTests = tests.map((test) => ({
    ...test,
    id: test.id.toString(), // ✅ convert BigInt → string
    age: test.age ? Number(test.age) : null, // ✅ Decimal → number
  }));

  return (
    <div>
      <h1>SSR Page</h1>
      <TestList tests={JSON.stringify(safeTests)} />
    </div>
  );
}

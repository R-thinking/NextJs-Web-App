import { NextResponse } from "next/server";
import { getAllTests } from "@/lib/testService";

export async function GET() {
  const tests = await getAllTests();
  const safeTests = tests.map((test) => ({
    ...test,
    id: test.id.toString(), // ✅ convert BigInt → string
    age: test.age ? Number(test.age) : null, // ✅ Decimal → number
  }));
  return NextResponse.json(safeTests);
}

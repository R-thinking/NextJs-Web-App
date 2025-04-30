import { NextResponse } from "next/server";
import {
  getAllTests,
  createTest,
  updateTest,
  deleteTest,
} from "@/lib/testService";

export async function GET() {
  const tests = await getAllTests();
  const safeTests = tests.map((test) => ({
    ...test,
    id: test.id.toString(), // ✅ convert BigInt → string
    age: test.age ? Number(test.age) : null, // ✅ Decimal → number
  }));
  return NextResponse.json(safeTests);
}

export async function POST(request: Request) {
  const body = await request.json();
  const test = await createTest(body);
  return NextResponse.json({
    ...test,
    id: test.id.toString(),
    age: test.age ? Number(test.age) : null,
  });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...data } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const test = await updateTest(id, data);
    return NextResponse.json({
      ...test,
      id: test.id.toString(),
      age: test.age ? Number(test.age) : null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update record" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await deleteTest(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete record" },
      { status: 500 }
    );
  }
}

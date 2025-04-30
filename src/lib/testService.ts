import { prisma } from "./prisma";
import { TSafeTest } from "@/types/test";
import { Decimal } from "@prisma/client/runtime/library";

export async function getAllTests() {
  return await prisma.test.findMany();
}

export async function getTestById(id: string) {
  return await prisma.test.findUnique({
    where: { id: BigInt(id) },
  });
}

export async function createTest(data: Omit<TSafeTest, "id" | "created_at">) {
  return await prisma.test.create({
    data: {
      name: data.name || "",
      phone: data.phone || "",
      age: data.age !== null ? new Decimal(data.age) : null,
    },
  });
}

export async function updateTest(
  id: string,
  data: Partial<Omit<TSafeTest, "id" | "created_at">>
) {
  return await prisma.test.update({
    where: { id: BigInt(id) },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.age !== undefined && {
        age: data.age !== null ? new Decimal(data.age) : null,
      }),
    },
  });
}

export async function deleteTest(id: string) {
  return await prisma.test.delete({
    where: { id: BigInt(id) },
  });
}

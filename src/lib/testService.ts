import { prisma } from "./prisma";

export async function getAllTests() {
  return await prisma.test.findMany();
}

import { Test } from "@/generated/prisma";

export type TSafeTest = Omit<Test, "age" | "id"> & {
  id: string; // BigInt → string
  age: number | null; // Decimal → number
};

export type TServerData = Record<string, string>;

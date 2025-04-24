// prisma.config.ts
import { defineConfig } from "prisma/config";
import path from "node:path";

export default defineConfig({
  earlyAccess: true,
  schema: path.join("src", "prisma", "schema.prisma"),
});

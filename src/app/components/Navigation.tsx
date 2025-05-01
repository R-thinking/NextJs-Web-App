"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname() || "";

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const linkStyle = (path: string) => {
    return isActive(path)
      ? "px-3 py-1.5 bg-blue-700 text-white text-sm rounded font-bold"
      : "px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600";
  };

  return (
    <div className="mb-6">
      <p className="text-white font-medium mb-2">Rendering Methods:</p>
      <div className="flex flex-wrap gap-2">
        <Link href="/" className={linkStyle("/")}>
          Home
        </Link>
        <Link href="/csr" className={linkStyle("/csr")}>
          CSR
        </Link>
        <Link href="/ssr" className={linkStyle("/ssr")}>
          SSR
        </Link>
        <Link href="/ssg" className={linkStyle("/ssg")}>
          SSG
        </Link>
        <Link href="/isr" className={linkStyle("/isr")}>
          ISR
        </Link>
      </div>
    </div>
  );
}

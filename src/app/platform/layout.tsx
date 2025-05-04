// app/platform/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getToken } from "@/lib/auth";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // If there's no JWT, bounce back to login
    if (!getToken()) {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

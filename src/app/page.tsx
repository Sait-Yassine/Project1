"use client";

import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (getToken()) {
      router.replace("/platform");
    }
  }, [router]);

  return (
    <>
      <Navbar />
      <main className="p-6">
        <h1>Hello</h1>
      </main>
    </>
  );
}

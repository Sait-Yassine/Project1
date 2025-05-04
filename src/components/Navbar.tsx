// src/components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/LoginModal";
import { getToken } from "@/lib/auth";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("brilliant_token");
    localStorage.removeItem("brilliant_user");
    setLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 border-b bg-white">
      {/* Brand */}
      <div className="text-2xl font-bold">Brilliant</div>

      {/* Right-side nav */}
      <div className="flex space-x-4">
        {loggedIn ? (
          <>
            <Link
              href="/platform/dashboard"
              className="text-gray-700 hover:text-black font-medium px-4 py-2"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 py-2 rounded-full"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <LoginModal />
            <Link
              href="/register"
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-5 py-2 rounded-full"
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

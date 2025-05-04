"use client";

import { useState, useEffect, useRef } from "react";
import { Home, CheckSquare, Key, Zap, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("brilliant_token");
    localStorage.removeItem("brilliant_user");
    router.replace("/");
  };

  return (
    <nav className="w-full flex justify-between items-center px-6 py-3 border-b bg-white">
      {/* Left */}
      <div className="flex items-center space-x-8">
        <span className="text-2xl font-bold">Brilliant</span>
        <Link
          href="/platform"
          className={`nav-item nav-pop${pathname === "/platform" ? " active" : ""}`}
        >
          <Home size={18} />
          <span>Home</span>
        </Link>
        <Link
          href="/platform/courses"
          className={`nav-item nav-pop${pathname === "/platform/courses" ? " active" : ""}`}
        >
          <CheckSquare size={18} />
          <span>Courses</span>
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center space-x-4">
        <button className="border border-green-600 text-green-600 px-4 py-1 rounded-full font-semibold hover:bg-green-50 transition">
          Go Premium
        </button>

        <button className="p-2 rounded-full bg-white border hover:shadow">
          <Key size={18} className="text-yellow-500" />
        </button>

        <button className="p-2 rounded-full bg-white border hover:shadow flex items-center">
          <span className="text-black font-bold text-sm">0</span>
          <Zap size={16} className="ml-1 text-gray-400" />
        </button>

        {/* Hamburger + dropdown */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setIsMenuOpen((o) => !o)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <Menu size={20} />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <Link
                href="/account"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Account
              </Link>
              <Link
                href="/help"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Help
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

"use client";

import { Home, CheckSquare, Key, Zap, Menu } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center px-6 py-3 border-b bg-white">
      {/* Left Section */}
      <div className="flex items-center space-x-8">
        <span className="text-2xl font-bold">Brilliant</span>

        <Link href="/" className="flex items-center space-x-1 text-gray-700 hover:text-black font-medium">
          <Home size={18} />
          <span>Home</span>
        </Link>

        <Link href="/courses" className="flex items-center space-x-1 text-gray-700 hover:text-black font-medium">
          <CheckSquare size={18} />
          <span>Courses</span>
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <button className="border border-green-600 text-green-600 px-4 py-1 rounded-full font-semibold hover:bg-green-50 transition">
          Go Premium
        </button>

        <button className="p-2 rounded-full bg-white border hover:shadow">
          <Key size={18} className="text-yellow-500" />
        </button>

        <button className="p-2 rounded-full bg-white border hover:shadow">
          <span className="text-black font-bold text-sm">0</span>
          <Zap size={16} className="inline-block ml-1 text-gray-400" />
        </button>

        <button className="p-2 rounded-full hover:bg-gray-100 transition">
          <Menu size={20} />
        </button>
      </div>
    </nav>
  );
}

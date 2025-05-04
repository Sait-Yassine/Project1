// src/components/LoginModal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";
import Link from "next/link";

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { token, email, roles } = await loginUser(form);
      // store the token and optionally user info
      localStorage.setItem("brilliant_token", token);
      localStorage.setItem(
        "brilliant_user",
        JSON.stringify({ email, roles })
      );
      // redirect to dashboard
      router.push("/platform");
    } catch {
      setError("Invalid email/password combination");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="border border-gray-300 rounded-full px-5 py-2 text-sm font-medium text-black hover:bg-gray-100"
      >
        Log in
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-center text-2xl font-bold mb-6">Log in</h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                value={form.password}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="bg-black text-white rounded-full py-2 font-medium"
              >
                Log in
              </button>
            </form>

            <div className="flex justify-between text-sm mt-4">
              <Link href="#" className="text-blue-600 underline">
                Reset password
              </Link>
              <div>
                New user?{" "}
                <Link href="/register" className="text-blue-600 underline">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

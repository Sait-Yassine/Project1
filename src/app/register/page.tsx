"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const success = await registerUser({
        email: form.email,
        password: form.password,
      });

      if (success) {
        router.push("/platform");
        return;
      }

      setError("Email already registered");
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
        <h2 className="text-center text-2xl font-bold mb-6">
          Create your account
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            name="confirm"
            type="password"
            placeholder="Confirm password"
            required
            value={form.confirm}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-black text-white rounded-full py-2 font-medium"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}

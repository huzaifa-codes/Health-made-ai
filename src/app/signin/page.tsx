"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post("/api/auth/signin", formData);
      setMessage(data.message || "Sign in successful");
      if (data) router.push("/");
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      if (error.response?.data) {
        setMessage(error.response.data.error || "Invalid email or password");
      } else {
        setMessage("Network error");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4">
      <div className="bg-white p-8 rounded-2xl border border-purple-100 w-full max-w-md shadow-sm">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-700 tracking-tight">
          Health Mate
        </h2>

        {message && (
          <p
            className={`text-center mb-4 text-sm ${
              message.includes("successful")
                ? "text-purple-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-600 font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-200 px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-200 px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-md font-medium mt-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-purple-700 hover:text-purple-800 font-medium underline underline-offset-2"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";

interface SignupForm {
  fullName: string;
  userName: string;
  email: string;
  password: string;
}

const SignupPage = () => {
  const [formData, setFormData] = useState<SignupForm>({
    fullName: "",
    userName: "",
    email: "",
    password: "",
  });

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
      const { data } = await axios.post("/api/auth/signup", formData);
      setMessage(data.message || "Account created successfully!");
      setFormData({
        fullName: "",
        userName: "",
        email: "",
        password: "",
      });
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      if (error.response?.data) {
        setMessage(error.response.data.error || "Something went wrong");
      } else {
        setMessage("Network error");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-purple-100">
        <h2 className="text-2xl font-semibold text-center mb-6 text-purple-700">
          Create Your Account
        </h2>

        {message && (
          <p
            className={`text-center mb-4 text-sm ${
              message.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. Muhammad Huzaifa"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Username</label>
            <input
              type="text"
              name="userName"
              placeholder="Choose a username"
              value={formData.userName}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-medium mt-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-purple-700 hover:text-purple-800 font-medium underline underline-offset-2"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

import React, { useState } from "react";

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "signup" && form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/signup";

      const body =
        mode === "login"
          ? { email: form.email, password: form.password }
          : {
              fullName: form.fullName,
              email: form.email,
              password: form.password,
            };

      // 🔹 Log outgoing payload
      console.log("📤 Sending request to:", endpoint);
      console.log("📦 Payload:", body);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // 🔹 Log raw response object
      console.log("📥 Raw response:", res);

      const data = await res.json();

      // 🔹 Log parsed JSON response
      console.log("✅ Parsed response JSON:", data);

      if (!res.ok) throw new Error(data.message || "Authentication failed");

      localStorage.setItem("token", data.token);
      console.log("🔑 Token stored in localStorage:", data.token);

      onAuth(); // notify App.jsx that user is authenticated
    } catch (err) {
      console.error("❌ Error during auth:", err);
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">
          {mode === "login" ? "Login" : "Sign Up"}
        </h2>

        {mode === "signup" && (
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 focus:outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 focus:outline-none"
        />

        {mode === "signup" && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
          />
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded font-semibold"
        >
          {mode === "login" ? "Login" : "Sign Up"}
        </button>

        <p className="text-center text-sm">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-blue-400 underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-blue-400 underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}

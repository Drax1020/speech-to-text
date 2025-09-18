
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const API_URL = `${API_BASE}/auth`;

// const API_URL = import.meta.env.VITE_API_BASE
//   ? `${import.meta.env.VITE_API_BASE}/auth`
//   : "http://localhost:5000/api/auth";

console.log("API_BASE:", API_BASE);
console.log("API_URL:", API_URL);


export const signup = async (userData) => {
   console.log("📤 Signup URL:", `${API_URL}/signup`);
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const login = async (userData) => {
   console.log("📤 Login URL:", `${API_URL}/login`);
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};

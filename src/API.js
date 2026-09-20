const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const request = async (path, options = {}) => {
  const token = localStorage.getItem("holland_token");
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data.message || "Ombi limeshindwa");
  return data;
};

// Test backend connection
export const testBackend = async () => {
  return request("/");
};

// Login user
export const loginUser = async (email, password) => {
  return request("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

// Register user
export const registerUser = async (
  full_name,
  email,
  password,
  role = "customer",
  phone = "",
  address = ""
) => {
  return request("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      full_name,
      email,
      password,
      role,
      phone,
      address,
    }),
  });
};

// Get all products
export const getProducts = async () => {
  return request("/api/products");
};

export const createProduct = (product) =>
  request("/api/products", { method: "POST", body: JSON.stringify(product) });

export const updateProduct = (id, product) =>
  request(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(product) });

export const deleteProduct = (id) =>
  request(`/api/products/${id}`, { method: "DELETE" });

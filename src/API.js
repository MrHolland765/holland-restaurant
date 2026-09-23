const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const request = async (path, options = {}) => {
  const token = localStorage.getItem("holland_token");

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...options.headers,
    },
    ...options,
  });

  const data =
    response.status === 204
      ? null
      : await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Ombi limeshindwa"
    );
  }

  return data;
};

export const testBackend = async () => {
  return request("/");
};

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

export const getProducts = async () => {
  return request("/api/products");
};

export const createProduct = (product) => {
  return request("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
};

export const updateProduct = (id, product) => {
  return request(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
};

export const deleteProduct = (id) => {
  return request(`/api/products/${id}`, {
    method: "DELETE",
  });
};

export const createDeliveryStaff = async (
  deliveryData
) => {
  return request("/api/delivery", {
    method: "POST",
    body: JSON.stringify(deliveryData),
  });
};

export const getDeliveryStaff = async () => {
  return request("/api/delivery");
};

export const deleteDeliveryStaff = async (id) => {
  return request(`/api/delivery/${id}`, {
    method: "DELETE",
  });
};
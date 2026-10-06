const API_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://holland-backend-icfe.onrender.com")
).replace(/\/+$/, "");

const request = async (path, options = {}) => {
  const token = sessionStorage.getItem("holland_token");

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

export const requestPasswordReset = (email) =>
  request("/api/password/forgot", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const resetPassword = (token, password) =>
  request("/api/password/reset", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });

export const saveProfileAvatar = (avatar) =>
  request("/api/profile/avatar", {
    method: "PUT",
    body: JSON.stringify({ avatar }),
  });

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

export const getOrders = () => request("/api/orders");

export const createOrder = (order) =>
  request("/api/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });

export const updateOrder = (id, changes) =>
  request(`/api/orders/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(changes),
  });

export const assignOrder = (id, staffId) =>
  request(`/api/orders/${encodeURIComponent(id)}/assign`, {
    method: "PUT",
    body: JSON.stringify({ staffId }),
  });

export const confirmOrderPayment = (id) =>
  request(`/api/orders/${encodeURIComponent(id)}/payment-confirmation`, {
    method: "PUT",
  });

export const rejectOrderPayment = (id) =>
  request(`/api/orders/${encodeURIComponent(id)}/payment-rejection`, {
    method: "PUT",
  });

export const deleteOrder = (id) =>
  request(`/api/orders/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

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

export const getCustomers = () => request("/api/customers");

export const deleteCustomer = (id) =>
  request(`/api/customers/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
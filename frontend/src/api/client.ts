import axios from "axios";

const client = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default client;
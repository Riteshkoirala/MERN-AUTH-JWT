import axios from "axios";

const BASE_URL = "http://localhost:4004/api/tasks"; // or your API base URL

export const getTasks = () => axios.get(BASE_URL, { withCredentials: true });
export const createTask = (data) => axios.post(BASE_URL, data, { withCredentials: true });
export const updateTask = (id, data) => axios.put(`${BASE_URL}/${id}`, data, { withCredentials: true });
export const deleteTask = (id) => axios.delete(`${BASE_URL}/${id}`, { withCredentials: true });

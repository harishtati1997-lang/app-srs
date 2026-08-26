import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE || (
  import.meta.env.DEV
    ? 'http://localhost:8000/api'
    : 'https://app-srs.onrender.com/api'
);

const api = axios.create({
  baseURL: BASE,
});

export default api;

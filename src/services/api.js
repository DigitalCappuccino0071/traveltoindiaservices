import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'https://visa-backend-v2.vercel.app/',
  baseURL: 'http://localhost:8090/',
  timeout: 30000,
});

export default axiosInstance;

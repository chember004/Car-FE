import axios from 'axios';
// import '@/drizzle/envConfig';

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL,
  withCredentials: true,
});

export default axiosInstance;

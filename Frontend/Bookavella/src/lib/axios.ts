import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5264',
  // Không set Content-Type mặc định ở đây
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Attach JWT token
    const token = localStorage.getItem('bookavella_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Chỉ set Content-Type: application/json cho POST, PUT, PATCH
    // GET và DELETE không được set Content-Type
    const methodsWithBody = ['post', 'put', 'patch'];
    if (config.method && methodsWithBody.includes(config.method.toLowerCase())) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error: unknown) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bookavella_token');
      localStorage.removeItem('bookavella_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
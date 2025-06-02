import axios, { type AxiosInstance } from 'axios';
import { useAppStore } from '@/stores/app';


const axiosInstance = axios.create({
    baseURL : 'http://localhost:5246/api/'
})
axiosInstance.interceptors.request.use((config) => {

    // localStorage.removeItem('pagination');


    const {token} = JSON.parse(localStorage.getItem("currentEmployeeContent") || "{}");

    if(token){
        config.headers = config.headers || {};

        config.headers.Authorization = `Bearer ${token}`
    }
    const store = useAppStore();

    store.setLoading(true);
    return config;
})

axiosInstance.interceptors.response.use((response) => {
  const paginationHeader = response.headers['pagination'];

  if (paginationHeader) {
    const pagination = JSON.parse(paginationHeader || '{}');

    localStorage.setItem('pagination', JSON.stringify(pagination));
  }

  return response;
});



export default axiosInstance;
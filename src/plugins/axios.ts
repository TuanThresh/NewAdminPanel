import axios from 'axios';
import { useAppStore } from '@/stores/app';


const axiosInstance = axios.create({
    baseURL : 'http://localhost:5246/api/'
})
axiosInstance.interceptors.request.use((config) => {


    const {token} = JSON.parse(localStorage.getItem("currentEmployeeContent") || "{}");

    if(token){
        config.headers = config.headers || {};

        config.headers.Authorization = `Bearer ${token}`
    }
    const store = useAppStore();

    store.setLoading(true);
    return config;
})



export default axiosInstance;
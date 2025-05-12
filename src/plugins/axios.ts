import axios from 'axios';

const axiosInstance = axios.create({
    baseURL : 'http://localhost:5246/api/'
})
axiosInstance.interceptors.request.use((config) => {
    const {token} = JSON.parse(localStorage.getItem("currentEmployeeContent") || "{}");

    if(token){
        config.headers = config.headers || {};

        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

export default axiosInstance;
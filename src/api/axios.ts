import axios from 'axios';

const api = axios.create({
    baseURL:"https://jnv-backend-okdc.onrender.com/api",

});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jnv_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
});

export default api;
    
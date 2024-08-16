import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from 'services/LocalStorage';
import { API_URL } from 'services/Config';

const token = getToken()
// const navigate = useNavigate();

const axiosInstance = axios.create({
    baseURL:API_URL
})

axiosInstance.interceptors.request.use(
    (config) => {
        console.log("COnfig", config)
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // if (error.response.status === 401){
        //     localStorage.clear();
        //     navigate('/login')
        // }
        if (error.response.status===500){
            console.log("Server Error")
        }
        return Promise.reject(error)
    }
)

export default axiosInstance;
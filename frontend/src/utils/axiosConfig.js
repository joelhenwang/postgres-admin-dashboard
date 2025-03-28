import axios from "axios";
import {store} from '../store';
import { resetAuthState } from "../features/authSlice";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if(token) {
            config.headers['x-access-token'] = token;
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
        if(error.response && (error.response.status === 401 || error.response.status === 403)) {
            store.dispatch(resetAuthState());

            if (window.location.pathname !== '/login') {
                sessionStorage.setItem('redirectPath', window.location.pathname);
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
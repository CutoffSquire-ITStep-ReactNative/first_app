import axios from "axios";
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from "./storage";

const BASE_URL = 'https://dummyjson.com/';

export const authApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

authApi.interceptors.request.use(async (config)=>{
    const token = await getAccessToken();
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

authApi.interceptors.response.use((response)=> response,
    async(error)=>{
        const originalRequest = error.config;
        if(!error.response){
            // Network error / timeout / no internet connection: nothing to refresh, just propagate.
            return Promise.reject(error);
        }
        if(error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            try {
                const refreshToken = await getRefreshToken();
                if(!refreshToken) throw new Error('Refresh token is missing');

                const {data} = await axios.post(BASE_URL+`auth/refresh`,{
                    refreshToken,
                    expireInMins: 30,
                });

                await saveTokens(data.accessToken, data.refreshToken);

                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return authApi(originalRequest);
            } catch (refreshError) {
                await clearTokens();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const PIN_CODE_KEY = 'auth_pin_code';

export const saveTokens = async(accessToken: string, refreshToken: string)=>{
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = async()=>{
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = async()=>{
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
};

export const clearTokens = async()=>{
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

// --- PIN code (app lock) ---

export const savePinCode = async(pin: string)=>{
    await SecureStore.setItemAsync(PIN_CODE_KEY, pin);
};

export const getPinCode = async()=>{
    return await SecureStore.getItemAsync(PIN_CODE_KEY);
};

export const clearPinCode = async()=>{
    await SecureStore.deleteItemAsync(PIN_CODE_KEY);
};
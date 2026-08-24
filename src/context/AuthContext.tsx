import { authApi } from "@/lib/auth-api";
import {
    clearPinCode,
    clearTokens,
    getAccessToken,
    getPinCode,
    savePinCode,
    saveTokens,
} from "@/lib/storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextType {
    token: string | null;
    isLoading: boolean;
    // Whether a PIN has ever been configured for this account on this device.
    hasPin: boolean;
    // Whether the app is currently locked behind the PIN screen.
    // Only meaningful once hasPin is true.
    isLocked: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setupPin: (pin: string) => Promise<void>;
    unlock: (pin: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasPin, setHasPin] = useState(false);
    const [isLocked, setIsLocked] = useState(true);

    // On cold start: restore the token and figure out whether the app
    // should come up locked behind the PIN screen.
    useEffect(() => {
        (async () => {
            try {
                const [storedToken, storedPin] = await Promise.all([
                    getAccessToken(),
                    getPinCode(),
                ]);
                setToken(storedToken);
                setHasPin(!!storedPin);
                // Only lock if there's both a session AND an existing PIN to
                // check it against. If the user is mid-login (token but no
                // PIN yet), there's nothing to unlock - they need to set one up.
                setIsLocked(!!storedToken && !!storedPin);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const login = async (username: string, password: string) => {
        const { data } = await authApi.post('/auth/login', {
            username,
            password,
            expiresInMins: 30,
        });
        await saveTokens(data.accessToken, data.refreshToken);
        setToken(data.accessToken);
        // A fresh login always starts the "create your PIN" flow, whether or
        // not a PIN existed before (e.g. after a previous logout).
        setHasPin(false);
        setIsLocked(false);
    };

    const logout = async () => {
        await clearTokens();
        await clearPinCode();
        setToken(null);
        setHasPin(false);
        setIsLocked(true);
    };

    const setupPin = async (pin: string) => {
        await savePinCode(pin);
        setHasPin(true);
        setIsLocked(false);
    };

    const unlock = async (pin: string) => {
        const storedPin = await getPinCode();
        if (storedPin && storedPin === pin) {
            setIsLocked(false);
            return true;
        }
        return false;
    };

    return (
        <AuthContext.Provider
            value={{ token, isLoading, hasPin, isLocked, login, logout, setupPin, unlock }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
import { ActivityIndicator, View } from "react-native";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const InitialLayout = ()=>{
    const { token, isLoading, hasPin, isLocked } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(()=>{
        if (isLoading) return;

        const inAuthGroup = segments[0] === "(auth)";

        if (!token) {
            // No session at all: send to login unless already there.
            if (!inAuthGroup) router.replace("/(auth)/login");
            return;
        }

        if (!hasPin) {
            // Just logged in and never configured a PIN on this device yet.
            router.replace("/(auth)/create-pin");
            return;
        }

        if (isLocked) {
            // App re-opened with a valid token: require the PIN before
            // exposing any app functionality.
            router.replace("/(auth)/unlock");
            return;
        }

        // Token valid, PIN configured, and unlocked: don't leave the user
        // sitting on an auth screen.
        if (inAuthGroup) {
            router.replace("/(tabs)/profile");
        }
    }, [token, isLoading, hasPin, isLocked, segments]);

        if (isLoading) {
            return (
                <View style={{
                    flex:1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <ActivityIndicator size={"large"} color="#6e0e36" />
                </View>
            )
        }
       return <Slot/>;
}

const RootLayout = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <AuthProvider>
                    <InitialLayout/>
                </AuthProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    )
}

export default RootLayout;
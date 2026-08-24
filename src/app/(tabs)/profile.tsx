import Header from "@/components/header";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/auth-api";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";

interface UserData {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

const ProfileScreen = () => {
    const { logout } = useAuth();
    const [userData, setUserData] = useState<UserData>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authApi.get('/auth/me')
            .then((res) => setUserData(res.data))
            .catch((err) => console.error("Get user profile failed: ", err))
            .finally(() => setLoading(false))
    }, [])
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <Header text="Contacts" />
            <Text style={styles.welcome}>Welcome!</Text>
            {userData && (
                <View style={styles.profileCard}>
                    <Text style={styles.info}>Name: {userData.firstName} {userData.lastName}</Text>
                    <Text style={styles.info}>Email: {userData.email}</Text>
                </View>
            )}
            <Button title="Logout" onPress={logout} color="#6e0e36" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    welcome: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    profileCard: { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8, marginBottom: 20, width: '100%' },
    info: { fontSize: 16, marginBottom: 5 },
});

export default ProfileScreen;
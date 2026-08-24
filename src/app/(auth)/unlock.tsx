import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const PIN_LENGTH = 4;

const UnlockScreen = () => {
    const { unlock, logout } = useAuth();
    const [pin, setPin] = useState('');
    const [checking, setChecking] = useState(false);

    const handleUnlock = async () => {
        if (pin.length !== PIN_LENGTH) return;
        setChecking(true);
        try {
            const ok = await unlock(pin);
            if (!ok) {
                Alert.alert('Wrong PIN', 'Please try again.');
                setPin('');
            }
        } finally {
            setChecking(false);
        }
    };

    const handleForgotPin = () => {
        Alert.alert(
            'Forgot your PIN?',
            "You'll need to log in again to reset it.",
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log out', style: 'destructive', onPress: () => logout() },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter your PIN</Text>
            <Text style={styles.subtitle}>Unlock the app to continue.</Text>

            <TextInput
                placeholder="PIN"
                value={pin}
                onChangeText={(value: string) => {
                    setPin(value);
                    if (value.length === PIN_LENGTH) {
                        // Auto-submit once the last digit is entered.
                        setTimeout(handleUnlock, 0);
                    }
                }}
                style={styles.input}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={PIN_LENGTH}
                autoFocus
            />

            <TouchableOpacity style={styles.button} onPress={handleUnlock} disabled={checking}>
                {checking ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Unlock</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkButton} onPress={handleForgotPin}>
                <Text style={styles.linkText}>Forgot PIN?</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        textAlign: 'center',
        fontSize: 20,
        letterSpacing: 8
    },
    button: {
        backgroundColor: '#6e0e36',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center'
    },
    buttonText: {
        color: "#fff",
        fontWeight: 'bold'
    },
    linkButton: {
        marginTop: 16,
        alignItems: 'center'
    },
    linkText: {
        color: '#6e0e36',
        fontWeight: '600'
    }
})

export default UnlockScreen;
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const PIN_LENGTH = 4;

const CreatePinScreen = () => {
    const { setupPin } = useAuth();
    const [step, setStep] = useState<'enter' | 'confirm'>('enter');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [saving, setSaving] = useState(false);

    const handleContinue = () => {
        if (pin.length !== PIN_LENGTH) {
            Alert.alert('Invalid PIN', `PIN must be ${PIN_LENGTH} digits`);
            return;
        }
        setStep('confirm');
    };

    const handleConfirm = async () => {
        if (confirmPin.length !== PIN_LENGTH) {
            Alert.alert('Invalid PIN', `PIN must be ${PIN_LENGTH} digits`);
            return;
        }
        if (confirmPin !== pin) {
            Alert.alert('PIN mismatch', 'The codes do not match. Try again.');
            setPin('');
            setConfirmPin('');
            setStep('enter');
            return;
        }
        setSaving(true);
        try {
            await setupPin(pin);
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        setConfirmPin('');
        setStep('enter');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {step === 'enter' ? 'Create a PIN' : 'Confirm your PIN'}
            </Text>
            <Text style={styles.subtitle}>
                {step === 'enter'
                    ? "You'll use this PIN to unlock the app next time you open it."
                    : 'Enter the same PIN again to confirm.'}
            </Text>

            {step === 'enter' ? (
                <TextInput
                    key="enter"
                    placeholder="Enter PIN"
                    value={pin}
                    onChangeText={setPin}
                    style={styles.input}
                    keyboardType="number-pad"
                    secureTextEntry
                    maxLength={PIN_LENGTH}
                    autoFocus
                />
            ) : (
                <TextInput
                    key="confirm"
                    placeholder="Confirm PIN"
                    value={confirmPin}
                    onChangeText={setConfirmPin}
                    style={styles.input}
                    keyboardType="number-pad"
                    secureTextEntry
                    maxLength={PIN_LENGTH}
                    autoFocus
                />
            )}

            <TouchableOpacity
                style={styles.button}
                onPress={step === 'enter' ? handleContinue : handleConfirm}
                disabled={saving}
            >
                {saving ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>
                        {step === 'enter' ? 'Continue' : 'Confirm'}
                    </Text>
                )}
            </TouchableOpacity>

            {step === 'confirm' && (
                <TouchableOpacity style={styles.linkButton} onPress={handleBack}>
                    <Text style={styles.linkText}>Back</Text>
                </TouchableOpacity>
            )}
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

export default CreatePinScreen;
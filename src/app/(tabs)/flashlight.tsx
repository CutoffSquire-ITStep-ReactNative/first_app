import Header from "@/components/header";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

function FlashlightToggle() {
    const [permission, requestPermission] = useCameraPermissions();
    const [torchOn, setTorchOn] = useState(false);
    const cameraRef = useRef(null);

    useEffect(() => {
        if (!permission) return;
        if (!permission.granted) {
            requestPermission();
        }
    }, [permission]);

    const toggleTorch = () => {
        if (!permission?.granted) {
            Alert.alert(
                'There is no access to the camera'
            );
            return;
        }
        setTorchOn((prev) => !prev);
    };

    if (!permission) {
        return (
            <View style={styles.container}>
                <Header text="Flashlight" />
                <View style={styles.content}>

                    <Text style={styles.buttonText}>loading...</Text>

                </View>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Header text="Flashlight" />
                <View style={styles.content}>

                    <TouchableOpacity style={[styles.button, styles.buttonDisabled]} onPress={requestPermission}>
                        <Text style={styles.buttonText}>Give Permission</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header text="Flashlight" />

            <CameraView
                ref={cameraRef}
                style={styles.hiddenCamera}
                facing="back"
                enableTorch={torchOn}
            />

            <View style={styles.content}>

                <TouchableOpacity
                    style={[styles.button, torchOn && styles.buttonActive]}
                    onPress={toggleTorch}
                >
                    <Text style={[styles.buttonText, torchOn && styles.buttonTextActive]}>
                        {torchOn ? 'turn off' : 'turn on'}
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hiddenCamera: {
        width: 1,
        height: 1,
        opacity: 0,
    },
    status: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#131783',
        width: 200,
        height: 200,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 0 50px rgb(19, 23, 131, 1)',
        color: '#fff',
    },
    buttonDisabled: {
        backgroundColor: '#ff4040',
        boxShadow: '0 0 30px rgb(255, 64, 64, 1)',
    },
    buttonActive: {
        backgroundColor: '#ffffff',
        boxShadow: '0 0 50px rgba(255, 255, 255, 1)',
        color: '#4a4a4a',
    },
    buttonText: {
        textTransform: 'uppercase',
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonTextActive: {
        color: '#4a4a4a',
    },
});

export default FlashlightToggle;
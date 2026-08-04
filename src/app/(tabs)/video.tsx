import { useAudioPlayer } from 'expo-audio';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

const VIDEO_SOURCE = require('@/assets/videos/thedog.mp4');
const SUCCESS_SOUND = require('@/assets/sounds/success.mp3');

const LOADING_DURATION = 500;

export default function VideoScreen() {
    const [stage, setStage] = useState('idle');
    const progress = useRef(new Animated.Value(0)).current;

    const player = useVideoPlayer(VIDEO_SOURCE, (p) => {
        p.loop = false;
    });

    const successSound = useAudioPlayer(SUCCESS_SOUND);

    const startLoading = () => {
        setStage('loading');
        progress.setValue(0);

        Animated.timing(progress, {
            toValue: 1,
            duration: LOADING_DURATION,
            useNativeDriver: false,
        }).start(() => {
            successSound.seekTo(0);
            successSound.play();
            setStage('video');
            player.play();
        });
    };

    const barWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            {stage === 'idle' && (
                <Pressable style={styles.button} onPress={startLoading}>
                    <Text style={styles.buttonText}>Download Video</Text>
                </Pressable>
            )}

            {stage === 'loading' && (
                <View style={styles.progressWrapper}>
                    <View style={styles.progressTrack}>
                        <Animated.View style={[styles.progressFill, { width: barWidth }]} />
                    </View>
                    <Text style={styles.progressLabel}>Downloading...</Text>
                </View>
            )}

            {stage === 'video' && (
                <VideoView
                    style={styles.video}
                    player={player}
                    nativeControls
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 28,
        backgroundColor: '#492b95',
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    progressWrapper: {
        width: '80%',
        alignItems: 'center',
    },
    progressTrack: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        backgroundColor: '#c0bfbf',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#492b95',
    },
    progressLabel: {
        marginTop: 10,
        color: '#c0bfbf',
    },
    video: {
        width: '100%',
        height: 250,
    },
});
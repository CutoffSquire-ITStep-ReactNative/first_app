import Header from "@/components/header";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    ListRenderItemInfo,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Contact {
    id: string;
    name: string;
    phone: string;
    photoUri: string | null;
}

const STORAGE_KEY = '@contacts_list';
const photosDirectory = new Directory(Paths.document, 'contact_photos');

const ensurePhotosDirExists = (): void => {
    if (!photosDirectory.exists) {
        photosDirectory.create({ intermediates: true });
    }
};

const savePhotoPermanently = async (tempUri: string): Promise<string> => {
    ensurePhotosDirExists();

    const sourceFile = new File(tempUri);
    const filename = `${Date.now()}_${sourceFile.name}`;
    const destinationFile = new File(photosDirectory, filename);

    sourceFile.copy(destinationFile);

    return destinationFile.uri;
};

const deletePhotoFile = async (uri: string | null): Promise<void> => {
    if (!uri) return;
    try {
        const file = new File(uri);
        if (file.exists) {
            file.delete();
        }
    } catch (e) {
        console.warn(e);
    }
};

export default function Contacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async (): Promise<void> => {
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            if (json) {
                setContacts(JSON.parse(json) as Contact[]);
            }
        } catch (e) {
            console.warn(e);
        } finally {
            setLoading(false);
        }
    };

    const persistContacts = async (list: Contact[]): Promise<void> => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        } catch (e) {
            console.warn(e);
        }
    };

    const pickImage = async (): Promise<void> => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('No access', 'Gallery access is required to add a contact photo.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const takePhoto = async (): Promise<void> => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('No access', 'Camera access is required.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const handleAddContact = async (): Promise<void> => {
        if (!name.trim() || !phone.trim()) {
            Alert.alert('Error', 'Please fill in name and phone');
            return;
        }

        setSaving(true);
        try {
            let permanentPhotoUri: string | null = null;

            if (photoUri) {
                permanentPhotoUri = await savePhotoPermanently(photoUri);
            }

            const newContact: Contact = {
                id: Date.now().toString(),
                name: name.trim(),
                phone: phone.trim(),
                photoUri: permanentPhotoUri,
            };

            const updatedList = [newContact, ...contacts];
            setContacts(updatedList);
            await persistContacts(updatedList);

            setName('');
            setPhone('');
            setPhotoUri(null);
        } catch (e) {
            Alert.alert('Error', 'Failed to save contact');
            console.warn(e);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteContact = (id: string): void => {
        Alert.alert('Delete contact', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    const contact = contacts.find((c) => c.id === id);
                    if (contact?.photoUri) {
                        await deletePhotoFile(contact.photoUri);
                    }

                    const updatedList = contacts.filter((c) => c.id !== id);
                    setContacts(updatedList);
                    await persistContacts(updatedList);
                },
            },
        ]);
    };

    const renderContact = useCallback(
        ({ item }: ListRenderItemInfo<Contact>) => (
            <View style={styles.card}>
                {item.photoUri ? (
                    <Image source={{ uri: item.photoUri }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarInitial}>
                            {item.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}

                <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardPhone}>{item.phone}</Text>
                </View>

                <TouchableOpacity
                    onPress={() => handleDeleteContact(item.id)}
                    style={styles.deleteButton}
                >
                    <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
            </View>
        ),
        [contacts]
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Header text="Contacts" />
                <ActivityIndicator size="large" color="#7C3AED" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header text="Contacts" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <View style={styles.form}>
                    <TouchableOpacity onPress={pickImage} style={styles.photoPicker}>
                        {photoUri ? (
                            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                        ) : (
                            <View style={styles.photoPlaceholder}>
                                <Text style={styles.photoPlaceholderText}>+</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <View style={styles.photoButtonsRow}>
                        <TouchableOpacity style={styles.smallButton} onPress={takePhoto}>
                            <Text style={styles.smallButtonText}>Camera</Text>
                        </TouchableOpacity>
                        {photoUri && (
                            <TouchableOpacity
                                style={[styles.smallButton, styles.smallButtonDanger]}
                                onPress={() => setPhotoUri(null)}
                            >
                                <Text style={styles.smallButtonTextDanger}>Remove</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        placeholderTextColor="#A78BFA"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone"
                        placeholderTextColor="#A78BFA"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddContact}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.addButtonText}>Add contact</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={contacts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderContact}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No contacts yet</Text>
                    }
                />
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F3FF' },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F3FF',
    },
    form: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#EDE9FE',
    },
    photoPicker: { alignSelf: 'center', marginBottom: 10 },
    photoPreview: { width: 84, height: 84, borderRadius: 42 },
    photoPlaceholder: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: '#EDE9FE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoPlaceholderText: { color: '#7C3AED', fontWeight: '700', fontSize: 28 },
    photoButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 12,
        gap: 8,
    },
    smallButton: {
        backgroundColor: '#EDE9FE',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 999,
    },
    smallButtonDanger: { backgroundColor: '#F3E8FF' },
    smallButtonText: { color: '#7C3AED', fontSize: 13, fontWeight: '600' },
    smallButtonTextDanger: { color: '#9333EA', fontSize: 13, fontWeight: '600' },
    input: {
        backgroundColor: '#FAF5FF',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 10,
        fontSize: 15,
        color: '#4C1D95',
    },
    addButton: {
        backgroundColor: '#7C3AED',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 4,
    },
    addButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    list: { paddingHorizontal: 16, paddingBottom: 24 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#EDE9FE',
    },
    avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
    avatarPlaceholder: {
        backgroundColor: '#7C3AED',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitial: { color: '#fff', fontSize: 18, fontWeight: '700' },
    cardInfo: { flex: 1 },
    cardName: { fontSize: 16, fontWeight: '600', color: '#4C1D95' },
    cardPhone: { fontSize: 14, color: '#8B5CF6', marginTop: 2 },
    deleteButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#F3E8FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: { color: '#9333EA', fontWeight: '700' },
    emptyText: {
        textAlign: 'center',
        color: '#A78BFA',
        marginTop: 40,
        fontSize: 15,
    },
});
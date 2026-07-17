import { Picker } from '@react-native-picker/picker';
import { useEffect, useMemo, useState } from "react";
import {
    Image,
    Pressable,
    SectionList,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    View
} from "react-native";

interface CharacterClass {
    id: string;
    title: string;
}

interface CharacterImage {
    id: string;
    title: string;
    source: number; // result of require()
}

interface Character {
    id: string;
    name: string;
    classId: string;
    power: number;
    imageId: string;
}

interface CharacterSection {
    title: string;
    data: Character[];
}

// Just like classes, images now live in a static, id-based list.
// require() in React Native MUST receive a static string literal,
// so all requires are done once, here, at module load time —
// nowhere else in the file do we call require() dynamically.
const CHARACTER_IMAGES: CharacterImage[] = [
    { id: '1', title: 'Warrior', source: require('@/assets/images/characters/warrior.png') },
    { id: '2', title: 'Mage', source: require('@/assets/images/characters/mage.png') },
    { id: '3', title: 'Archer', source: require('@/assets/images/characters/archer.png') },
    { id: '4', title: 'Rogue', source: require('@/assets/images/characters/rogue.png') },
    { id: '5', title: 'Paladin', source: require('@/assets/images/characters/paladin.png') },
];

const CharactersScreen = () => {
    const [counter, setCounter] = useState(0);
    const [classes, setClasses] = useState<CharacterClass[]>([]);
    const [characters, setCharacters] = useState<Character[]>([]);

    // Quick lookup by id, same idea as classes -> classId
    const imagesById = useMemo(() => {
        const map: Record<string, CharacterImage> = {};
        CHARACTER_IMAGES.forEach(img => { map[img.id] = img; });
        return map;
    }, []);

    useEffect(() => {

        const characterClasses: CharacterClass[] = [
            { id: '1', title: 'Warrior' },
            { id: '2', title: 'Mage' },
            { id: '3', title: 'Archer' },
            { id: '4', title: 'Rogue' },
            { id: '5', title: 'Paladin' },
        ];

        setClasses(characterClasses);

        const data: Character[] = [
            { id: '1', name: 'Thorin', classId: '1', power: 82, imageId: '1' },
            { id: '2', name: 'Elara', classId: '2', power: 76, imageId: '2' },
            { id: '3', name: 'Kyle', classId: '3', power: 68, imageId: '3' },
            { id: '4', name: 'Shade', classId: '4', power: 71, imageId: '4' },
            { id: '5', name: 'Harold', classId: '5', power: 90, imageId: '5' },
            { id: '6', name: 'Mira', classId: '2', power: 64, imageId: '2' },
            { id: '7', name: 'Brock', classId: '1', power: 55, imageId: '1' },
            { id: '8', name: 'Lisa', classId: '4', power: 60, imageId: '4' },
        ];

        setCounter(data.length + 1);

        setCharacters(data);

    }, []);

    const [form, setForm] = useState({
        name: '',
        classId: '',
        power: '',
        imageId: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        classId: '',
        power: '',
        imageId: '',
    });

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const validate = () => {
        const newErrors = {
            name: '',
            classId: '',
            power: '',
            imageId: '',
        };
        if (!form.name.trim()) newErrors.name = 'Enter character name';
        if (!form.classId.trim()) newErrors.classId = 'Select a class';
        if (isNaN(parseInt(form.power)) || parseInt(form.power) > 100) newErrors.power = 'Power must be a number no greater than 100';
        if (!form.imageId.trim()) newErrors.imageId = 'Select a character image';

        setErrors(newErrors);
        return (Object.keys(newErrors) as Array<keyof typeof newErrors>).every(key => newErrors[key] === '');
    };

    const handleSubmit = () => {
        if (validate()) {
            ToastAndroid.show("Character added", ToastAndroid.LONG);
            setCounter(counter + 1);
            const newCharacter: Character = {
                id: (counter).toString(),
                name: form.name,
                classId: form.classId,
                power: parseInt(form.power),
                imageId: form.imageId,
            };
            setCharacters(prev => [newCharacter, ...prev]);
            setForm({ name: '', classId: '', power: '', imageId: '' });
        }
    };

    // Group characters by class for the SectionList
    const sections: CharacterSection[] = useMemo(() => {
        return classes
            .map(cls => ({
                title: cls.title,
                data: characters.filter(character => character.classId === cls.id),
            }))
            .filter(section => section.data.length > 0);
    }, [classes, characters]);

    return (
        <View style={styles.screenContainer}>
            <View style={styles.characterFormContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Character name"
                    value={form.name}
                    onChangeText={(v) => handleChange('name', v)}
                />
                {errors.name && <Text style={styles.error}>{errors.name}</Text>}

                <Picker
                    selectedValue={form.classId}
                    onValueChange={(v) => handleChange('classId', v)}
                >
                    <Picker.Item label="Select class" value='' />
                    {classes.map(cls => (
                        <Picker.Item key={cls.id} label={cls.title} value={cls.id} />
                    ))}
                </Picker>
                {errors.classId && <Text style={styles.error}>{errors.classId}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Power"
                    keyboardType="numeric"
                    value={form.power}
                    onChangeText={(v) => handleChange('power', v.replace(/[^0-9]/g, ''))}
                />
                {errors.power && <Text style={styles.error}>{errors.power}</Text>}

                {errors.imageId && <Text style={styles.error}>{errors.imageId}</Text>}

                <Text style={styles.imagePickerLabel}>Choose an image</Text>
                <View style={styles.imageGrid}>
                    {CHARACTER_IMAGES.map((img) => (
                        <Pressable
                            key={img.id}
                            onPress={() => handleChange('imageId', img.id)}
                            style={[
                                styles.imageOptionButton,
                                form.imageId === img.id && styles.imageOptionButtonSelected,
                            ]}
                        >
                            <Image source={img.source} style={styles.imageOptionImage} />
                        </Pressable>
                    ))}
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.addButtonBase,
                        pressed ? styles.addButtonPressed : styles.addButtonDefault
                    ]}
                    onPress={handleSubmit}>
                    <Text style={styles.addButtonText}>Add character</Text>
                </Pressable>
            </View>

            <View style={styles.characterListContainer}>
                <SectionList
                    sections={sections}
                    keyExtractor={item => item.id}
                    renderSectionHeader={({ section }) => (
                        <Text style={styles.sectionHeader}>{section.title}</Text>
                    )}
                    renderItem={({ item }) => (
                        <View style={styles.characterCard}>
                            <Image source={imagesById[item.imageId]?.source} style={styles.characterCardImage} />
                            <View style={styles.characterCardInfo}>
                                <Text style={styles.characterCardName} numberOfLines={1}>
                                    {item.name}
                                </Text>
                                <Text style={styles.characterCardPower}>Power: {item.power}</Text>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyListText}>List is empty</Text>
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 4,
    },
    error: { color: 'red', marginBottom: 8, fontSize: 12 },
    screenContainer: {
        flex: 1,
        padding: 5,
        backgroundColor: '#f0f0f3',
    },
    characterFormContainer: {
        backgroundColor: "#fff",
        padding: 12,
        margin: 5,
        borderRadius: 12,
        gap: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    imagePickerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 4,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    imageOptionButton: {
        width: 56,
        height: 56,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'transparent',
        overflow: 'hidden',
        backgroundColor: '#f0f0f3',
    },
    imageOptionButtonSelected: {
        borderColor: '#04bf93',
    },
    imageOptionImage: {
        width: '100%',
        height: '100%',
    },
    addButtonBase: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center'
    },
    addButtonDefault: {
        backgroundColor: "#04bf93"
    },
    addButtonPressed: {
        backgroundColor: "#149a72",
        transform: [{ scale: 0.98 }]
    },
    addButtonText: {
        color: 'white',
        fontSize: 15,
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },
    characterListContainer: {
        flex: 1,
        backgroundColor: "#fff",
        margin: 5,
        borderRadius: 12,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        overflow: 'hidden',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4B0082',
        backgroundColor: '#f0f0f3',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 6,
        marginTop: 10,
        marginBottom: 6,
    },
    characterCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#f9f9f9",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderLeftWidth: 5,
        borderLeftColor: "#4B0082",
        gap: 12,
        marginBottom: 10,
    },
    characterCardImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#e0e0e0',
    },
    characterCardInfo: {
        flex: 1,
    },
    characterCardName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },
    characterCardPower: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#8e8e93',
        fontSize: 16,
    },
})

export default CharactersScreen;
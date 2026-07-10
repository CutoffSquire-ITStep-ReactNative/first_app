import { useState } from "react";
import {
    Alert,
    Button,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View
} from "react-native";

interface Item {
    id: string;
    title: string;
}

const HomeScreen = () => {

    const data: Item[] = [
        { id: '1', title: 'Item 1' },
        { id: '2', title: 'Item 2' },
        { id: '3', title: 'Item 3' },
        { id: '4', title: 'Item 4' },
        { id: '5', title: 'Item 5' },
        { id: '6', title: 'Item 6' },
        { id: '7', title: 'Item 7' },
        { id: '8', title: 'Item 8' },
        { id: '9', title: 'Item 9' },
        { id: '10', title: 'Item 10' }
    ];

    const [text, setText] = useState('');

    const [interval, setInterv] = useState(0);

    return (
        // <ScrollView>
            <View style={styles.container}>
                {/* text */}
                <Text style={styles.welcomeText}>Welcome to React Native</Text>
                
                {/* input */}
                <View style={styles.containerBase}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type something"
                        onChangeText={setText}
                        value={text}
                        placeholderTextColor="#999"
                    />
                    <Text style={{color: 'gray', fontSize: 16}}>&gt; {text}</Text>
                </View>


                <Button
                    title="Tap here"
                    color="#722b48"
                    onPress={() => Alert.alert('Warning ⚠️', 'You tapped this button', [
                        {
                            text: 'Ok',
                            onPress: () => ToastAndroid.showWithGravityAndOffset("You select: OK", ToastAndroid.LONG, ToastAndroid.BOTTOM, 1, 2),
                            style: 'default'
                        },
                        {
                            text: 'Cancel',
                            onPress: () => ToastAndroid.show("You pressed: CANCEL", ToastAndroid.LONG),
                            style: 'cancel'
                        }
                    ])}
                />

                {/* button 2 */}
                <TouchableOpacity 
                    style={styles.touchable} 
                    touchSoundDisabled={true} 
                    onPress={() => console.log("Touchable press")}
                    onLongPress={() => setInterv(
                        setInterval(() => console.log("Button still pressed"), 1000)
                    )}
                    onPressOut={() => interval !== 0 ? clearInterval(interval) : console.log()}
                >
                    <Text style={styles.touchableText}>Tap me</Text>
                    <Button 
                        title="Button in button"
                        color="#ad8a18"
                        onPress={() => console.log("Button in button")}
                    />
                </TouchableOpacity>
                
                {/* button 3 */}
                <Pressable style={({pressed})=>[
                    styles.pressableBase,
                    pressed ? styles.pressablePressed : styles.pressableDefault
                ]} onPress={()=>console.log("Pressable was tapped")}>
                    <Text style={styles.touchableText}>Pressable</Text>
                </Pressable>

                {/* list 1 */}
                <View style={styles.flexContainer}>
                    {Array.from({length: 48}, (_,i)=>i).map((v,i)=>(
                        <View key={i} style={styles.card}>
                            <Text style={{
                                color: 'white',
                                fontSize: 12,
                                fontWeight: 'bold',
                                letterSpacing: 3
                            }}>{i}#card</Text>
                        </View>
                    ))}
                    <View style={styles.card}>
                        <View style={{
                            paddingVertical: 5,
                            backgroundColor: "#26395c",
                            width: '60%',
                            height: '50%',
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6
                        }}></View>
                    </View>
                </View>

                {/* list 2 */}
                <View style={styles.flexContainer}>
                    <FlatList
                        data={data}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.listItem}>
                                <Text style={styles.listItemText}>{item.title}</Text>
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text
                                style={{
                                    textAlign: 'center',
                                    marginTop: 50,
                                    color: '#8e8e93',
                                    fontSize: 16,
                                }}
                            >List is empty</Text>
                        }
                    />
                </View>
                
            </View>
        // </ScrollView>
    );
};

//styles
const styles = StyleSheet.create({
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16
    },
    listItem: {
        backgroundColor: "#f9f9f9",
        padding: 20,
        borderRadius: 10,
        borderLeftWidth: 5,
        borderLeftColor: "#722b48",
        marginVertical: 8
    },
    listItemText: {
        fontSize: 16
    },
    containerBase: {
        backgroundColor:"#fff",
        padding: 5,
        margin: 5,
        borderRadius: 8,
        elevation: 5,
    },
    flexContainer: {
        flexDirection:'row',
        flexWrap: 'wrap',
        backgroundColor:"#fff",
        padding: 5,
        margin: 5,
        borderRadius: 8,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.9,
        shadowRadius: 10,
        alignItems: 'center',
        gap: 5,
    },
    card: {
        backgroundColor: '#2c2727',
        width: 30,
        height: 50,
        borderRadius: 4
    },
    container: {
        flex: 1,
        padding: 5,
    },
    welcomeText:{
        margin: 5,
        padding: 5,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: '#91345b',
        color:'white',
        borderRadius: 8
    },
    touchable: {
        backgroundColor: "#3b9b9b",
        color: 'white',
        padding: 5,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 8
    },
    touchableText: {
        color: 'white',
        fontSize: 15,
        textTransform: 'uppercase',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    pressableBase: {
        padding: 10,
        borderRadius: 8,
        alignItems: 'center'
    },
    pressableDefault: {
        backgroundColor: "#1a6e36"
    },
    pressablePressed: {
        backgroundColor: "#0e3f1e",
        transform: [{ scale: 0.98 }]
    }
})

export default HomeScreen;
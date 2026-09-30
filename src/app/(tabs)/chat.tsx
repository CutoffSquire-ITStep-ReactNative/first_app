import Header from "@/components/header";
import { useChats } from "@/context/chats";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";


const Chat = () => {
    const { chats, openChat } = useChats();

    return (
            <View style={styles.container}>
                <Header text="Chat " />

                <FlatList
                    data={chats}
                    keyExtractor={(c) => c.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.row}
                            onPress={() => openChat(item.id)}
                        >
                            <View style={styles.info}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text numberOfLines={1}>
                                    {item.messages[item.messages.length - 1]?.text}
                                </Text>
                            </View>
                            {item.unread > 0 && (
                                <Text style={styles.badge}>{item.unread}</Text>
                            )}
                        </TouchableOpacity>
                    )}
                />
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#ddd",
    },
    info: { flex: 1 },
    name: { fontWeight: "bold" },
    badge: {
        minWidth: 22,
        textAlign: "center",
        color: "#fff",
        backgroundColor: "#007aff",
        borderRadius: 11,
        overflow: "hidden",
        paddingHorizontal: 6,
    },
})

export default Chat;
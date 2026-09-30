import { useChats } from "@/context/chats";
import { useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatModal = () => {
    const { chats, openChatId, closeChat, sendMessage } = useChats();
    const [text, setText] = useState("");
    const listRef = useRef<FlatList>(null);

    const chat = chats.find((c) => c.id === openChatId);

    const send = () => {
        if (!chat || !text.trim()) return;
        sendMessage(chat.id, text.trim());
        setText("");
    };

    return (
        <Modal
            visible={!!chat}
            animationType="slide"
            onRequestClose={closeChat}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={closeChat}>
                        <Text style={styles.back}>Назад</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>{chat?.name}</Text>
                </View>

                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <FlatList
                        ref={listRef}
                        data={chat?.messages ?? []}
                        keyExtractor={(m) => m.id}
                        contentContainerStyle={styles.list}
                        onContentSizeChange={() => listRef.current?.scrollToEnd()}
                        renderItem={({ item }) => (
                            <View
                                style={[
                                    styles.bubble,
                                    item.fromMe ? styles.mine : styles.theirs,
                                ]}
                            >
                                <Text>{item.text}</Text>
                            </View>
                        )}
                    />
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            value={text}
                            onChangeText={setText}
                            placeholder="Повідомлення"
                            onSubmitEditing={send}
                        />
                        <TouchableOpacity onPress={send}>
                            <Text style={styles.send}>Надіслати</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    back: { color: "#007aff", marginRight: 15 },
    title: { fontWeight: "bold", fontSize: 16 },
    list: { padding: 10 },
    bubble: {
        maxWidth: "75%",
        padding: 10,
        borderRadius: 10,
        marginBottom: 6,
    },
    mine: { alignSelf: "flex-end", backgroundColor: "#cfe8ff" },
    theirs: { alignSelf: "flex-start", backgroundColor: "#eee" },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        borderTopWidth: 1,
        borderColor: "#ccc",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 8,
        marginRight: 8,
    },
    send: { color: "#007aff" },
});

export default ChatModal;
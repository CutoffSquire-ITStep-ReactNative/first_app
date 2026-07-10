import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    View
} from "react-native";

interface Task {
    id: string;
    title: string;
}

const TasksScreen = () => {

    const [counter, setCounter] = useState(0);

    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {

        const data: Task[] = [
            { id: '1', title: 'Task 1' },
            { id: '2', title: 'Task 2' },
            { id: '3', title: 'Task 3' },
            { id: '4', title: 'Task 4' },
            { id: '5', title: 'Task 5' },
            { id: '6', title: 'Task 6' },
            { id: '7', title: 'Task 7' },
            { id: '8', title: 'Task 8' },
            { id: '9', title: 'Task 9' },
            { id: '10', title: 'Task 10' }
        ];

        setCounter(data.length + 1);

        setTasks(data);

    }, []);

    const addTask = (title: string) => {
        if (title.trim() === '') {
            throw new Error('Task title cannot be empty');
        }
        setCounter(counter + 1);
        const newTask: Task = {
            id: (counter).toString(),
            title: title
        };
        setTasks(prev => [newTask, ...prev]);
    }

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
    }

    const [input, setInput] = useState('');

    return (
        <View style={styles.screenContainer}>
            <View style={styles.taskFormContainer}>
                <TextInput
                    style={styles.taskInput}
                    placeholder="Enter name of task..."
                    onChangeText={setInput}
                    value={input}
                    placeholderTextColor="#999"
                />

                <Pressable
                    style={({ pressed }) => [
                        styles.addButtonBase,
                        pressed ? styles.addButtonPressed : styles.addButtonDefault
                    ]}
                    onPress={() => {
                        try {
                            addTask(input);
                        }
                        catch (error) {
                            Alert.alert('Warning❗', 'Failed to add task', [{ text: 'OK' }]);
                            return;
                        }
                        setInput('');
                        ToastAndroid.show("Task added", ToastAndroid.LONG);
                    }}>
                    <Text style={styles.addButtonText}>Add task</Text>
                </Pressable>
            </View>

            <View style={styles.taskListContainer}>
                <FlatList
                    data={tasks}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.taskListContent}
                    renderItem={({ item }) => (
                        <View style={styles.taskItem}>
                            <Text style={styles.taskItemText} numberOfLines={1}>
                                {item.title}
                            </Text>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.deleteButtonBase,
                                    pressed ? styles.deleteButtonPressed : styles.deleteButtonDefault
                                ]}
                                onPress={() => {
                                    deleteTask(item.id);
                                    ToastAndroid.show("Task deleted", ToastAndroid.LONG);
                                }}>
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </Pressable>
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
    screenContainer: {
        flex: 1,
        padding: 5,
        backgroundColor: '#f0f0f3',
    },
    taskFormContainer: {
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
    taskInput: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16
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
    taskListContainer: {
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
    },
    taskListContent: {
        padding: 12,
        gap: 10,
        flexGrow: 1,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "#f9f9f9",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderLeftWidth: 5,
        borderLeftColor: "#54b370",
        gap: 10,
    },
    taskItemText: {
        flex: 1,
        fontSize: 16,
        color: '#222',
    },
    deleteButtonBase: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButtonDefault: {
        backgroundColor: "#d42920"
    },
    deleteButtonPressed: {
        backgroundColor: "#9d1a14",
        transform: [{ scale: 0.96 }]
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 13,
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },

    emptyListText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#8e8e93',
        fontSize: 16,
    },
})

export default TasksScreen;
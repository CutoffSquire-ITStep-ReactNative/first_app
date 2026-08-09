import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Drawer, DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from "expo-router/drawer";
import { Image, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const DrawerContent = (props: DrawerContentComponentProps) => {
    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <View style={{ flex: 1, padding: 5 }}>
                <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
                    <DrawerItemList {...props} />
                </DrawerContentScrollView>

                <View style={styles.footer}>
                <View style={styles.profileContainer}>
                    <Image
                        source={ require('@/assets/images/gallery/dog_with_butterfly.jpg') }
                        style={styles.avatar}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.name}>Dog with butterfly</Text>
                        <Text style={styles.nickname}>@sobaka</Text>
                        <Text style={styles.status}>status: butterfly</Text>
                    </View>
                </View>

                <Text>React Native Lessons</Text>
                <Text>2026</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    footer: {
        padding: 4,
        paddingHorizontal: 10,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    avatar: {
        width: 110,
        height: 120,
        borderRadius: 12,
        marginRight: 14,
        backgroundColor: '#ddd',
    },
    profileInfo: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f1f1f',
    },
    nickname: {
        fontSize: 15,
        color: '#666',
        marginTop: 4,
    },
    status: {
        fontSize: 14,
        color: '#4b182d',
        marginTop: 4,
    },
});

const TabLayout = () => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <Drawer
                        drawerContent={(props) => <DrawerContent {...props} />}
                        screenOptions={{
                            swipeEnabled: true,
                            swipeEdgeWidth: 200,
                            headerShown: false,
                            drawerStyle: {
                                backgroundColor: '#fff',
                                width: 300,
                                borderColor: "#1f1f1f",
                                borderRadius: 0,
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                padding: 0,
                                margin: 0
                            },
                            drawerActiveTintColor: '#4b182d',
                            drawerActiveBackgroundColor: '#f19ec2',
                            drawerItemStyle: {
                                borderRadius: 0,
                                margin: 0
                            }
                        }}
                    >
                        <Drawer.Screen
                            name="index"
                            options={{
                                drawerLabel: 'Home',
                                drawerIcon: ({ color, size }) => <Entypo name="home" size={size} color={color} />
                            }}
                        />
                        <Drawer.Screen
                            name="lights"
                            options={{
                                drawerLabel: 'Traffic Light',
                                drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="traffic-light-outline" size={size} color={color} />
                            }}
                        />
                        <Drawer.Screen
                            name="tasks"
                            options={{
                                drawerLabel: 'Tasks',
                                drawerIcon: ({ color, size }) => <FontAwesome name="tasks" size={size} color={color} />
                            }}
                        />
                        <Drawer.Screen
                            name="characters"
                            options={{
                                drawerLabel: 'Characters',
                                drawerIcon: ({ color, size }) => <FontAwesome6 name="person-snowboarding" size={size} color={color} />
                            }}
                        />
                        <Drawer.Screen
                            name="video"
                            options={{
                                drawerLabel: 'Video',
                                drawerIcon: ({ color, size }) => <Entypo name="video" size={size} color={color} />
                            }}
                        />
                    </Drawer>
                </GestureHandlerRootView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default TabLayout;
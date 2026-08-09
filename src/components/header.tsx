import { DrawerToggleButton } from "expo-router/drawer";
import { StyleSheet, Text, View } from "react-native";


function Header ({text} : {text:string}) {
    return(
        <View style={styles.headerContainer}>
            <View style={{ transform: [{ scale: 1.4 }], marginLeft: 10 }}>
                <DrawerToggleButton tintColor={'white'} />
            </View>
            <Text style={styles.headerText}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: '#6f65cb',
        paddingVertical: 10,
        borderRadius: 4,
    },
    headerText: {
        fontSize: 25,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
});

export default Header;
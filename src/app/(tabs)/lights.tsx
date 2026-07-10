import { StyleSheet, Text, View } from "react-native";

function Bulb ({color, text} : {color:string, text:string}) {
    return(
        <View style={[styles.bulb, { backgroundColor: color }, { boxShadow: `0px 0px 20px ${color}` }]}>
            <Text style={styles.bulbText}>{text}</Text>
        </View>
    )
}

const LightsScreen=()=>{
    return(
        <View style={styles.lightsContainer}>
            <Bulb color="#cd0000" text="stop"/>
            <Bulb color="#d0be38" text="ready"/>
            <Bulb color="#14b845" text="go"/>
        </View>
    )
}

const styles = StyleSheet.create({
    lightsContainer: {
        alignSelf: 'center',
        marginTop: 80,
        height: 600,
        width: 250,
        padding: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2c2c2c',
        borderRadius: 8,
        gap: 20,
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
    },
    bulb: {
        width: 150,
        height: 150,
        borderRadius: '50%',
        backgroundColor: '#ff0000',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0px 4px 6px #ff0000',
    },
    bulbText: {
        fontSize: 40,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
});

export default LightsScreen;
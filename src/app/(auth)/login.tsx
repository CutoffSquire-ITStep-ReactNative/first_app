import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const LoginScreen = ()=>{
    const [username, setUsername] = useState('emilys');
    const [password, setPassword] = useState('emilyspass');
    const [loading, setLoading] = useState(false);

    const {login} = useAuth();
    const handleLogin = async()=>{
        if(!username || !password) return;
        setLoading(true);
        try{
            await login(username, password);
        }
        catch(error:any){
            Alert.alert('Login failed', error.response?.data?.message)
        } finally{
            setLoading(false);
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            {
                loading?(
                    <ActivityIndicator color="#fff"/>
                ):(
                    <Text style={styles.buttonText}>Login</Text>
                )
            }
            
        </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent:'center',
        padding: 20
    },
    title:{
        fontSize: 24,
        fontWeight:'bold',
        marginBottom: 20,
        textAlign:'center'
    },
    input:{
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12
    },
    button:{
        backgroundColor: '#6e0e36',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center'
    },
    buttonText:{
        color:"#fff",
        fontWeight: 'bold'
    }
})

export default LoginScreen;
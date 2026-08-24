import { Stack } from "expo-router";

const AuthLayout = ()=>{
    return(
        <Stack>
            <Stack.Screen
                name="login"
                options={{
                    title:"Auth",
                    headerShown:false
                }}
            />
            <Stack.Screen
                name="create-pin"
                options={{
                    title:"Set PIN",
                    headerShown:false
                }}
            />
            <Stack.Screen
                name="unlock"
                options={{
                    title:"Unlock",
                    headerShown:false
                }}
            />
        </Stack>
    )
}

export default AuthLayout;
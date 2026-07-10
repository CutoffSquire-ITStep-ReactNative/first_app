import { Entypo, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from "expo-router";

const TabLayout = () =>{
    return(
        <Tabs screenOptions={{
            tabBarActiveTintColor:'#0042bc',
            headerStyle:{
                backgroundColor:'#98cdff'
            }
        }}>
            <Tabs.Screen name="index"
                options={{
                    title:'Home',
                    tabBarIcon:({color})=><Entypo name="home" size={24} color={color} />
                }}
            />
            <Tabs.Screen name="lights"
                options={{
                    title:'Traffic Light',
                    tabBarIcon:({color})=><MaterialCommunityIcons name="traffic-light-outline" size={24} color={color} />
                }}
            />
            <Tabs.Screen name="tasks"
                options={{
                    title:'Tasks',
                    tabBarIcon:({color})=><FontAwesome name="tasks" size={24} color={color} />
                }}
            />
        </Tabs>
    )
}


export default TabLayout;
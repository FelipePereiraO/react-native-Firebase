import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/Pages/Login';
import { Register } from './src/Pages/Register';
import { Home } from './src/Pages/Home';
import { Tab } from './src/Pages/Tab';
import { Client } from './src/Pages/Client';
import { Attendance } from './src/Pages/Attendance';
import { AttendanceSelect } from './src/Pages/AttendanceSelect';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
      <Stack.Screen name="Home" component={Tab} options={{headerShown: false}}/>
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
        
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Client" component={Client} />
        <Stack.Screen name="Atendimento" component={Attendance} />
        <Stack.Screen name="AtendimentoSelect" component={AttendanceSelect} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

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
import { NewAttendance } from './src/Pages/NewAttendance';
import { Venda } from './src/Pages/Venda';
import { NewVenda } from './src/Pages/NewVenda';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Recibo } from './src/Pages/Recibo';
import EditAttendance from './src/Pages/Component/EditAttendance';
import { ViewClient } from './src/Pages/ViewClient';
import { EditClient } from './src/Pages/EditClient';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer independent={true}>
      
      <StatusBar style="dark" />
      
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Tab} options={{headerShown: false,}}/>
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Clientes" component={Client} />
        <Stack.Screen name="Cliente" component={ViewClient} />
        <Stack.Screen name="Editar Cliente" component={EditClient} />
        <Stack.Screen name="Atendimentos" component={Attendance} />
        <Stack.Screen name="Atendimento" component={AttendanceSelect} />
        <Stack.Screen name="Editar Atendimento" component={EditAttendance} />
        <Stack.Screen name="Venda" component={Venda} />
        <Stack.Screen name="Novo Atendimento" component={NewAttendance} />
        <Stack.Screen name="Nova Venda" component={NewVenda} />
        <Stack.Screen name="Recibo" component={Recibo} />


      </Stack.Navigator>
      <Toast />
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

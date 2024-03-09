import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { signOut } from 'firebase/auth';
import { auth } from '../services/Firebase';
import Ionicons from '@expo/vector-icons/Ionicons';

export function Home({navigation, route}){
    //const [user, setUser] = useState(route.params.auth)
    

    async function Logout(){
        await signOut(auth)
        .then(() =>{
            navigation.goBack()
        })
        .catch((error) => console.log(error))
    }

    return(
        <ScrollView style={styles.container}>
            {/* <Text>Welcome {user._tokenResponse.email}</Text> */}
            <View style={{margin: 16, marginTop: 50}}>
                <Text style={{fontSize: 22, fontWeight: 'bold', color: "#6c5ce7"}}>Bem vindo, Paulo Junior!</Text>
            </View>
            <View>
                
            </View>
            {/* <View style={{margin: 10, flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity style={styles.button_list} onPress={() => navigation.navigate("Venda")}>
                    <Ionicons name="list" size={32} color="black"/>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Lista de Vendas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button_list} onPress={() => navigation.navigate("Nova Venda")}>
                    <Ionicons name="person-add-sharp" size={32} color="black"/>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Nova Venda</Text>
                </TouchableOpacity>
            </View> */}
            <View style={{margin: 10, flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity style={styles.button_list} onPress={() => navigation.navigate("Atendimentos")}>
                    <Ionicons name="calendar-sharp" size={32} color="black"/>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Atendimentos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button_list} onPress={() => navigation.navigate("Novo Atendimento")}>
                    <Ionicons name="create" size={32} color="black"/>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Adicionar novo atendimento</Text>
                </TouchableOpacity>
            </View>
            <View style={{margin: 10, flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity style={styles.button_list} onPress={() => navigation.navigate("Clientes")}>
                    <Ionicons name="people-sharp" size={32} color="black"/>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Clientes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button_list}>
                    <Ionicons name="person-add-sharp" size={32} color="black"/>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>Adicionar novo cliente </Text>
                </TouchableOpacity>
            </View>

            {/* <TouchableOpacity style={styles.button} onPress={() => Logout()}>
                        <Text style={{fontWeight: 'bold', color: 'white'}}>Logout</Text>
            </TouchableOpacity> */}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',

    },
    login:{
        marginTop: '10%',
        alignItems: 'center'

    },
    inputs:{

    },
    backgorundInput:{
        borderColor: 'black',
        backgroundColor: '#dfe6e9',
        borderRadius: 8,
        height: 50,
        width: 300,
        padding: 10
    
    },
    logo:{
        fontSize: 35,
        fontWeight: 'bold',
        color: "#6c5ce7"
    },
    button:{
        height: 50,
        width: 300,
        backgroundColor: "#6c5ce7",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button_list:{
        height: 170,
        width: 150,
        backgroundColor: '#f8f3f6',
        borderRadius: 15,
        justifyContent: 'center',
        padding: 20,
        marginHorizontal: 10
    }
  });
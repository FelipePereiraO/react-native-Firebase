import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import {db} from "../services/Firebase"
import {ref, set, update, onValue, get } from "firebase/database"
import Ionicons from '@expo/vector-icons/Ionicons';
import { Actionsheet, NativeBaseProvider, useDisclose } from "native-base";
import Toast from 'react-native-toast-message';
import Modal from "./Component/Modal";

export function EditClient({navigation, route}){
    const [client, setClient] = useState(route.params.selectedItem);
    console.log(route.params);
    const [nome, setNome] = useState(route.params.selectedItem.nome)
    const [bairro, setBairro] = useState("")
    const [rua, setRua] = useState("")
    const [number, setNumber] = useState("")
    const [telefone, setTelefone] = useState(route.params.selectedItem.telefone)
    const [isOpensCancel, setIsOpenCancel] = useState(false);

    useEffect(() =>{
        const endereco =  route.params.selectedItem.endereco

        const enderecoArray = endereco.split("-");

        setBairro(enderecoArray[0])
        setRua(enderecoArray[1])
        setNumber(enderecoArray[2])


    }, [])

    const UpdateCliente = () =>{
        setIsOpenCancel(false)
        // update(ref(db, 'atendimentos/0/'+client.id), 
        //     {
        //         nome: nome,
        //         endereco: bairro+" - "+rua+" - "+number,
        //         telefone: telefone,        
        //     }
        // )
        // .then((data) => {
        //     Toast.show({
        //         type: 'success',
        //         text1: 'Cliente',
        //         text2: 'Cliente atualizado com sucesso!',
        //         //visibilityTime: 100000
        //     });
        //     navigation.goBack();
        // })
        // .catch((error) => {
        //     console.error(error)
        //     // Toast.show({
        //     //     type: 'error',
        //     //     text1: 'Cliente',
        //     //     text2: 'Cliente não atualizado!'
        //     // });
        // });
    } 

    return(
        <NativeBaseProvider>
            <View style={{margin: 6}}>
                <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Nome</Text>
                <View style={styles.backgorundInput}>
                    <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} placeholder='Nome do cliente' id='nome' value={nome} onChangeText={value => setNome(value)}/>                              
                </View>    
                <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Celular/WhatsApp</Text>
                <View style={styles.backgorundInput}>
                    <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} placeholder='N° Celular' id='telefone' keyboardType="numeric" value={telefone} onChangeText={value => setTelefone(value)}/>                              
                </View>      
                <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Bairro</Text>
                <View style={styles.backgorundInput}>
                    <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} placeholder='Bairro' id='bairro' value={bairro} onChangeText={value => setBairro(value)}/>                              
                </View>   
                <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Rua</Text>
                <View style={styles.backgorundInput}>
                    <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} placeholder='Rua' id='rua' value={rua} onChangeText={value => setRua(value)}/>                              
                </View> 
                <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>N°</Text>
                <View style={styles.backgorundInput}>
                    <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} placeholder='Numero da casa' id='number' value={number} onChangeText={value => setNumber(value)}/>                              
                </View>   
                {isOpensCancel ?
                        <Modal Text={"Deseja atualizar este Cliente?"} onComfirm={() => UpdateCliente()} onCancel={() => setIsOpenCancel(false)}/>
                    : <></>} 
                <View style={{marginTop: '15%'}}>
                        <TouchableOpacity style={styles.buttonNext} onPress={() => setIsOpenCancel(!isOpensCancel)}>
                            <Text style={{fontWeight: 'bold', color: 'white'}}>Confirmar</Text>
                        </TouchableOpacity>   
                </View>
            </View>
        </NativeBaseProvider>
        
    )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      flex: 1
    },
    login:{
        marginTop: '10%',
        alignItems: 'center'

    },
    inputs:{
    
    },
    backgorundInput:{
        borderColor: '#dcdde1',
        backgroundColor: '#f5f6fa',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        height: 40,
        width: '100%',
        padding: 10
    
    },
    buttonNext:{
        height: 40,
        width: 160,
        backgroundColor: "#2ecc71",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        right: 0

    },
})
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import {db} from "../services/Firebase"
import {ref, set, update, onValue, get } from "firebase/database"
import Ionicons from '@expo/vector-icons/Ionicons';
import { Actionsheet, NativeBaseProvider, useDisclose } from "native-base";

export function Client({navigation}){
    const [cliente, setClientes] = useState([])
    const [filter, setFilter] = useState([])
    const [nomeExiste, setNomeExiste] = useState("")
    const [selectedItem, setSelectedItem] = useState(null);
    const {
        isOpen,
        onOpen,
        onClose
      } = useDisclose();   
    useEffect(() =>{
        GetClientes()
    }, [])
    // function readData(){
    //     const startCountRef = ref(db, 'clientes/')
    //     onValue(startCountRef, (snap) =>{
    //         const data = snap.val();
    //         setClient(data)

    //     })
    // }

    const GetClientes = () =>{
        const startCountRef = ref(db, 'atendimentos/0')
        get(startCountRef).then((snap) =>{
            const data = snap.val();
            const novoArray = Object.keys(data).map((chave) => {
                const arrayDeObjetos = data[chave];              
                return arrayDeObjetos.map((objeto) => {
                    if(objeto.hasOwnProperty("atendimento")){
                        return{
                            id: chave,
                            nome: objeto.nome,
                            endereco: objeto.endereco,
                            telefone: objeto.telefone
                        }
                    }
                });
            }).flat();   
            setClientes(novoArray)
            setFilter(novoArray)
        })
    }

    function onHandleClient(value){
        setNomeExiste(value)
        if(value != ""){
            const ft = cliente.filter(item => item.nome.includes(value))
            setFilter(ft);
        }else{
            setFilter(cliente)
        }

    }

    const SelectCliente = (client) =>{
        setSelectedItem(client)
        navigation.navigate("Cliente", {client})
    }

    const Select = (client) =>{
        onOpen()
        setSelectedItem(client)
    }

    const Item = ({item}) => (
        <TouchableOpacity
        onPress={() => SelectCliente(item)}
        style={{height: 65, padding: 5, marginVertical: 5, flexDirection: 'row'}}>
            <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.endereco}>{item.endereco.substring(0,55)+'..'}</Text>
            </View>
            <TouchableOpacity
                onPress={() => Select(item)}
                style={{right: 15, top: 22 ,position: 'absolute'}}
            >
                <Ionicons  name="ellipsis-horizontal-sharp" size={20} color="#636e72"/>
            </TouchableOpacity>
        </TouchableOpacity>
    );

   
    return(
        <NativeBaseProvider style={styles.container}>
            {
                cliente ? (
                    <View style={{margin: 6}}>
                        <View style={styles.backgorundInput}>
                            <Ionicons name="search-outline" size={20} color='#bdc3c7'/>
                            <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} placeholder='Digite o nome do cliente' id='nome' value={nomeExiste} onChangeText={value => onHandleClient(value)}/>                              
                        </View>
                        <FlatList
                            data={filter}
                            renderItem={({item}) => <Item item={item} />}
                            scrollEnabled={false}
                            keyExtractor={item => item.id}
                        />
                        <Actionsheet isOpen={isOpen} onClose={onClose}>
                            <Actionsheet.Content>
                                <Actionsheet.Item onPress={() => navigation.navigate("Editar Cliente", {selectedItem})} startIcon={<Ionicons name="create" size={25} color="black"/>} >Editar</Actionsheet.Item>
                                <Actionsheet.Item onPress={console.log("test")} startIcon={<Ionicons name="trash" size={25} color="black"/>} >Excluir</Actionsheet.Item>
                            </Actionsheet.Content>
                        </Actionsheet>
                            
                    </View>
                ) : (
                    <></>
                )
            }
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
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        height: 40,
        width: '100%',
        padding: 10
    
    },
    backgorundInputArea:{
        borderColor: '#dcdde1',
        borderWidth: 1,
        backgroundColor: '#f5f6fa',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        height: 150,
        padding: 10
    
    },
    logo:{
        fontSize: 35,
        fontWeight: 'bold',
        color: "#6c5ce7"
    },
    button:{
        height: 40,
        width: 150,
        margin: 10,
        marginBottom: 25,
        backgroundColor: "#6c5ce7",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        bottom: 0, 
        left: '55%'
    },
    nome:{
        fontWeight: 'bold',
        color: '#2f3640'
    },
    endereco:{
        fontSize: 12,
        color: '#636e72'
    }
  });
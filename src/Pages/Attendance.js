import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import {db} from "../services/Firebase"
import {ref, set, update, onValue, orderByChild, startAt, endAt, startAfter, query, limitToFirst } from "firebase/database"
import { AttendanceSelect } from "./AttendanceSelect";
export function Attendance({navigation}){
    const [client, setClient] = useState([])
    const [atendimento, setAtendimento] = useState([])
    const [data, setData] = useState("")
    const [atendimentosHoje, setAtendimentosHoje] = useState(1)

    useEffect(() =>{
        readDataAtendimento()
        readDataClient()
    }, [])
    function readDataAtendimento(){
        setAtendimento([])
        const startCountRef =query(ref(db, 'atendimento/', orderByChild('id'), limitToFirst(1)))
        onValue(startCountRef, (snap) =>{
            const data = snap.val();
            setAtendimento(data)
            const date = new Date();
            var dataAtual =  date.getDate() +"/"+(date.getMonth() + 1)+"/"+date.getFullYear()
            setData(dataAtual)

            var atendimentos = 0
            data.map((a) =>{
                if(a.data == dataAtual){
                    atendimentos += 1
                }
            })
            if(atendimentos == 0){
                setAtendimentosHoje(0)
            }
        })
    }

    function readDataClient(){
        setClient([])
        const startCountRef = ref(db, 'clientes/')
        onValue(startCountRef, (snap) =>{
            const data = snap.val();
            setClient(data)

        })
    }


    return(
        <ScrollView style={styles.container}>
            <View>
                <View style={{flexDirection: 'row', marginHorizontal: 25, marginTop: 12}}>
                    <Text style={{fontSize: 26, fontWeight: '500', color: "#6c5ce7", }}>Hoje</Text>
                    <View style={{width: "100%", backgroundColor: '#95a5a6', height: 4, margin: 18}}></View>
                </View>
                
                {
                    atendimentosHoje == 1 ?
                    atendimento ? atendimento.map((a) =>(
                        client ? client.map((c) =>(
                            a.id_cliente == c.id && a.data == data ? (
                                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("AtendimentoSelect", {atendimento: a, cliente: c})}>
                                    <View style={a.atendimento == 1 ? styles.completed : styles.no_complet}></View>
                                    <View style={{margin: 10}}>
                                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{c.nome}</Text> 
                                        <Text>{c.endereco}</Text>  
                                    </View> 
                                </TouchableOpacity>
                            ): ""
                        )) : ""
                    )) : "" 
                    : 
                    <View style={{alignItems: 'center', margin: 10}}>
                        <Text>Não existe atendimento marcado para hoje.</Text>   
                    </View>
                }       
                <View style={{flexDirection: 'row', marginHorizontal: 25, marginTop: 12}}>
                    <Text style={{fontSize: 26, fontWeight: '500', color: "#6c5ce7", }}>Outros</Text>
                    <View style={{width: "100%", backgroundColor: '#95a5a6', height: 4, margin: 18}}></View>
                </View>
                {
                    atendimento ? atendimento.map((a) =>(
                        client ? client.map((c) =>(
                            a.id_cliente == c.id && a.data != data? (
                                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("AtendimentoSelect", {atendimento: a, cliente: c})}>
                                    <View style={a.atendimento == 1 ? styles.completed : styles.no_complet}></View>
                                    <View style={{margin: 10}}>
                                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{c.nome}</Text> 
                                        <Text>{c.endereco}</Text>
                                                                                                                
                                                
                                    </View>
                                    
                                </TouchableOpacity>
                            ): "" 
                        )) : ""
                    )) : ""    
                }          
            </View>

        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',

    },
    completed:{
        height: "100%",
        width: 7,
        backgroundColor: '#2ecc71',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8

    },
    no_complet:{
        height: "100%",
        width: 7,
        backgroundColor: '#e74c3c',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8
    },
    card:{
        height: 80,
        backgroundColor: '#f8f3f6',
        margin: 10,
        borderRadius: 8,
        flexDirection: 'row'
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
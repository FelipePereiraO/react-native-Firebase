import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import {db} from "../services/Firebase"
import {ref, set, update, onValue, orderByChild, startAt, endAt, startAfter, query, limitToFirst, off, get, child } from "firebase/database"
import { AttendanceSelect } from "./AttendanceSelect";
import { useFocusEffect } from "@react-navigation/native";
export function Attendance({navigation}){
    const [client, setClient] = useState([])
    const [atendimento, setAtendimento] = useState([])
    const [data, setData] = useState("")
    const [atendimentosHoje, setAtendimentosHoje] = useState(1)

    useFocusEffect(
        React.useCallback(() => {
            readDataAtendimento()
            readDataClient()
        }, [])
      );
    useEffect(() =>{
        readDataAtendimento()
        readDataClient()
    }, [])
    async function readDataAtendimento(){
        setAtendimento([])
        const startCountRef = ref(db, 'atendimentos/0')
        get(startCountRef).then((snap) =>{
            const data = snap.val();
            if(data == null){
                setAtendimentosHoje(0)
            }
            const novoArray = Object.keys(data).map((chave) => {
                const arrayDeObjetos = data[chave];              
                return arrayDeObjetos.map((objeto) => {
                    if(objeto.hasOwnProperty("atendimento")){
                        return {
                            atendimento: Object.values(objeto.atendimento).map((atendimento) => { 
                                const chavesAtendimento = Object.keys(atendimento);
                                return Object.entries(atendimento).map(([index, atendimentoData]) => {
                                    return {
                                        id: chave,
                                        idAtendimento: index,
                                        data: atendimentoData.data,
                                        hora: atendimentoData.hora,
                                        descricao: atendimentoData.descricao,
                                        status: atendimentoData.status,
                                        nome: objeto.nome,
                                        endereco: objeto.endereco,
                                        telefone: objeto.telefone,
                                        servico: atendimentoData.servico,
                                        tempo_garantia: atendimentoData.tempo_garantia,
                                        valor: atendimentoData.valor,
                                        tipo_pagamento: atendimentoData.tipo_pagamento
                                    };
                                });
                            }).flat(),
                        };
                    }
                });
              }).flat();
              const novoObjeto = { atendimento: [] };

              novoArray.forEach((item) => {
                if(item != undefined){ 
                    novoObjeto.atendimento.push(...item.atendimento);

                }
              });

              //console.log(novoObjeto)
            
            
            setAtendimento(novoObjeto.atendimento)
            const date = new Date();
            var dataAtual =  date.getDate() +"/"+(date.getMonth() + 1)+"/"+date.getFullYear()
            setData(dataAtual)

            var atendimentos = 0
            novoObjeto.atendimento.map((a) =>{
                if(a.data == dataAtual){
                    atendimentos += 1
                }
            })
            if(atendimentos == 0){
                setAtendimentosHoje(0)
            }
        })
        //off(startCountRef)
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
                    atendimentosHoje >= 1 ?
                    atendimento ? atendimento.map((a) =>(
                        
                            a.data == data ? (
                                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Atendimento", {atendimento: a, cliente: a})}>
                                    <View style={a.status == 1 ? styles.completed :  a.status == 2 ? styles.cancel : styles.no_complet}></View>
                                    <View style={{margin: 10}}>
                                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{a.nome}</Text> 
                                        <Text>{a.endereco}</Text>  
                                    </View> 
                                </TouchableOpacity>
                            ): ""
                        
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
                        
                            a.data != data? (
                                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Atendimento", {atendimento: a, cliente: a})}>
                                    <View style={a.status == 1 ? styles.completed : a.status == 2 ? styles.cancel : styles.no_complet}></View>
                                    <View style={{margin: 10}}>
                                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{a.nome}</Text> 
                                        <Text>{a.endereco}</Text>
                                                                                                                
                                                
                                    </View>
                                    
                                </TouchableOpacity>
                            ): "" 
                        
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
        backgroundColor: '#f7b731',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8
    },
    cancel:{
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
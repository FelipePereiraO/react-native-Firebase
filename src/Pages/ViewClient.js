import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import {db} from "../services/Firebase"
import {ref, set, update, onValue, get } from "firebase/database"
import Ionicons from '@expo/vector-icons/Ionicons';
import { Actionsheet, NativeBaseProvider, useDisclose } from "native-base";


export function ViewClient({navigation, route}){
    const [client, setClient] = useState(route.params.client);
    const [agenda, setAgenda] = useState([])

    useEffect(() =>{
        Agendamentos()
    }, [])

    const Agendamentos = () => {
        const startCountRef = ref(db, 'atendimentos/0/' + client.id+'/0/atendimento/0')
        get(startCountRef).then((snap) => {
            const data = snap.val();
            const novoArray = Object.keys(data).map((chave) => {
                const arrayDeObjetos = data[chave];
                return {
                    id: chave,
                    descricao: arrayDeObjetos.descricao,
                    data: arrayDeObjetos.data,
                    status: arrayDeObjetos.status,
                    hora: arrayDeObjetos.hora,
                    servico: arrayDeObjetos.servico,
                    tempo_garantia: arrayDeObjetos.tempo_garantia,
                    tipo_pagamento: arrayDeObjetos.tipo_pagamento,
                    valor: arrayDeObjetos.valor
                }
            }).flat();
            setAgenda(novoArray)
        })

    }

    const Agenda = (item) =>{
        obj = {
            id: client.id,
            idAtendimento: item.id,
            data: item.data,
            hora: item.hora,
            descricao: item.descricao,
            status: item.status,
            nome: client.nome,
            endereco: client.endereco,
            telefone: client.telefone,
            servico: item.servico,
            tempo_garantia: item.tempo_garantia,
            valor: item.valor,
            tipo_pagamento: item.tipo_pagamento
        }
        navigation.navigate("Atendimento", {atendimento: obj})
    }

    const Item = ({item}) => (
        <TouchableOpacity
        onPress={() => Agenda(item)}
        style={{height: 60, padding: 5, marginVertical: 5, flexDirection: 'row'}}>
            <View style={{backgroundColor: item.status == 1 ? '#55efc4' : item.status == 2 ? '#fab1a0' : '#ffeaa7', margin: 5, padding: 10, borderRadius: 8}}>
                <Ionicons name="calendar-outline" size={20} color={item.status == 1 ? '#2ecc71' : item.status == 2 ? '#e74c3c' : '#f7b731'}/>

            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', padding: 5}}>
                <Text style={{fontWeight: 'bold'}}>{item.data}</Text>
                <Text style={{color:'#636e72' }}>Obs: { item.descricao ? item.descricao.substring(0,25)+'..' : "N.I"}</Text>
                
            </View>
        </TouchableOpacity>
    );


    return(
        <View style={styles.container}>
            <View style={{margin: 20}}>
                <View style={{margin: 6}}>
                    <Text style={styles.nome}>{client.nome}</Text>
                </View>
                <View style={{flexDirection: 'row', margin: 6}}>
                    <Ionicons name="logo-whatsapp" size={22} color='#bdc3c7'/>
                    <Text style={styles.titulo}>Celular</Text>
                </View>
                <Text style={styles.resposta}>{client.telefone}</Text>
                <View style={{flexDirection: 'row', margin: 6}}>
                    <Ionicons name="location-sharp" size={22} color='#bdc3c7'/>
                    <Text style={styles.titulo}>Endereço</Text>
                </View>
                <Text style={styles.resposta}>{client.endereco}</Text>
            </View>
            <View></View>
            <View>
                <Text style={styles.agenda}>Agendamentos</Text>
                <View>
                    {
                        agenda ? (
                            <FlatList
                                data={agenda}
                                renderItem={({item}) => <Item item={item} />}
                                scrollEnabled={false}
                                keyExtractor={item => item.id}
                            />
                        ) : (
                            <View>
                                <Text>Não existe agendamento</Text>
                            </View>
                        )
                    }
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      flex: 1
    },
    resposta:{
        color: '#636e72',
        marginHorizontal: 12
    },
    titulo:{
        fontWeight: 'bold',
        color: '#2f3640',
        marginHorizontal: 3,
    },
    nome:{
        fontWeight: 'bold',
        color: '#2f3640',
        fontSize: 24
    },
    agenda:{
        fontWeight: 'bold',
        color: '#2f3640',
        margin: 22,
        fontSize: 18
    }

})
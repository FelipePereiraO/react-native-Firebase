import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native'
import {db} from "../services/Firebase"
import {ref, set, update, onValue, orderByChild, startAt, endAt, startAfter, query, limitToFirst } from "firebase/database"
import Ionicons from '@expo/vector-icons/Ionicons';

export function AttendanceSelect({navigation, route}){
    const [client, setClient] = useState(route.params)
    const [status, setStatus] = useState(route.params.atendimento.status)

    function UpdateAtendimento(atendimento, type){
        update(ref(db, 'atendimentos/0/'+atendimento.id+'/0/atendimento/0/'+atendimento.idAtendimento),{
            status: type
        }).then(() =>{
            setStatus(1)
            alert("Update")
        }).catch((error) =>{
            alert(error)
        })
    
    }

    function Maps(){
        const url = Platform.select({
            ios: `maps:0,0?q=${client.atendimento.endereco}`,
            android: `geo:0,0?q=${client.atendimento.endereco}`,
          })
          
          Linking.openURL(url)
    }

    function Tel(){
       Linking.openURL("tel:"+client.atendimento.telefone)
    }
    return(
        <View style={styles.container}>

        <View style={[styles.card, styles.shadowProp]}>
            <View style={{backgroundColor: status == 1 ? "#2ecc71" : "#e74c3c", height: 25, width: 95, justifyContent: 'center', alignItems: 'center', borderRadius: 8}}>
                <Text style={{fontWeight: 'bold', color: '#fff'}}>{status == 1 ? "Atendido" : "Não atendido"}</Text>
            </View>
            <View style={{margin: 12}}>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>{client.atendimento.nome}</Text>
                <Text style={{fontSize: 15}}>Endereço: {client.atendimento.endereco}</Text>
                <Text style={{fontSize: 15}}>Marcado para: {client.atendimento.data} as {client.atendimento.hora}</Text>
            </View>

            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity
                    style={styles.buttonWP}
                    onPress={() => Linking.canOpenURL("whatsapp://send?text=oi").then(supported => {
                        if (supported) {
                            return Linking.openURL(
                                "whatsapp://send?phone="+client.atendimento.telefone+"&text=Oi"
                            );
                        } else {
                        return Linking.openURL(
                            "https://api.whatsapp.com/send?phone="+client.atendimento.telefone+"1&text=Oi"
                        );
                        }
                    })
                }>
                    <Ionicons name="logo-whatsapp" size={25} color='#fff'/>
                    <Text style={{fontWeight: 'bold', color: 'white'}}>
                        WhatsApp
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonMap}
                    onPress={() => Maps()}
                >
                    <Ionicons name="map" size={25} color='#fff'/>
                    <Text style={{fontWeight: 'bold', color: 'white'}}>
                        Mapa
                    </Text>
                </TouchableOpacity>   
                         
            </View>
            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity
                    style={styles.buttonTel}
                    onPress={() => Tel()}
                >
                    <Ionicons name="call" size={25} color='#fff'/>
                    <Text style={{fontWeight: 'bold', color: 'white'}}>
                        Ligar
                    </Text>
                </TouchableOpacity>   
            </View>
   
        </View>
        {
            status == 1 ? (
                <></>
            ) : (
                <>
                    <TouchableOpacity style={styles.buttonCancel}>    
                        <Text style={{fontWeight: 'bold', color: 'white'}} onPress={() => UpdateAtendimento(client.atendimento, 2)}>Cancelar</Text>
                    </TouchableOpacity>    
                    <TouchableOpacity style={styles.buttonNext} onPress={() => UpdateAtendimento(client.atendimento, 1)}>
                        <Text style={{fontWeight: 'bold', color: 'white'}}>Cliente Atendido</Text>
                    </TouchableOpacity>                     
                </>
            )
        }

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f3f6',
 

    },
    buttonWP:{
        height: 60,
        width: '45%',
        backgroundColor: "#4cd137",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5
    },
    buttonMap:{
        height: 60,
        width: '45%',
        backgroundColor: "#487eb0",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5
    },
    buttonTel:{
        height: 60,
        width: '93%',
        backgroundColor: "#78e08f",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5
    },
    buttonNext:{
        height: 60,
        width: 160,
        backgroundColor: "#2ecc71",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 12,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        right: 0

    },
    buttonCancel:{
        height: 60,
        width: 160,
        backgroundColor: "#e74c3c",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 12,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    card:{
        padding: 20,

    },
    shadowProp: {

      },
  });
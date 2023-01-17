import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native'
import {db} from "../services/Firebase"
import {ref, set, update, onValue, orderByChild, startAt, endAt, startAfter, query, limitToFirst } from "firebase/database"
import Ionicons from '@expo/vector-icons/Ionicons';

export function AttendanceSelect({navigation, route}){
    const [client, setClient] = useState(route.params)
    console.log(route.params)


    function UpdateAtendimento(id){

        update(ref(db, 'atendimento/'+id),{
            atendimento: 1
        }).then(() =>{
            alert("Update")
        }).catch((error) =>{
            alert(error)
        })
    
    }

    function Maps(){
        const url = Platform.select({
            ios: `maps:0,0?q=${client.cliente.endereco}`,
            android: `geo:0,0?q=${client.cliente.endereco}`,
          })
          
          Linking.openURL(url)
    }

    function Tel(){
       Linking.openURL("tel:"+client.cliente.telefone)
    }
    return(
        <View style={styles.container}>

        <View style={[styles.card, styles.shadowProp]}>
            <View style={{backgroundColor: client.atendimento.atendimento == 1 ? "#2ecc71" : "#e74c3c", height: 25, width: 95, justifyContent: 'center', alignItems: 'center', borderRadius: 8}}>
                <Text style={{fontWeight: 'bold', color: '#fff'}}>{client.atendimento.atendimento == 1 ? "Atendido" : "Não atendido"}</Text>
            </View>
            <View style={{margin: 12}}>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>{client.cliente.nome}</Text>
                <Text style={{fontSize: 15}}>Endereço: {client.cliente.endereco}</Text>
                <Text style={{fontSize: 15}}>Marcado para: {client.atendimento.data} as {client.atendimento.hora}</Text>
            </View>

            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity
                    style={styles.buttonWP}
                    onPress={() => Linking.canOpenURL("whatsapp://send?text=oi").then(supported => {
                        if (supported) {
                            return Linking.openURL(
                                "whatsapp://send?phone="+client.cliente.telefone+"&text=Oi"
                            );
                        } else {
                        return Linking.openURL(
                            "https://api.whatsapp.com/send?phone="+client.cliente.telefone+"1&text=Oi"
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
        {
            client.atendimento.atendimento == 1 ? (
                <></>
            ) : (
                <>
                    <TouchableOpacity style={styles.buttonCancel}>    
                        <Text style={{fontWeight: 'bold', color: 'white'}}>Cancelar</Text>
                    </TouchableOpacity>    
                    <TouchableOpacity style={styles.buttonNext} onPress={() => UpdateAtendimento(client.atendimento.id)}>
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
        width: 160,
        backgroundColor: "#4cd137",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5
    },
    buttonMap:{
        height: 60,
        width: 160,
        backgroundColor: "#487eb0",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5
    },
    buttonTel:{
        height: 60,
        width: 325,
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
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 25
    },
    shadowProp: {
        elevation: 13,
        shadowColor: '#52006A',
      },
  });
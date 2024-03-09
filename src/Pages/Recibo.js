import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Linking, ViewBase, FlatList, Platform, Share } from 'react-native'
import {db} from "../services/Firebase"
import {ref, set, update, onValue, orderByChild, startAt, endAt, startAfter, query, limitToFirst } from "firebase/database"
import Ionicons from '@expo/vector-icons/Ionicons';
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'


export function Recibo({navigation, route}){
    const [client, setClient] = useState(route.params.atendimento)
    const viewReef = useRef()

    const createPdf = async () =>{
        try{
            const uri = await captureRef(viewReef,{
                format: 'png',
                quality: 0.5
            })
            if(Platform.OS === 'ios'){
                const fileBase64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
            
                // Salva a imagem localmente
                const localUri = `${FileSystem.documentDirectory}imagem.png`;
                await FileSystem.writeAsStringAsync(localUri, fileBase64, { encoding: FileSystem.EncodingType.Base64 });
    
                // Compartilha o URI do arquivo local
                await Sharing.shareAsync(localUri);
            }
            await Sharing.shareAsync(uri)
        }catch(err){
            console.error(err)
        }
    }
    return(
        <View>
            <View style={{alignItems: 'center'}}>
                <TouchableOpacity style={styles.share} onPress={() => createPdf()}>
                    <Ionicons name="share-outline" size={25} color='#fff'/>

                </TouchableOpacity>                   
            </View>
  
        {
            client ? (
            <ViewShot ref={viewReef}>
                <View style={styles.recibo}>
                    <View style={styles.reciboHeader}>
                        <Text style={{fontWeight: 'bold', color: 'white', fontSize: 25}}>R E C I B O</Text>
                    </View>
                    <View style={{margin: 15}}>
                        <View>
                            <Text style={{fontStyle:'italic', color: '#525252'}}>Cod: {client.atendimento.id}</Text>
                            <View style={{margin: 10}}>
                                <Text style={{fontWeight: 'bold'}}>Cliente:</Text>
                                <Text>{client.atendimento.nome}</Text>
                                <Text>{client.atendimento.endereco}</Text>
                                <Text style={{fontWeight: 'bold', marginTop: 5}}>Serviço:</Text>
                                <View style={{marginHorizontal: 6}}>
                                    <Text>{client.atendimento.servico}</Text>
                                    <Text style={{fontWeight: 'bold'}}>Data:</Text>
                                    <Text>{client.atendimento.data}</Text>
                                    <Text style={{fontWeight: 'bold'}}>Garantia:</Text>
                                    <Text>{client.atendimento.tempo_garantia} meses</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.reciboLinear}></View>
                        <View style={styles.reciboValor}>
                            <Text style={{margin: 10, fontWeight: 'bold', fontSize: 19}}>Total do recibo</Text>
                            <Text style={{margin: 10, fontWeight: 'bold', fontSize: 19}}>R$ {client.atendimento.valor}</Text>
                        </View>
                        <View style={styles.reciboLinear}></View>
                        <View style={{margin: 10}}>
                            <Text style={{fontWeight: 'bold'}}>Atendido por:</Text>
                            <Text style={{margin: 4}} >Paulo Junior</Text>
                        </View>
                    </View> 
                </View>
            </ViewShot>
            ) :(<></>)     
        }       
        </View>

    )
}

const styles = StyleSheet.create({
    recibo:{
        marginHorizontal: 25,
        backgroundColor: 'white'
    },
    reciboHeader:{
        backgroundColor: "#6c5ce7",
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,

    },
    reciboValor:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
    },
    reciboLinear:{
        width: "100%",
        backgroundColor: '#95a5a6',
        height: 1,
        marginTop: 10
    },
    share:{
        height: 50,
        width: 50,
        backgroundColor: "#6c5ce7",
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
        flexDirection: 'row',
        
    }
  });
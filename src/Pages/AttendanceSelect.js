import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Linking, ViewBase, FlatList, Platform, Share, Alert } from 'react-native'
import {db} from "../services/Firebase"
import {ref, set, update, onValue, orderByChild, startAt, endAt, startAfter, query, limitToFirst } from "firebase/database"
import Ionicons from '@expo/vector-icons/Ionicons';
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
import { Actionsheet, AlertDialog, Box, Button, Center, Icon, NativeBaseProvider, useDisclose } from "native-base";
import Toast from 'react-native-toast-message';
import Modal from "./Component/Modal";

export function AttendanceSelect({navigation, route}){
    const [client, setClient] = useState(route.params)
    console.log(route.params);
    const [status, setStatus] = useState(route.params.atendimento.status)
    const [atendido, setAtendido] = useState(true);
    const [servico, setServico] = useState('')
    const [garantia, setGarantia] = useState(0)
    const [formaP, setFormaP] = useState(0)
    const [valor, setValor] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isOpens, setIsOpen] = useState(false);
    const [isOpensCancel, setIsOpenCancel] = useState(false);
    const onCloses = () => setIsOpen(false);
    const cancelRef = useRef(null);

    var formasPagamento = [
        {
            id: 1,
            nome: "Dinheiro",
            icon: "cash"
        },
        {
            id: 2,
            nome: "Pix",
            icon: "qr-code"
        },
        {
            id: 3,
            nome: "Cartão",
            icon: "card"
        }
    ]
    
    const viewReef = useRef()
    const createPdf = async () =>{
        try{
            const uri = await captureRef(viewReef,{
                format: 'png',
                quality: 0.5
            })
            if(Platform.OS === 'ios'){
                const fileBase64 = await FileSystem.readAsStringAsync(uri, {encoding: 'base64'})
                await Share.share({
                    url: `data:image/png;base64, ${fileBase64}`
                })
                return
            }
            await Sharing.shareAsync(uri)
        }catch(err){

        }
    }
        const {
          isOpen,
          onOpen,
          onClose
        } = useDisclose();    

    function UpdateAtendimento(atendimento, type){
        if(servico != "" && valor != 0 && formaP != 0){
            update(ref(db, 'atendimentos/0/'+atendimento.id+'/0/atendimento/0/'+atendimento.idAtendimento),{
                status: type,
                servico: servico,
                valor: valor,
                tipo_pagamento: formaP,
                tempo_garantia: garantia
            }).then(() =>{
                onClose(onClose)
                setStatus(1)
                setIsOpen(false)
                setAtendido(true);
                const Obj = {...client}
                Obj.atendimento.servico = servico
                Obj.atendimento.tipo_pagamento = formaP
                Obj.atendimento.valor = valor
                Obj.atendimento.tempo_garantia = garantia
                setClient(Obj)
                if(type == 1){
                    Toast.show({
                        type: 'success',
                        text1: 'Atendimento',
                        text2: 'Atendimento confirmado com sucesso!',
                        //visibilityTime: 100000
                    });                
                }
            }).catch((error) =>{
                Toast.show({
                    type: 'error',
                    text1: 'Atendimento',
                    text2: 'Atendimento não confirmado!'
                });
            })
        }else{
            setIsOpen(!isOpen)
            alert("Peencha o formulário");
        }
    }

    function CancelarAtendimento(atendimento, type){
        setIsOpenCancel(false)
        update(ref(db, 'atendimentos/0/'+atendimento.id+'/0/atendimento/0/'+atendimento.idAtendimento),{
            status: type
        }).then(() =>{
            onClose(onClose)
            setStatus(2)
            Toast.show({
                type: 'success',
                text1: 'Atendimento',
                text2: 'Atendimento cancelado com sucesso!',
                //visibilityTime: 100000
            });                
            
        }).catch((error) =>{
            Toast.show({
                type: 'error',
                text1: 'Atendimento',
                text2: 'Atendimento não cancelado!'
            });
        })
    }

    async function Maps(){
        const url = `https://waze.com/ul?q=${encodeURIComponent(client.atendimento.endereco)}`;
        const supported = await Linking.canOpenURL(url);
        
        if (supported) {
          Linking.openURL(url)
            .catch(err => console.error('Erro ao abrir o Waze:', err));
        } else {
          Alert.alert('Waze não instalado', 'Deseja abrir no Google Maps ou Apple Maps?', [
            {
              text: 'Google Maps',
              onPress: () => openGoogleMaps(client.atendimento.endereco)
            },
            {
              text: 'Apple Maps',
              onPress: () => openAppleMaps(client.atendimento.endereco)
            },
            {
              text: 'Cancelar',
              onPress: () => console.log('Cancelado')
            }
          ]);
        }
        //   let url = '';
        //   if (Platform.OS === 'ios') {
        //     url = `https://waze.com/ul?q=${encodeURIComponent(client.atendimento.endereco)}`;
        // } else {
        //     url = `geo:0,0?q=${encodeURIComponent(client.atendimento.endereco)}`;
        //   }
        //   Linking.openURL(url).catch(error => {
        //     console.error('Erro ao abrir a URL:', error);
        // });
    }

    const openGoogleMaps = (address) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        Linking.openURL(url)
          .catch(err => console.error('Erro ao abrir o Google Maps:', err));
      };
      
      const openAppleMaps = (address) => {
        const url = `http://maps.apple.com/?q=${encodeURIComponent(address)}`;
        Linking.openURL(url)
          .catch(err => console.error('Erro ao abrir o Apple Maps:', err));
      };
      

    function Tel(){
       Linking.openURL("tel:"+client.atendimento.telefone)
    }

    const enviarMensagemParaWhatsApp = (numero, mensagem) => {
        const numeroWhatsApp = `whatsapp://send?phone=${numero}&text=${mensagem}`;
        
        if (Platform.OS === 'ios') {
          Linking.openURL(`https://wa.me/${numero}?text=${mensagem}`);
        } else {
          Linking.openURL(numeroWhatsApp);
        }
    }
    const handleTextChange = (text) => {
        const cleanValue = text.replace(/[^0-9]/g, '');

        // Converte o valor para centavos
        const centsValue = parseInt(cleanValue) / 100;
    
        // Formata o valor como uma string de moeda brasileira
        const formattedValue = `${centsValue.toFixed(2).replace('.', ',')}`;
    
        setValor(formattedValue);

    };
    const SelectCliente = (client) =>{
        setSelectedItem(client)
        setFormaP(client.id)
    }
 
    
    const Item = ({item}) => (
        <TouchableOpacity
            onPress={() => SelectCliente(item)}
            style={{backgroundColor: selectedItem ? selectedItem.id == item.id ? "#2ecc71" : "#f5f6fa" : "#f5f6fa", height: 70, width: 70, padding: 6,margin: 5, borderRadius: 8, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <Ionicons name={item.icon} size={32} color="black"/>
                <Text style={styles.nome}>{item.nome}</Text>
            </View>
        </TouchableOpacity>
    );
    return(
            atendido ? (
                <NativeBaseProvider>
                <View style={styles.container}>
                <View style={[styles.card, styles.shadowProp]}>
                    <View style={{backgroundColor: status == 1 ? "#2ecc71" : status == 2 ? "#e74c3c" : "#f7b731", height: 25, width: 95, justifyContent: 'center', alignItems: 'center', borderRadius: 8}}>
                        <Text style={{fontWeight: 'bold', color: '#fff'}}>{status == 1 ? "Atendido" : status == 2 ? "Cancelado" : "Não atendido"}</Text>
                    </View>
                    <View style={{position: 'absolute', right: 10}}>
                        <TouchableOpacity style={styles.btnInfo} onPress={onOpen}><Ionicons name="ellipsis-horizontal" size={25} color="black"/></TouchableOpacity>
                    </View>
                    <View style={{margin: 12}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>{client.atendimento.nome}</Text>
                        <Text style={{fontSize: 15}}>Endereço: {client.atendimento.endereco}</Text>
                        <Text style={{fontSize: 15}}>Marcado para: {client.atendimento.data} as {client.atendimento.hora}</Text>                            
                    </View>
                        <Actionsheet isOpen={isOpen} onClose={onClose}>
                            <Actionsheet.Content>
                                <Actionsheet.Item onPress={() => setAtendido(!atendido)} startIcon={<Ionicons name="checkmark-sharp" size={25} color="black"/>} isDisabled={status != '0'}>Confirmar Atendimento</Actionsheet.Item>
                                <Actionsheet.Item onPress={() => navigation.navigate("Editar Atendimento", {atendimento: client})} startIcon={<Ionicons name="create" size={25} color="black"/>} >Editar</Actionsheet.Item>
                                <Actionsheet.Item onPress={() => setIsOpenCancel(!isOpensCancel)} startIcon={<Ionicons name="close" size={25} color="black"/>} isDisabled={status != '0'}>Cancelar</Actionsheet.Item>
                                <Actionsheet.Item startIcon={<Ionicons name="trash" size={25} color="black"/>} >Excluir</Actionsheet.Item>
                            </Actionsheet.Content>
                        </Actionsheet>
                        {isOpensCancel ?
                            <Modal Text={"Deseja cancelar este atendimento?"} onComfirm={() => CancelarAtendimento(client.atendimento, 2)} onCancel={() => setIsOpenCancel(false)}/>
                        : <></>}
                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableOpacity
                            style={styles.buttonWP}
                            onPress={() => enviarMensagemParaWhatsApp(client.atendimento.telefone, "Olá")}
                        >
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
                    {
                        status == 1 ? (
                            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                                <TouchableOpacity
                                    style={styles.buttonShare}
                                    onPress={() => navigation.navigate("Recibo", {atendimento: client})}
                                >
                                    <Ionicons name="document-text" size={25} color='#fff'/>
                                    <Text style={{fontWeight: 'bold', color: 'white'}}>
                                        Gerar Recibo
                                    </Text>
                                </TouchableOpacity>   
                            </View>                            
                        ) : (<></>)
                    }
                    
                </View>
                {/* {
                    status == 1 ? (
                        <></>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.buttonCancel}>    
                                <Text style={{fontWeight: 'bold', color: 'white'}} onPress={() => UpdateAtendimento(client.atendimento, 2)}>Cancelar</Text>
                            </TouchableOpacity>    
                            <TouchableOpacity style={styles.buttonNext} onPress={() => setAtendido(!atendido)}>
                                <Text style={{fontWeight: 'bold', color: 'white'}}>Cliente Atendido</Text>
                            </TouchableOpacity>                     
                        </>
                    )
                } */}
                </View>
                </NativeBaseProvider>
            ) : (
                <NativeBaseProvider>
                    <View style={styles.container}>
                        <ScrollView style={[styles.card, styles.shadowProp]}>
                            <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Serviço:</Text>
                            <View style={styles.backgorundInputArea}>
                                <TextInput style={{marginHorizontal: 8, width: '100%', height: 100}} multiline={true} numberOfLines={5}  placeholder='O que foi feito' id='servico' value={servico} onChangeText={value => setServico(value)}/>     
                            </View> 
                            <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Garantia:</Text>
                            <View style={styles.backgorundInput}>
                                <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} keyboardType="numeric" placeholder='Digite a quantidade de meses' id='desconto' value={garantia} onChangeText={value => setGarantia(value)}/>     
                            </View> 
                            <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Valor do Serviço:</Text>
                            <View style={styles.backgorundInput}>
                                <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} keyboardType="numeric" placeholder='R$ 0,00' id='valor' value={valor} onChangeText={handleTextChange}/>     
                            </View>                         
                            <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Forma de Pagamento:</Text>
                            <FlatList
                                data={formasPagamento}
                                renderItem={({item}) => <Item item={item} />}
                                scrollEnabled={false}
                                keyExtractor={item => item.id}
                                horizontal
                            />
                        </ScrollView>
                        <>
                            <TouchableOpacity style={styles.buttonBack}>    
                                <Text style={{fontWeight: 'bold', color: 'black'}} onPress={() => setAtendido(!atendido)}>Voltar</Text>
                            </TouchableOpacity>    
                            <TouchableOpacity style={styles.buttonNext} onPress={() => setIsOpen(!isOpens)}>
                                <Text style={{fontWeight: 'bold', color: 'white'}}>Confirmar</Text>
                            </TouchableOpacity>                     
                        </>
                        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpens} onClose={onCloses}>
                            <AlertDialog.Content>
                                <AlertDialog.CloseButton />
                                <AlertDialog.Header>Aviso</AlertDialog.Header>
                                <AlertDialog.Body>
                                    Deseja confirmar atendimento ?
                                </AlertDialog.Body>
                                <AlertDialog.Footer>
                                    <Button.Group space={2}>
                                    <Button variant="unstyled" colorScheme="coolGray" onPress={onCloses} ref={cancelRef}>
                                        Não
                                    </Button>
                                    <Button style={{backgroundColor: '#2ecc71'}} onPress={() => UpdateAtendimento(client.atendimento, 1)}>
                                        Sim
                                    </Button>
                                    </Button.Group>
                                </AlertDialog.Footer>
                            </AlertDialog.Content>
                        </AlertDialog>
                    </View>
                </NativeBaseProvider>
            )
        

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
        opacity: 0.76,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 3.84,
        elevation: 6,

    },
    buttonMap:{
        height: 60,
        width: '45%',
        backgroundColor: "#487eb0",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 10,
        elevation: 6,
    },
    buttonTel:{
        height: 60,
        width: '93%',
        backgroundColor: "#78e08f",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 10,
        elevation: 6,
    },
    shadowProp:{
        margin: 10
    },
    buttonShare:{
        height: 60,
        width: '93%',
        backgroundColor: "#737373",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5
    },
    buttonNext:{
        height: 40,
        width: 160,
        backgroundColor: "#2ecc71",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        right: 0

    },
    buttonCancel:{
        height: 40,
        width: 160,
        backgroundColor: "#e74c3c",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    buttonBack:{
        height: 40,
        width: 160,
        backgroundColor: "#dcdde1",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        flexDirection: 'row',
        //position: 'absolute',
        bottom: 0,
        left: 0
    },
    card:{
        paddingHorizontal: 20,
        

    },
    backgorundInput:{
        borderColor: '#dcdde1',
        borderWidth: 1,
        backgroundColor: '#f5f6fa',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        height: 50,
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
    btnInfo:{
        height: 50,
        width: 50,
        backgroundColor: '#dcdde1',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 10,
        elevation: 6,
    }
  });
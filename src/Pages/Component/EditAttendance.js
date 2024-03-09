import React, { useEffect, useRef, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker"
import { StyleSheet, TouchableOpacity, Text, View, TextInput, Platform} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import Modal from "./Modal";
import { ref, update } from "firebase/database";
import { db } from "../../services/Firebase";
import { NativeBaseProvider } from "native-base";



export default function EditAttendance({navigation, route}){
   // console.log(route.params.atendimento.atendimento)
    const [dados, setDados] = useState(route.params.atendimento.atendimento)
    const [hours, setHours] = useState(route.params.atendimento.atendimento.hora)
    const [showDate, setShowDate] = useState(false)
    const [mode, setMode] = useState("")
    const [dateAttendance, setDateAttendance] = useState(route.params.atendimento.atendimento.data)
    const [description, setDescription] = useState(route.params.atendimento.atendimento.descricao)
    const [date, setDate] = useState(new Date())
    const [isOpensCancel, setIsOpenCancel] = useState(false);

    const onChangeDate = (event, selectedDate) =>{
        const currentDate = selectedDate || date;
   
        setDate(currentDate)
        setShowDate(Platform.OS === 'ios');
        let tempDate = new Date(currentDate)
        console.log(tempDate);

        let fDate = tempDate.getDate() +'/'+(tempDate.getMonth() + 1)+'/'+tempDate.getFullYear();
        let fTime = tempDate.getHours()+':'+tempDate.getMinutes();
        setDateAttendance(fDate)
        setHours(fTime)
        setShowDate(false)
    }

    const showDateDialog = (currentMode) =>{
        setShowDate(true)
        setMode(currentMode)
    }

    const Editar = (atendimento) =>{
        setIsOpenCancel(false)


        update(ref(db, 'atendimentos/0/' + atendimento.id + '/0/atendimento/0/' + atendimento.idAtendimento), {
            descricao: description,
            data: dateAttendance,
            hora: hours
        }).then(() => {
            route.params.atendimento.atendimento.hora = hours
            route.params.atendimento.atendimento.data = dateAttendance
            route.params.atendimento.atendimento.descricao = description
            console.log(route.params.atendimento.atendimento)
            //navigation.setParams({ atendimento: route.params.atendimento.atendimento});
            
            Toast.show({
                type: 'success',
                text1: 'Atendimento',
                text2: 'Atendimento atualizado com sucesso!',
                //visibilityTime: 100000
            });
            navigation.goBack();
        }).catch((error) => {
            Toast.show({
                type: 'error',
                text1: 'Atendimento',
                text2: 'Atendimento não atualizado!'
            });
        })
    }
        
    
    
    return(
        <NativeBaseProvider>
            <View style={{margin: 12}}>
                {
                    Platform.OS == 'ios' ? (
                        <>
                            <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Data do atendimento</Text>
                            <TouchableOpacity style={styles.backgorundInput} onPress={() => showDateDialog('date')}>
                                <Ionicons name="calendar" size={20} color='#bdc3c7'/>
                                <DateTimePicker
                                        testeID="dateTimePicker"
                                        value={date}
                                        mode={'date'}
                                        is24Hour={true}
                                        display='default'
                                        onChange={onChangeDate}
                                    />
                            </TouchableOpacity> 

                            <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Hora do atendimento</Text>
                            <TouchableOpacity style={styles.backgorundInput} onPress={() => showDateDialog('time')}>
                                <Ionicons name="alarm" size={20} color='#bdc3c7'/>
                                <DateTimePicker
                                        testeID="dateTimePicker"
                                        value={date}
                                        mode={'time'}
                                        is24Hour={true}
                                        display='default'
                                        onChange={onChangeDate}
                                    />
                            </TouchableOpacity>  
                            {
                                showDate && (
                                    <DateTimePicker
                                        testeID="dateTimePicker"
                                        value={date}
                                        mode={mode}
                                        is24Hour={true}
                                        display='default'
                                        onChange={onChangeDate}
                                    />
                                )
                            }  
                        </>
                    ) : (
                        <>
                            <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Data do atendimento</Text>
                            <TouchableOpacity style={styles.backgorundInput} onPress={() => showDateDialog('date')}>
                                <Ionicons name="calendar" size={20} color='#bdc3c7'/>
                                <Text style={{marginHorizontal: 8, width: '100%', height: 50, padding: 15}}>{dateAttendance}</Text>
                            </TouchableOpacity> 

                            <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Hora do atendimento</Text>
                            <TouchableOpacity style={styles.backgorundInput} onPress={() => showDateDialog('time')}>
                                <Ionicons name="alarm" size={20} color='#bdc3c7'/>
                                <Text style={{marginHorizontal: 8, width: '100%', height: 50, padding: 15}}>{hours}</Text>
                            </TouchableOpacity>  
                            {
                                showDate && (
                                    <DateTimePicker
                                        testeID="dateTimePicker"
                                        value={date}
                                        mode={mode}
                                        is24Hour={true}
                                        display='default'
                                        onChange={onChangeDate}
                                    />
                                )
                            }  
                        </>
                    )
                }
                {isOpensCancel ?
                    <Modal Text={"Deseja atualizar este atendimento?"} onComfirm={() => Editar(dados)} onCancel={() => setIsOpenCancel(false)}/>
                : <></>}
                <View >
                    <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Descrição</Text>
                    <View style={styles.backgorundInputArea}>
                        <TextInput style={{ width: '100%', height: 130}} multiline={true} numberOfLines={5} placeholder='Deixe uma obeservação sobre o atendimento' id='description' value={description} onChangeText={value => setDescription(value)}/>                              
                    </View> 
                </View>
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
    logo:{
        fontSize: 35,
        fontWeight: 'bold',
        color: "#6c5ce7"
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
        fontWeight: 'bold'
    },
    endereco:{
        fontSize: 12
    }
  });
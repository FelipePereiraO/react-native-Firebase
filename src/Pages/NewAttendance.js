import React, {useState} from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from "@react-native-community/datetimepicker"
export function NewAttendance({navigation}){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [date, setDate] = useState(new Date())
    const [dateAttendance, setDateAttendance] = useState("00/00/0000")
    const [hours, setHours] = useState("00:00")
    const [showDate, setShowDate] = useState(false)
    const [mode, setMode] = useState("")
    const [cliente, setCliente] = useState(true)
    const [clienteComplet, setClientComplet] = useState(true)
    const [calendar, setCalendar] = useState(false)
    const [calendarComplet, setCalendarComplet] = useState(false)
    const [service, setService] = useState(false)
    const [isEnabled, setIsEnabled] = useState(false)

    const onChangeDate = (event, selectedDate) =>{
        const currentDate = selectedDate || date;
        const platform = Platform.select({
            ios: 'ios',
            android: 'android'
        })
        setDate(currentDate)

        let tempDate = new Date(currentDate)
        let fDate = tempDate.getDate() +'/'+(tempDate.getMonth() + 1)+'/'+tempDate.getFullYear();
        let fTime = tempDate.getHours()+':'+tempDate.getMinutes();
        setDateAttendance(fDate)
        setHours(fTime)
        setShowDate(false)
    }

    function Etapas(){
        if(cliente == true){
            setCalendarComplet(true)
            setCalendar(true)
            setCliente(false)
        }else if(calendar == true){
            setCalendar(false)
            setService(true)
        }
    }

    function onChangeSwitch(){
        setIsEnabled(previousState => !previousState)
    }

    const showDateDialog = (currentMode) =>{
        setShowDate(true)
        setMode(currentMode)
    }
    return (
        <View style={styles.container}>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 22}}>
                    <Ionicons name="person" size={30} color={ clienteComplet ? '#2ecc71' : '#bdc3c7'}/>
                    <View style={{height: 5, width: 80, backgroundColor: calendarComplet ? '#2ecc71' : '#bdc3c7', margin: 15}}></View>
                    <Ionicons name="calendar" size={30} color={calendarComplet ? '#2ecc71' : '#bdc3c7'}/>
                    <View style={{height: 5, width: 80, backgroundColor: service ? '#2ecc71' : '#bdc3c7', margin: 15}}></View>
                    <Ionicons name="build" size={30} color={service ? '#2ecc71' : '#bdc3c7'}/>
                </View>
                <View style={styles.inputs}>
                {
                    cliente && (
                        <ScrollView style={{margin: 12}}>
                            <Text>Cliente</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{margin: 15, fontWeight: 'bold', color: "#6c5ce7"}}>O cliente existe?</Text>
                                <Switch
                                trackColor={{ false: "#bdc3c7", true: "#6c5ce7"}}
                                thumbColor={!isEnabled ? "#bdc3c7" : "#6c5ce7"}
                                onValueChange={onChangeSwitch}
                                value={isEnabled}
                                />
                            </View>

                            {
                                !isEnabled ? 
                                    <View>

                                        <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Nome</Text>
                                        <View style={styles.backgorundInput}>
                                            <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} placeholder='Nome do cliente' id='email' value={email} onChangeText={value => setEmail(value)}/>                              
                                        </View>     
                                        <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Bairro</Text>
                                        <View style={styles.backgorundInput}>
                                            <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} placeholder='Bairro' id='bairro' value={email} onChangeText={value => setEmail(value)}/>                              
                                        </View>   
                                        <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Rua</Text>
                                        <View style={styles.backgorundInput}>
                                            <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} placeholder='Rua' id='Rua' value={email} onChangeText={value => setEmail(value)}/>                              
                                        </View> 
                                        <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>N°</Text>
                                        <View style={styles.backgorundInput}>
                                            <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} placeholder='Rua' id='Rua' value={email} onChangeText={value => setEmail(value)}/>                              
                                        </View>    
                                        
                                           

                                    </View>
                                    : 
                                    <View>
                                        
                                    </View>
                            } 


                                    

                        </ScrollView>
                    )
                }
                {
                    calendar && (
                        <View style={{margin: 12}}>
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
                        </View>
                    )
                }
                {
                    service && (
                        <View style={{margin: 12}}>
                            <Text>Service</Text>
                        </View>
                    )
                }
                

                </View>
                <TouchableOpacity style={styles.button} onPress={() => Etapas()}>
                    <Text>Proximo</Text>
                </TouchableOpacity>
        </View>
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    backgorundInput:{
        borderColor: '#dcdde1',
        borderWidth: 1,
        backgroundColor: '#f5f6fa',
        flexDirection: 'row',
        alignItems: 'center',
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
        height: 40,
        width: 150,
        margin: 10,
        backgroundColor: "#6c5ce7",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0, 
        right: 0
    }
  });
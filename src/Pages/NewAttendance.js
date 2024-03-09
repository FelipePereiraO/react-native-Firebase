import React, {useState} from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, ScrollView, FlatList, Alert, Platform } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from "@react-native-community/datetimepicker"
import {db} from "../services/Firebase"
import { get, push, ref, set, update } from "firebase/database";
import { useNavigation } from '@react-navigation/native';



export function NewAttendance({navigation}){
    const [nome, setNome] = useState("")
    const [nomeExiste, setNomeExiste] = useState("")
    const [bairro, setBairro] = useState("")
    const [rua, setRua] = useState("")
    const [number, setNumber] = useState("")
    const [telefone, setTelefone] = useState("")

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
    const [description, setDescription] = useState('')
    const [isEnabled, setIsEnabled] = useState(false)

    const [clientes, setClientes] = useState([])
    const [filter, setFilter] = useState([])
    const [clienteSelected, setClienteSelected] = useState([])
    const [selectedItem, setSelectedItem] = useState(null);


    const SaveClient = () =>{
        push(ref(db, 'atendimentos/0'), [
            {
                "nome": nome,
                "endereco": bairro+" - "+rua+" - "+number,
                "telefone": telefone,     
                "atendimento":[
                    {
                        "PrimaryAttedance":{
                            "data": dateAttendance,
                            "hora": hours,
                            "descricao": description,
                            "status": 0,
                            "servico": "",
                            "tempo_garantia": 0,
                            "tipo_pagamento": 0,
                            "valor": "0,00"
                        }
                    }
                ]    
            }
        ])
        .then((data) => {
            Alert.alert("Alerta!","Novo atendimento criado com sucesso.", [{ 
                text: 'Confirmar',
                onPress: () =>{
                    navigation.goBack()
                }
            }])
        })
        .catch((error) => {
            console.log(error)
        });
    }


    const SaveNewAttendace = (key) =>{
        push(ref(db, 'atendimentos/0/'+key+'/0/atendimento/0'),
        {
            "data": dateAttendance,
            "hora": hours,
            "descricao": description,
            "status": 0,
            "servico": "",
            "tempo_garantia": 0,
            "tipo_pagamento": 0,
            "valor": "0,00"
        }
        ).then(() =>{
            Alert.alert("Alerta!","Novo atendimento criado com sucesso.", [{ 
                text: 'Confirmar',
                onPress: () =>{
                    navigation.goBack()
                }
            }])
        }).catch((error) =>{
            alert(error)
        })
    }

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
                            endereco: objeto.endereco
                        }
                    }
                });
            }).flat();   
            setClientes(novoArray)
            setFilter(novoArray)
        })
    }

    const onChangeDate = (event, selectedDate) =>{
        const currentDate = selectedDate || date;
        // const platform = Platform.select({
        //     ios: 'ios',
        //     android: 'android'
        // })
        setDate(currentDate)

        let tempDate = new Date(currentDate)
        let fDate = tempDate.getDate() +'/'+(tempDate.getMonth() + 1)+'/'+tempDate.getFullYear();
        let fTime = tempDate.getHours()+':'+tempDate.getMinutes();
        setDateAttendance(fDate)
        setHours(fTime)
        setShowDate(false)
    }

    function Etapas(){
        if(nome != "" && telefone != "" && bairro != "" && rua != "" && number != "" || isEnabled){
            if(selectedItem || !isEnabled){
                if(cliente == true){
                    setCalendarComplet(true)
                    setCalendar(true)
                    setCliente(false)
                }else if(calendar == true){
                    setCalendar(false)
                    setService(true)
                }else if(description != ''){
                    if(!isEnabled){
                        SaveClient()
                    }else{
                        SaveNewAttendace(selectedItem.id)
                    }
                    
                }                
            }else{
                alert("Selecione um Cliente.")
            }

        }else{
            alert("Preencha todos os campos")
        }

    }

    function onHandleClient(value){
        setNomeExiste(value)
        if(value != ""){
            const ft = clientes.filter(item => item.nome.includes(value))
            setFilter(ft);
        }else{
            setFilter(clientes)
        }

    }

    function onChangeSwitch(){
        setIsEnabled(previousState => !previousState)
        GetClientes()
    }

    const showDateDialog = (currentMode) =>{
        setShowDate(true)
        setMode(currentMode)
    }

    const SelectCliente = (client) =>{
        setSelectedItem(client)
    }


    const Item = ({item}) => (
        <TouchableOpacity
            onPress={() => SelectCliente(item)}
            style={{backgroundColor: selectedItem ? selectedItem.id == item.id ? "#2ecc71" : "#f5f6fa" : "#f5f6fa", height: 50, padding: 6,margin: 5, borderRadius: 8}}>
            <View style={{flexDirection: 'column'}}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.endereco}>{item.endereco}</Text>
            </View>
        </TouchableOpacity>
    );
    return (
        <View style={styles.container}>
                <View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 22}}>
                    <Ionicons name="person" size={30} color={ clienteComplet ? '#2ecc71' : '#bdc3c7'}/>
                    <View style={{height: 3, width: 80, backgroundColor: calendarComplet ? '#2ecc71' : '#bdc3c7', margin: 15}}></View>
                    <Ionicons name="calendar" size={30} color={calendarComplet ? '#2ecc71' : '#bdc3c7'}/>
                    <View style={{height: 3, width: 80, backgroundColor: service ? '#2ecc71' : '#bdc3c7', margin: 15}}></View>
                    <Ionicons name="build" size={30} color={service ? '#2ecc71' : '#bdc3c7'}/>
                </View>
                <ScrollView style={styles.inputs}>
                {
                    cliente && (
                        <View style={{margin: 12}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{margin: 15, fontWeight: 'bold', color: "#6c5ce7"}}>O cliente existe?</Text>
                                <Switch
                                trackColor={{ false: "#bdc3c7", true: "#2ecc71"}}
                                thumbColor={!isEnabled ? "#bdc3c7" : "#bdc3c7"}
                                onValueChange={onChangeSwitch}
                                value={isEnabled}
                                />
                            </View>
                            {
                                !isEnabled ? 
                                    <View>

                                        <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Nome</Text>
                                        <View style={styles.backgorundInput}>
                                            <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} placeholder='Nome do cliente' id='nome' value={nome} onChangeText={value => setNome(value)}/>                              
                                        </View>    
                                        <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Celular/WhatsApp</Text>
                                        <View style={styles.backgorundInput}>
                                            <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} placeholder='N° Celular' id='telefone' keyboardType="numeric" value={telefone} onChangeText={value => setTelefone(value)}/>                              
                                        </View>      
                                        <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Bairro</Text>
                                        <View style={styles.backgorundInput}>
                                            <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} placeholder='Bairro' id='bairro' value={bairro} onChangeText={value => setBairro(value)}/>                              
                                        </View>   
                                        <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Rua</Text>
                                        <View style={styles.backgorundInput}>
                                            <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} placeholder='Rua' id='rua' value={rua} onChangeText={value => setRua(value)}/>                              
                                        </View> 
                                        <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>N°</Text>
                                        <View style={styles.backgorundInput}>
                                            <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} placeholder='Numero da casa' id='number' value={number} onChangeText={value => setNumber(value)}/>                              
                                        </View>    
                                    </View>
                                    : 
                                    <View>
                                        <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Nome do Cliente</Text>
                                        <View style={styles.backgorundInput}>
                                            <Ionicons name="search-outline" size={20} color='#bdc3c7'/>
                                            <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} placeholder='Nome' id='nome' value={nomeExiste} onChangeText={value => onHandleClient(value)}/>                              
                                        </View>
                                            <FlatList
                                                data={filter}
                                                renderItem={({item}) => <Item item={item} />}
                                                scrollEnabled={false}
                                                keyExtractor={item => item.id}
                                            />
                                    </View>
                            } 
                        </View>
                    )
                }
                {
                    calendar && (
                        
                            Platform.OS == 'ios' ? (
                                <View style={{margin: 12}}>
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
                                </View>
                            ) : (
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
                        

                    )
                }
                {
                    service && (
                        <View style={{margin: 12}}>
                            <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Descrição</Text>
                            <View style={styles.backgorundInputArea}>
                                <TextInput style={{ width: '100%', height: 130}} multiline={true} numberOfLines={5} placeholder='Deixe uma obeservação sobre o atendimento' id='description' value={description} onChangeText={value => setDescription(value)}/>                              
                            </View> 
                        </View>
                    )
                }
                

                </ScrollView>
                <TouchableOpacity style={styles.button} onPress={() => Etapas()}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>Continuar</Text>
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
    
    },
    backgorundInput:{
        borderColor: '#dcdde1',
        backgroundColor: '#f5f6fa',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        height: 40,
        width: '100%',
        padding: 10
    
    },
    backgorundInputArea:{
        borderColor: '#dcdde1',
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
        fontWeight: 'bold'
    },
    endereco:{
        fontSize: 12
    }
  });
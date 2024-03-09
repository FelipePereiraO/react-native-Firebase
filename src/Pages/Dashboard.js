import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { VictoryBar, VictoryChart, VictoryTheme, VictoryPie, VictoryLine } from "victory-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import {db} from "../services/Firebase"
import {ref, set, update, onValue } from "firebase/database"

export function Dashborad({navigation}){
    const [atendimento, setAtendimento] = useState([])
    const [atendido, setAtendido] = useState(0)
    const [naoAtendido, setNaoAtendido] = useState(0)

    const [diaAtendimento1, setDiaAtendimento1] = useState("")
    const [atendimento1Antes, setAtendimento1Antes] = useState(0)

    const [diaAtendimento2, setDiaAtendimento2] = useState("")
    const [atendimento2Antes, setAtendimento2Antes] = useState(0)

    const [diaAtendimento3, setDiaAtendimento3] = useState("")
    const [atendimento3Antes, setAtendimento3Antes] = useState(0)

    const [diaAtendimento4, setDiaAtendimento4] = useState("")
    const [atendimento4Antes, setAtendimento4Antes] = useState(0)
    const data = [
        { x: "Não Atendido", y: naoAtendido },
        { x: "Atendido", y: atendido }
      ];
      useEffect(() =>{
        readDataAtendimento()
    }, [])
      const dataSemanal = [
        { x: diaAtendimento4, y: atendimento4Antes },
        { x: diaAtendimento3, y: atendimento3Antes },
        { x: diaAtendimento2, y: atendimento2Antes },
        { x: diaAtendimento1, y: atendimento1Antes },
        { x: "Hoje", y: atendido }
      ];
      
    function readDataAtendimento(){
        const startCountRef = ref(db, 'atendimentos/0')
        onValue(startCountRef, (snap) =>{
            const data = snap.val();
            //console.log(data)
            setAtendido(0)
            setNaoAtendido(0)
            if(data != null){
                const novoArray = Object.keys(data).map((chave) => {
                    const arrayDeObjetos = data[chave];
                
                    return arrayDeObjetos.map((objeto) => {
                    return {
                        chave,
                        nome: objeto.nome,
                        endereco: objeto.endereco,
                        atendimento: Object.values(objeto.atendimento).map((atendimento) => {
                        return Object.values(atendimento).map((atendimentoData) => {
                            return {
                            data: atendimentoData.data,
                            hora: atendimentoData.hora,
                            servico: atendimentoData.servico,
                            status: atendimentoData.status,
                            };
                        });
                        }).flat(),
                    };
                    });
                }).flat();
                novoArray.map((a) => {
                    var not = 0
                    var yes = 0
                    var dia1 = 0
                    var dia2 = 0
                    var dia3 = 0
                    var dia4 = 0
                    const date = new Date();
                    var semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
                    var dataAtual =  date.getDate() +"/"+(date.getMonth() + 1)+"/"+date.getFullYear()
                    a.atendimento.map((atend) =>{
                        if(dataAtual == atend.data){
                            console.log("yes")
                            if(atend.status == 0){
                                setNaoAtendido(not + 1)
                            }else{
                                setAtendido(yes + 1)
                            }                    
                        }
                        var meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro","outubro", "novembro", "dezembro"]
                        var meses31 = ["janeiro", "março",  "maio", "julho", "agosto", "outubro",  "dezembro"]
                        var meses30 = ["abril", "junho", "setembro", "novembro",]
                    /*  if(date.getDate() == 1){
                            mes = date.getMonth()
                            var dia = 1
                            if(mes == 3){
                                dia = 28
                            }else{
                                meses31.map((m) =>{
                                    if(meses[mes] == m){
                                        dia = 31
                                    }else{
                                        dia = 30
                                    }
                                })                        
                            }
                        } */
                        //Um dia antes
                        var dataAtual1Antes =  (date.getDate() - 1) +"/"+(date.getMonth() + 1)+"/"+date.getFullYear()
                        var dia = new Date((date.getMonth() + 1)+"/"+(date.getDate() - 1)+"/"+date.getFullYear())
                        setDiaAtendimento1(semana[dia.getDay()])
                        if(dataAtual1Antes == atend.data){
                            if(atend.status == 1){
                                setAtendimento1Antes(dia1 + 1)
                            }
                        }
                        //Dois dias antes
                        var dataAtual2Antes =  (date.getDate() - 2) +"/"+(date.getMonth() + 1)+"/"+date.getFullYear()
                        var dia = new Date((date.getMonth() + 1)+"/"+(date.getDate() - 2)+"/"+date.getFullYear())
                        setDiaAtendimento2(semana[dia.getDay()])
                        if(dataAtual2Antes == atend.data){
                            if(a.atendimento == 1){
                                setAtendimento2Antes(dia2 + 1)
                            }
                        }
                        //Tres dias antes
                        var dataAtual3Antes =  (date.getDate() - 3) +"/"+(date.getMonth() + 1)+"/"+date.getFullYear()
                        var dia = new Date((date.getMonth() + 1)+"/"+(date.getDate() - 3)+"/"+date.getFullYear())
                        setDiaAtendimento3(semana[dia.getDay()])
                        if(dataAtual3Antes == atend.data){
                            if(atend.status == 1){
                                setAtendimento3Antes(dia3 + 1)
                            }
                        }
                        //Quatro dias antes
                        var dataAtual4Antes =  (date.getDate() - 4) +"/"+(date.getMonth() + 1)+"/"+date.getFullYear()
                        var dia = new Date((date.getMonth() + 1)+"/"+(date.getDate() - 4)+"/"+date.getFullYear())
                        setDiaAtendimento4(semana[dia.getDay()])
                        if(dataAtual4Antes == atend.data){
                            if(atend.status == 1){
                                setAtendimento4Antes(dia4 + 1)
                            }
                        }
                    })
                })
            }

        })
    }
    return(
        <View style={styles.container}>
            <View style={{margin: 16, marginTop: 50}}>
                <Text style={{fontSize: 25, fontWeight: 'bold', color: "#6c5ce7"}}>Dashboard</Text>
            </View>
            <ScrollView >
                {/* <Text>Welcome {user._tokenResponse.email}</Text> */}
                <View style={{alignItems: 'center'}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold', color: "#6c5ce7"}}>Atendimento Hoje</Text>
                    {
                        atendido == 0 && naoAtendido == 0 ? (
                            <View style={{margin: 50}}>
                                <Text style={{fontWeight: "400"}}>Não houve atendimento Hoje.</Text>
                            </View>
                        ) :(
                            <VictoryPie  
                                startAngle={50}
                                endAngle={450}
                                height={300}
                                colorScale={['#e74c3c',"#2ecc71"]}
                                innerRadius={60}
                                data={data}
                            />                        
                        )
                    }
                    <Text style={{fontSize: 18, fontWeight: 'bold', color: "#6c5ce7", marginTop: 20}}>Atendimentos</Text>
                    <VictoryChart
                    theme={VictoryTheme.material}
                    >
                    <VictoryLine
                        style={{ data: { stroke: "#2ecc71" } }}
                        alignment="start"
                        data={dataSemanal}
                    />
                    </VictoryChart>                
                </View>


            
            
            </ScrollView>            
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',

    }
  });
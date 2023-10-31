import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {db} from "../services/Firebase"
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView} from 'react-native'
import { onValue, ref } from "firebase/database";
import Ionicons from '@expo/vector-icons/Ionicons';


export function NewVenda({navigation}){
    const [selectedValue, setSelectedValue] = useState("Selecione");
    const [produto, setProduto] = useState([])
    const [ListProdutos, setListProdutos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalCount, setModalCount] = useState(false);
    const [countProduto, setCountProduto] = useState(0);
    const [selectProduto, setSelectProduto] = useState([]);
    const [valorTotal, setValorTotal] = useState(0)
    const [desconto, setDesconto] = useState(0)
    const [comDesconto, setComDesconto] = useState(0)
    

    useEffect(() =>{
        readDataClient()
    },[])

    function readDataClient(){
        setProduto([])
        const startCountRef = ref(db, 'produto')
        onValue(startCountRef, (snap) =>{
            const data = snap.val();
            //console.log(snap.val())
            setProduto(data)
        })
    }

    function CountProductMais(){
        if(countProduto >= 0){
            setCountProduto(countProduto + 1)
        }
    }

    function CountProductMenos(){
        if(countProduto > 0){
            setCountProduto(countProduto - 1)
        }
    }

    function AddProduto(id, count){
        var valTotal
        produto.map((prod) =>{
            if(prod.id == id){
                valTotal = (count * prod.valor)
                
                var obj = {
                    "id": id,
                    "quantidade": count,
                    "valorTotal": valTotal
                }
                
                if(ListProdutos.length == 0){
                    setListProdutos(ListProdutos => [obj])
                }else{
                    setListProdutos(ListProdutos => [...ListProdutos, obj]);
                }
            }
        })
        setValorTotal(valorTotal + valTotal)
        console.log(ListProdutos)
        setModalCount(false)
        setModalVisible(!modalVisible)
    
    }

    function Count(id){
        setCountProduto(0)
        setModalCount(true)
        produto.map((prod) =>{
            if(prod.id == id){
                setSelectProduto(prod)
                console.log(prod)
            }
        })
    }

    function DeleteProduto(id){
        ListProdutos.map((prod) =>{
            if(prod.id == id){
                var NewValue = valorTotal - prod.valorTotal 
                console.log(NewValue)
                if(NewValue < 0){
                    setValorTotal(0)
                }else{
                    setValorTotal(NewValue)
                }
                
            }
        })
        const novoArray = ListProdutos.filter((prod) => prod.id !== id);
        setListProdutos(novoArray)
    }

    const handleTextChange = (text) => {
        const cleanValue = text.replace(/[^0-9]/g, '');

        // Converte o valor para centavos
        const centsValue = parseInt(cleanValue) / 100;
    
        // Formata o valor como uma string de moeda brasileira
        const formattedValue = `${centsValue.toFixed(2).replace('.', ',')}`;
    
        setDesconto(formattedValue);
        setValorTotal(valorTotal - parseFloat(formattedValue));

      };

    return(
        <View style={styles.container}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalCount}
            onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalCount);
            }}>
            <View style={styles.centeredView}>
            <View style={styles.modalViewCount}>
                <View style={{alignItems: "flex-end"}}>
                    <TouchableOpacity onPress={() => setModalCount(false)}>
                        <Text style={{fontWeight: 'bold', fontSize: 15}}>X</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{fontSize: 25, textAlign: 'center', margin: 8}}>{selectProduto.nome}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center', margin: 8}}>
                    <TouchableOpacity style={styles.btnCount} onPress={() => CountProductMenos()}>
                        <Text style={{fontSize: 25, color: "white"}}>-</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize: 25, marginHorizontal: 15}}>{countProduto}</Text>
                    <TouchableOpacity style={styles.btnCountMais} onPress={() => CountProductMais()}>
                        <Text style={{fontSize: 25, color: "white"}}>+</Text>
                    </TouchableOpacity>

                </View>
                <View style={{flexDirection: "row", justifyContent: 'center', margin:10}}>
                    <TouchableOpacity onPress={() => AddProduto(selectProduto.id,countProduto)} style={styles.btnAdd}>
                        <Ionicons name="cart" size={25} color='#fff'/>

                    </TouchableOpacity>
                </View>

            </View>

            </View>
        </Modal>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <View style={{alignItems: "flex-end"}}>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={{fontWeight: 'bold', fontSize: 15}}>X</Text>
                    </TouchableOpacity>
                </View>

                    <Text style={styles.modalText}>Produtos</Text>  
                {
                    produto ? produto.map((p) =>(
                        <TouchableOpacity onPress={() => Count(p.id)} style={styles.produto}>
                            <Text style={{fontSize: 18}}>{p.nome}</Text>  
                        </TouchableOpacity>
                    )) : (<></>)
                }
                {/* <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => }>
                <Text style={styles.textStyle}>V</Text>
                </TouchableOpacity> */}

            </View>
            </View>
        </Modal>

            <View style={{flex: 1}}>
            <Text style={{fontSize: 18, margin: 8, fontWeight: 'bold'}}>Produtos:</Text>
{/*             <Picker
                selectedValue={selectedValue}
                style={{ height: 50, width: 150 }}
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
                {
                    produto ? produto.map((p) =>(
                            <Picker.Item label={p.nome} value={p.id} />       
                        
                    )) : (<></>)
                }
            </Picker> */}
            <ScrollView>
            {
                    ListProdutos ? ListProdutos.map((p) =>(
                        produto.map((prod) =>(
                            p.id == prod.id ? 
                            <TouchableOpacity style={styles.card} /* onPress={() => navigation.navigate("AtendimentoSelect", {atendimento: a, cliente: c})} */>
                                <View style={styles.completed}></View>
                                <View style={{margin: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <View style={{width: '70%'}}>
                                        <Text style={{fontSize: 17, fontWeight: 'bold'}}>{prod.nome}</Text>
                                        <Text style={{fontSize: 14, fontWeight: 'bold', color: '#27ae60', marginTop: 10}}>R$ {prod.valor}</Text> 
                                    </View>
                                    <View>
                                        <Text>Unid. {p.quantidade}</Text>
                                    </View>
                                    <View style={{justifyContent: 'center', padding: 10}}>
                                        <TouchableOpacity onPress={() => DeleteProduto(prod.id)}>
                                            <Ionicons name="trash" size={25} color='red'/>
                                        </TouchableOpacity>
                                    </View>


                                </View>        
                            </TouchableOpacity>

                                
                            : <></>
                        ))
                        
                    )) : <></>
                }
                    <View style={{margin: 15}}>
                        <TouchableOpacity onPress={() =>setModalVisible(true)} style={{height: 50, width: 50, backgroundColor: "#6c5ce7", justifyContent: 'center', alignItems: "center", borderRadius: 25}}>
                            <Text style={{fontSize: 25, color: 'white'}}>+</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>



            </View>
            <View style={{margin: 15}}>
                <Text style={{marginHorizontal: 30}}>Desconto na venda:</Text>
                <View style={{alignItems: 'center'}}>
                    <View style={styles.backgorundInput}>
                        <Ionicons name="cash" size={20} color='black'/>
                        <Text style={{fontWeight: 'bold'}}>  R$</Text>
                        <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} keyboardType="numeric" placeholder='R$ 0,00' id='desconto' value={desconto} onChangeText={handleTextChange}/>                              
                    </View>
                </View>
                <View style={{flexDirection: 'row', marginLeft: 15, marginTop: 5}}>
                    <Text style={{fontSize: 18}}>Valor Total: </Text>
                
                    <Text style={{fontSize: 18, color: "#2ecc71", fontWeight: 'bold'}}>R$ {valorTotal}</Text>

                </View>
                <View style={{flexDirection: 'row', marginLeft: 15, marginTop: 5}}>
                    <Text style={{fontSize: 13}}>Valor total com desconto: </Text>
                
                    <Text style={{fontSize: 13, color: "#2ecc71", fontWeight: 'bold'}}>R$ {valorTotal}</Text>

                </View>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity style={styles.buttonBt} >
                        <Text style={{color: '#fff', fontWeight: 'bold'}}>Confirmar</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
  
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
    buttonBt:{
        height: 50,
        width: 300,
        backgroundColor: "#6c5ce7",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnCancel:{
        height: 35,
        width: 35,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        margin: 5
    },
    btnAdd:{
        height: 35,
        width: '30%',
        backgroundColor: '#6c5ce7',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        margin: 5
    },
    btnCount:{
        height: 35,
        width: 35,
        backgroundColor: '#6c5ce7',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8

    },
    btnCountMais:{
        height: 35,
        width: 35,
        backgroundColor: '#6c5ce7',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8

    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        width: "90%",
        height: "80%",
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalViewCount:{
        width: "60%",
        height: "30%",
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    produto:{
        margin: 5,
        
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    card:{
        height: 80,
        backgroundColor: '#f8f3f6',
        margin: 10,
        borderRadius: 8,
        flexDirection: 'row'
    },
    completed:{
        height: "100%",
        width: 7,
        backgroundColor: '#2ecc71',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8

    },
});
import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/Firebase';



export default function Login(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function createUser(){
        await createUserWithEmailAndPassword(auth, email, password)
        .then(value => {
            alert("Cadastrado")
        }).catch(error => alert(error))
    }


    return(
         <View style={styles.container}>
            <View style={{alignItems: 'center', margin: 40}}>
                <Text style={styles.logo}>Paulo Maq</Text>
            </View>
            <View style={styles.login}>
                <Text style={{fontSize: 19, margin: 22}}>Login</Text>
                <View style={styles.inputs}>
                    <Text>E-mail</Text>
                    <TextInput style={styles.backgorundInput} placeholder='email@dominio.com' id='email' value={email} onChangeText={value => setEmail(value)}/>
                    <Text>Password</Text>
                    <TextInput style={styles.backgorundInput} placeholder='*******' id='password' value={password}  onChangeText={value => setPassword(value)}/>
                </View>
                <View style={{marginHorizontal: '10%', marginTop: 22}}>
                    <TouchableOpacity style={styles.button} onPress={() => createUser()}>
                        <Text style={{fontWeight: 'bold', color: 'white'}}>Sign in</Text>
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
    login:{
        marginTop: '40%',

    },
    inputs:{
        marginHorizontal: "10%"
    },
    backgorundInput:{
        borderColor: 'black',
        backgroundColor: '#dfe6e9',
        borderRadius: 8,
        height: 50,
        width: '90%',
        padding: 8
    
    },
    logo:{
        fontSize: 27
    },
    button:{
        height: 50,
        width: '90%',
        backgroundColor: "#6c5ce7",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    }
  });
import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/Firebase';



export default function Login({navigation}){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    async function SignIn(){
        setLoading(true)
        await createUserWithEmailAndPassword(auth, email, password)
        .then(value => {
            alert("Cadastrado")
            setLoading(false)
        }).catch(error => 
            { alert(error)
        })
    }


    return(
         <View style={styles.container}>
            <View style={{alignItems: 'center', margin: 40}}>
                <Text style={styles.logo}>System</Text>
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
                    <TouchableOpacity style={styles.button} onPress={() => SignIn()}>
                        <Text style={{fontWeight: 'bold', color: 'white'}}>Sign in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignItems: 'center', margin: 15}} onPress={() => navigation.navigate("Register")}>
                        <Text>New to Login? <Text style={{color: "#6c5ce7", fontWeight: 'bold'}}>Register</Text></Text>
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
        marginTop: '10%',
        alignItems: 'center'

    },
    inputs:{

    },
    backgorundInput:{
        borderColor: 'black',
        backgroundColor: '#dfe6e9',
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
        height: 50,
        width: 300,
        backgroundColor: "#6c5ce7",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    }
  });
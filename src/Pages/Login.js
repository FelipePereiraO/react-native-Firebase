import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from '../services/Firebase';
import Ionicons from '@expo/vector-icons/Ionicons';



export default function Login({navigation}){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    async function SignIn(){
        console.log("entrou")
        await signInWithEmailAndPassword(auth, email, password)
        .then(value => {
            console.log("entrou")
            navigation.navigate("Home", {auth: value})
        }).catch(error => {
             alert(error)
             console.log(error)
        })
    }



    return(
         <View style={styles.container}>
            <View style={{alignItems: 'center', margin: 40}}>
                <Text style={styles.logo}>System</Text>
            </View>
            <View style={styles.login}>
                {/* <Text style={{fontSize: 19, margin: 22}}>Login</Text> */}
                <View style={styles.inputs}>
                    <View style={{margin: 12}}>
                        <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>E-mail</Text>
                        <View style={styles.backgorundInput}>
                            <Ionicons name="person" size={20} color='#bdc3c7'/>
                            <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} placeholder='email@dominio.com' id='email' value={email} onChangeText={value => setEmail(value)}/>                              
                        </View>
                                                               

                        <Text style={{margin: 8, fontWeight: 'bold', color: "#6c5ce7"}}>Password</Text>
                        <View style={styles.backgorundInput}>
                            <Ionicons name="key" size={20} color='#bdc3c7'/>
                            <TextInput style={{marginHorizontal: 8, width: '100%', height: 50}} placeholder='*******' secureTextEntry={true} id='password' value={password}  onChangeText={value => setPassword(value)}/>   
                        </View>
                                             
                    </View>
                </View>
                <View style={{marginHorizontal: '10%', marginTop: 16}}>
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
        height: 50,
        width: 300,
        backgroundColor: "#6c5ce7",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    }
  });
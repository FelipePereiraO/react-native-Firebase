import React, {useState} from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { auth } from '../services/Firebase';

export function Register({navigation}){

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(true)

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
            {
                loading ? (
                    <View>
                        <View style={styles.login}>
                        <Text style={styles.title}>Welcome</Text>
                        <View style={styles.inputs}>
                            <Text>Welcome to System</Text>      
              
                        </View>
                        <View style={{ marginVertical: 25}}>
                            <TouchableOpacity style={styles.button} onPress={() => createUser()}>
                                <Text style={{fontWeight: 'bold', color: 'white'}}>Continuar</Text>
                            </TouchableOpacity>          
                        </View>
                    </View>   
                    </View>
                ): (                    
                    <View style={styles.login}>
                        <Text style={styles.title}>Register</Text>
                        <View style={styles.inputs}>
                            <Text>E-mail</Text>
                            <TextInput style={styles.backgorundInput} placeholder='email@dominio.com' id='email' value={email} onChangeText={value => setEmail(value)}/>                        
                            <Text>Password</Text>
                            <TextInput style={styles.backgorundInput} placeholder='*******' id='password' value={password}  onChangeText={value => setPassword(value)}/>                        
                        </View>
                        <View style={{ marginVertical: 25}}>
                            <TouchableOpacity style={styles.button} onPress={() => createUser()}>
                                <Text style={{fontWeight: 'bold', color: 'white'}}>Register</Text>
                            </TouchableOpacity>          
                        </View>
                    </View>   
                )
            }            
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
        marginTop: 25
    },
    backgorundInput:{
        borderColor: 'black',
        backgroundColor: '#dfe6e9',
        borderRadius: 8,
        height: 50,
        width: 300,
        padding: 10
    
    },
    title:{
        fontSize: 25,
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
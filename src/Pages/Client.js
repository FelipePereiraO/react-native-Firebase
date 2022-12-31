import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import {db} from "../services/Firebase"
import {ref, set, update, onValue } from "firebase/database"
export function Client({navigation}){
    const [client, setClient] = useState()
    useEffect(() =>{
        readData()
    }, [])
    function readData(){
        const startCountRef = ref(db, 'clientes/')
        onValue(startCountRef, (snap) =>{
            const data = snap.val();
            setClient(data)

        })
    }

    return(
        <View>
            {
                client ? (
                    <Text></Text>
                ) : (
                    <></>
                )
            }
            <Text>Test</Text>
        </View>
    )
}
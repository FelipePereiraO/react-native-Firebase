import React, { useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native'

export function AttendanceSelect({navigation, route}){
    console.log(route.params)

    useEffect(()=>{
        const url = Platform.select({
            ios: `maps:0,0?q=Paulo Maq`,
            android: `geo:0,0?q=Rua cardeal jean 112`,
          })
          
          Linking.openURL(url)
    }, [])
    return(
        <View>
            <Text
                style={{marginTop:30}}
                onPress={() => Linking.canOpenURL("whatsapp://send?text=oi").then(supported => {
                    if (supported) {
                        return Linking.openURL(
                            "whatsapp://send?phone=5571982632981&text=Oi"
                        );
                    } else {
                    return Linking.openURL(
                        "https://api.whatsapp.com/send?phone=5571982632981&text=Oi"
                    );
                    }
                })
            }>
                WhatsApp Mensagem
            </Text>
        </View>
    )
}
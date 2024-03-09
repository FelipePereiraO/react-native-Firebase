import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from "./Home";
import Ionicons from '@expo/vector-icons/Ionicons';

import { Dashborad } from "./Dashboard";
import { Profile } from "./Profile";
const Tabb = createBottomTabNavigator();
export function Tab({navigation, route}){
    return(
            <Tabb.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                          let iconName;
              
                          if (route.name === 'Dashborad') {
                            iconName = 'pie-chart';
                          } else if (route.name === 'Home') {
                            iconName = 'home';
                          } else if(route.name === 'Profile'){
                            iconName = 'person-circle'
                          }
              
                          // You can return any component that you like here!
                          return <Ionicons name={iconName} size={size} color={color} />;
                        },
                        tabBarActiveTintColor: "#6c5ce7",
                        tabBarInactiveTintColor: 'gray',
                      })}
            >
                <Tabb.Screen name="Dashborad" component={Dashborad} options={{headerShown: false}}/>
                <Tabb.Screen name="Home" component={Home} options={{headerShown: false}}/>
                {/* <Tabb.Screen name="Profile" component={Profile} options={{headerShown: false}}/> */}
                
            </Tabb.Navigator>
    )
}
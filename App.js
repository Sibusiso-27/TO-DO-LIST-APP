import * as React from 'react';
import { StyleSheet, Platform, Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";


import Tasks from './tasks'; 
import Progress from './progress';
import HomeScreen from './Home';



const WelcomeScreen = ({navigation}) => {

  Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
 
useEffect(() => {
  const registerForPushNotifications = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for notifications!");
        return;
      }
    }
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };
  registerForPushNotifications();
}, []);




  return (
     <LinearGradient
      colors={["#dbeafe", "#ffffff", "#fde2e4"]}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image style={styles.bgimage} source={require("./assets/landing1.png")}/> 
        
        <Text style={styles.quote}>“A Task a day keeps your mind awake!”</Text>
        <TouchableOpacity  style={styles.startBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.startBtnText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const Stack = createNativeStackNavigator();

export const TasksContext = React.createContext();




export default function App() {
  const [todos, setTodos] = React.useState([]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const savedTodos = await AsyncStorage.getItem('todos');
        if (savedTodos !== null) {
          setTodos(JSON.parse(savedTodos));
        }
      } catch (error) {
        console.log('Error loading todos:', error);
      }
    };
    loadTodos();
  }, []);

  // Save tasks whenever todos change
  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem('todos', JSON.stringify(todos));
      } catch (error) {
        console.log('Error saving todos:', error);
      }
    };
    saveTodos();
  }, [todos]);

  return (
    <TasksContext.Provider value={{ todos, setTodos }}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}
      initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
         <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tasks" component={Tasks} />
        <Stack.Screen name="Progress" component={Progress} />
      </Stack.Navigator>
    </NavigationContainer>
    </TasksContext.Provider>
  );
}

const styles = StyleSheet.create({
    background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  bgimage: {
    width: 220,
    height: 220,
    transform: [{ rotate: "-5deg" }],
    marginBottom: 40, 
    resizeMode: "contain",
    tintColor: '#000',
  },
  quote: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#fff",
    textAlign: "center",
    marginBottom: 50,
    paddingHorizontal: 20,
    lineHeight: 24, 
    textShadowColor: "rgba(0,0,0,0.6)", 
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  startBtn: {
  backgroundColor: "#FCD9D9", 
  paddingVertical: 12,
  paddingHorizontal: 28,
  borderRadius: 25,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
startBtnText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
},

});

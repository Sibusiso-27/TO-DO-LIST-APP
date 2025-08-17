import * as React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


import Tasks from './tasks'; // your tasks page
import Progress from './progress';

function HomeScreen({ navigation }) {

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
    <ImageBackground
      source={require('./assets/landscape-7283516_640.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Image style={styles.bgimage} source={require('./assets/note-book-306253_1280.png')} />
        <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
          <Text style={styles.heading}>START A TASK</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>DoItNow©2025, All rights reserved.</Text>
    </ImageBackground>
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
      initialRouteName="Tasks">
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgimage: {
    width: 200,
    height: 200,
    transform: [{ rotate: '-10deg' }],
    margin: 150,
    padding: 10,
  },
  heading: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Courier New',
    width: 200,
    textShadowColor: '#FFF',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    borderStyle: 'solid',
    backgroundColor: '#FFF2EB',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    padding: 10,
    marginLeft: 150,
    color: '#504B38',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#504B38',
  },
});

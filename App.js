import * as React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import Tasks from './tasks'; // your tasks page

function HomeScreen({ navigation }) {
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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tasks" component={Tasks} />
      </Stack.Navigator>
    </NavigationContainer>
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

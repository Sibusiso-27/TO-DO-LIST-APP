import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image,KeyboardAvoidingView,FlatList, Platform, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from "@react-native-community/datetimepicker";
import * as React from 'react';
import  { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { TasksContext } from "./App";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute } from "@react-navigation/native";


// BottomNav component moved outside Tasks
const BottomNav = () => {
  const navigation = useNavigation();
  const route = useRoute();
  

  const handleNavigate = (screen) => {
    if (route.name !== screen) {
      navigation.navigate(screen);
    }
  };

  return (
    <View style={styles.bottomNav}>
      {/* Home */}
      <TouchableOpacity
        onPress={() => handleNavigate("App")}
        style={[
          styles.navButton,
          route.name === "Home" && styles.activeNavButton,
        ]}
      >
        <Image
          style={[
            styles.navIcon,
            route.name === "Home" && styles.activeNavIcon,
          ]}
          source={require("./assets/home2.png")}
        />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      {/* Tasks */}
      <TouchableOpacity
        onPress={() => handleNavigate("Tasks")}
        style={[
          styles.navButton,
          route.name === "Tasks" && styles.activeNavButton,
        ]}
      >
        <Image
          style={[
            styles.navIcon,
            route.name === "Tasks" && styles.activeNavIcon,
          ]}
          source={require("./assets/tasklist.png")}
        />
        <Text style={[
            styles.navText,
            route.name === "Tasks" && styles.activeNavText,
          ]}>Tasks</Text>
      </TouchableOpacity>

      {/* Progress */}
      <TouchableOpacity
        onPress={() => handleNavigate("Progress")}
        style={[
          styles.navButton,
          route.name === "Progress" && styles.activeNavButton,
        ]}
      >
        <Image
          style={[
            styles.navIcon,
            route.name === "Progress" && styles.activeNavIcon,
          ]}
          source={require("./assets/inprogress.png")}
        />
        <Text style={[
            styles.navText,
            route.name === "Progress" && styles.activeNavText,
          ]}>Progress</Text>
      </TouchableOpacity>
    </View>
  );
};

// Render BottomNav inside Tasks
export default function Tasks() {
    const {todos, setTodos} = useContext(TasksContext);
    const[listInput, setListInput] = useState("");
    const navigation = useNavigation();

    Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
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

const scheduleNotification = async (task, dateTime) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⏰ Reminder!",
      body: `Don't forget to: ${task}`,
    },
    trigger: { type: 'date', date: dateTime } // expects a JS Date object
  });
};

const [greeting, setGreeting] = useState('');
useEffect(() => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    let newGreeting = '';
    if (hour >= 5 && hour < 12) {
      newGreeting = 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      newGreeting = 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      newGreeting = 'Good Evening';
    }
    else if (hour >= 21 || hour < 5) {
        newGreeting = 'Hello';
  
    }
    setGreeting(newGreeting);
  };
  getGreeting();
  const interval = setInterval(getGreeting, 60000);
  return () => clearInterval(interval);
}, []);


// Calendar logic
const [date, setDate] = useState(new Date());
const [showDate, setShowDate] = useState(false);
const [showTime, setShowTime] = useState(false);

const onchange = (_, selectedDate) => {
  if (selectedDate) {
  setShowDate(false);
  setDate(selectedDate);
}
else {
    setShow(false);
}
};

const handleAddTodo = async () => {
    if (!listInput.trim()) {
      alert("Please enter a task❗");
      return;
    }
    setTodos((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: listInput.trim(),
        date: date.toISOString(),
      },
    ]); 
    setListInput("");

    await scheduleNotification(listInput, date);
  };


 const handleDeleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };



    // ... rest of your Tasks code ...

    return (
      <>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        > 
          <LinearGradient
            colors={["#ffe4ec", "#e2f0ff", "#e7ffe9"]}
            style={styles.container}
          >
            <Text style={styles.greeting}>{greeting}, User! 👋</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={listInput}
                onChangeText={setListInput}
                placeholder="Add a task..."
              />
              <TouchableOpacity
                style={styles.Btndate}
                onPress={() => setShowDate(true)}
              >
                <Text style={styles.btnText}><Image style={styles.calicon} 
                source={require('./assets/calendar.png')} /></Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={handleAddTodo}>
                <Text style={styles.btnText}><Image style={styles.addicon}
                source={require('./assets/pluskey2.png')} /></Text>
              </TouchableOpacity>
            </View>
            {showDate && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(_, selectedDate) => {
                  setShowDate(false);
                  if (selectedDate) {
                    const d = new Date(selectedDate);
                    d.setHours(date.getHours(), date.getMinutes(), 0);
                    setDate(d);
                    setShowTime(true);
                  }
                }}
              />
            )}
            {showTime && (
              <DateTimePicker
                value={date}
                mode="time"
                display="default"
                onChange={(_, selectedTime) => {
                  setShowTime(false);
                  if (selectedTime) {
                    const d = new Date(date);
                    d.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0);
                    setDate(d);
                  }
                }}
              />
            )}
            <FlatList
              data={todos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.todoItem}>
                  <View>
                    <Text style={styles.todoText}>{item.text}</Text>
                    <Text style={styles.todoDate}>
                      ⏱ 
                      {new Date(item.date).toLocaleString()} 
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteTodo(item.id)}
                  >
                    <Text style={styles.del}><Image style={styles.calicon} 
                    source={require('./assets/dustbin.png')} /></Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </LinearGradient> 
        </KeyboardAvoidingView>
        <BottomNav navigation={navigation} />
      </>
    );
}


// Stack Navigator





const styles = StyleSheet.create({
   

    progress : {
      textAlign: 'center',
    },
    container: {
    flex: 1,
    width: "100%",
  
  },
    greeting : {
        marginTop: 30,
        marginLeft:10,
        marginRight: 120,
        fontSize: 20,
        fontWeight: '600',



    },
    inputContainer: {
        marginTop:10,
        flexDirection: 'row',
        backgroundColor: '',
        marginRight: 5,
    },

    input : {
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        borderRightWidth: 0,
        width:240,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    
    },

    addBtn: {
        padding: 4,
        borderColor: '#000',
        borderWidth: 1,
        borderLeftWidth:0,
        borderRightWidth: 2,
        borderStyle: 'solid',
        width: 40,
        alignItems: 'center',
        borderBottomRightRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.7)',

    },
     btnText: {
        color: 'black',
        fontSize: 15,
        textAlign: 'center',
     },

     Btndate: { 
        padding: 6,
        borderColor: '#000',
        borderWidth: 1,
        borderStyle: 'solid',
        width: 40,
        alignItems: 'center',
        borderRadius: 0,
        borderLeftWidth:0,
        borderRightWidth: 0,
        backgroundColor: 'rgba(255,255,255,0.7)',
        
     },

     calicon : {
        width: 28,
        height: 28,
        

     },

     calicon1 : {
        width: 28,
        height: 28,
        
        

     },
     

     addicon : {
        width: 30,
        height: 30,
        
     },

     minical : {
        width: 25,
        height: 25,

     },

     todoText : {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
      
     },

     todoDate: {
        fontSize: 10,
    marginLeft: 5,
    color: "gray",

     },

     list :{
    flex: 1,
    flexDirection: 'column',
    color:'#9CAFAA',
    fontWeight: 'bold',
    fontSize: 15,
    fontWeight: 'bold',
    borderRadius:16,

     },
    
    todoItem: {
    margin: 10,
     flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
    backgroundColor: "rgba(255,255,255,0.7)",
    padding: 3,
    borderRadius: 10,
    

     },

     todoText: {
    flex: 1,
    marginLeft: 5,
    fontSize: 14,

     },

     deleteBtn: {
        margin: 10,
        marginLeft: 100,
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 0,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 5,
        padding: 2,
     },

     del: {
        color: 'white',
     },
    
     task: {
     textAlign: 'center',
     alignSelf: 'center',
     color: '',
     fontWeight: 500,
     width: 150,
     backgroundColor: '#FFF2EB',
     borderColor: 'white',
     borderWidth: 1,
     borderRadius: 10,
     marginBottom: 10,
     },

     bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FAFAFA", // semi-transparent white
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  navButton: {
    flex: 1,
    alignItems: "center",
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    tintColor: "#B9B9B8", // iOS blue, you can change to pastel pink/purple/etc
  },
  navText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#B9B9B9",
  },

  activeNavButton: {
    backgroundColor: "#ebfafc", // pastel blue bg
  borderRadius: 20,
  paddingVertical: 6,
  paddingHorizontal: 12,
  },
  activeNavIcon: {
    tintColor: "#64B5F6", // brighter blue
  },
  activeNavText: {
    color: "#64B5F6",
    fontWeight: "700",
  textDecorationLine: 'underline',
  textDecorationColor: '#6EC1E4',
  },

     copyright: {
      fontSize: 10,
      textAlign: 'center',
     },



    });



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
import { scheduleNotification } from './App';



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
      
      <TouchableOpacity
        onPress={() => handleNavigate("Home")}
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


export default function Tasks() {
    const {todos, setTodos} = useContext(TasksContext);
    const[listInput, setListInput] = useState("");
    const navigation = useNavigation();
     const totalTasks = todos.length;

  {/*const {cartegory, setCartegory} =useState('');*/}


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
const [dateSelected, setDateSelected] = useState(false);


  const formatTodoDate = (isoString) => {
    const d = new Date(isoString);
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const datePart = d.toLocaleDateString(undefined, options);

    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const timePart = `${hours}:${minutes}`;

    return `${datePart} ${timePart}`;
  };

  const scheduleNotification = async (task, dateTime) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⏰ Reminder!",
      body: `Don't forget to ${task}`,
    },
    trigger: { type: 'date', date: dateTime } 
  });
};

const handleAddTodo = async () => {
    if (!listInput.trim()) {
      alert("Please enter a task❗");
      return;
    }

    if (!dateSelected) {
    alert("Please select a date and time⏱");
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
    setDateSelected(false);
   await scheduleNotification(listInput, date);
  };


 const handleDeleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

    return (
      <>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        > 
          <LinearGradient
            colors={["#D9E8F3","#FCD9D9", "#fff"]}
            style={styles.container}
          >
            {/*<Text style={styles.greeting}>{greeting}, User! 👋</Text>*/}
            <Text style={styles.greeting}>What’s on Your List?</Text>
         <View style={styles.inputContainer}>
  <TextInput
    style={styles.input}
    value={listInput}
    onChangeText={setListInput}
    placeholder="Add a task..."
    placeholderTextColor="#666"
  />
  
  <TouchableOpacity style={styles.iconBtn} onPress={() => setShowDate(true)}>
    <Image style={styles.icon} source={require("./assets/lastcalendar.png")} />
  </TouchableOpacity>

  <TouchableOpacity style={[styles.iconBtn, !dateSelected && { opacity: 0.5 }]}
  onPress={handleAddTodo}
  disabled={!dateSelected}
  >
    <Image style={styles.icon} source={require("./assets/final.png")} />
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
                    setDateSelected(true);
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
                    setDateSelected(true);
                  }
                }}
              />
            )}

            { totalTasks === 0 ? (
              <View >
                <Image style={{width:200, height: 200, alignSelf: 'center', marginTop: 90,marginLeft:30,}} source={require("./assets/notask.png")}/>
                <Text style={{textAlign: 'center', color: 'gray',}}>No Tasks Yet</Text>
                <View>
                <Text style={{textAlign: 'center', color: 'gray', marginTop: 80,}}>❗NOTE❗</Text>
                <Text style={{textAlign: 'center', color: 'gray',}}>⨀Add Date and Time first!</Text>
                 <Text style={{textAlign: 'center', color: 'gray',}}>⨀Reminders are auto!</Text>
                </View>
              </View>
            ): (
            <FlatList
              data={todos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.todoItem}>
                  <View>
                    <Text style={styles.todoText}>{item.text}</Text>
                    <Text style={styles.todoDate}>
                      ⏱ 
                      {formatTodoDate(item.date)} 
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
            )}
          </LinearGradient> 
        </KeyboardAvoidingView>
        <BottomNav navigation={navigation} />
        
      </>
    );
}







const styles = StyleSheet.create({
   

    container: {
    flex: 1,
    width: "100%",
  
  },
   greeting: {
  marginTop: 30,
  marginLeft: 0,
  color: "#2d2d2d",
  textAlign:'center',
  fontSize: 20,
  fontWeight: "600",
  textShadowColor: "rgba(0, 0, 0, 0.25)", 
  textShadowOffset: { width: 1, height: 1 }, 
  textShadowRadius: 2,
},

inputContainer: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 15,
  marginHorizontal: 10,
  backgroundColor: "rgba(255,255,255,0.7)",
  borderRadius: 16,
  paddingHorizontal: 10,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
  elevation: 0,
},

input: {
  flex: 1, 
  fontSize: 16,
  paddingVertical: 10,
  paddingHorizontal: 12,
  color: "#333",
},

iconBtn: {
  padding: 8,
  marginLeft: 4,
  borderRadius: 12,
},

icon: {
  width: 26,
  height: 26,
  tintColor: "#333", 
},
     
  calicon1 : {
        width: 28,
        height: 28,
     },
   calicon : {
        width: 28,
        height: 28,
     },


   minical : {
        width: 25,
        height: 25,

     },
     
     calicon1 : {
        width: 28,
        height: 28,
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
        marginLeft: 85,
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 0,
        
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
    backgroundColor: "#FAFAFA", 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, 
  },
  navButton: {
    flex: 1,
    alignItems: "center",
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    tintColor: "#B9B9B8", 
  },
  navText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#B9B9B9",
  },

  activeNavButton: {
    backgroundColor: "#ebfafc", 
  borderRadius: 20,
  paddingVertical: 6,
  paddingHorizontal: 12,
  },
  activeNavIcon: {
    tintColor: "#64B5F6", 
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



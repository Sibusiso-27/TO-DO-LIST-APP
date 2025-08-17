import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image,ScrollView,KeyboardAvoidingView,FlatList, Platform, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from "@react-native-community/datetimepicker";


const Tasks =() => {
    const[todos, setTodos] = useState([]);
    const[listInput, setListInput] = useState("");

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


const [greeting, setGreeting] = useState('');
useEffect(() => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    let newGreeting = '';
    if (hour >= 5 && hour < 12) {
      newGreeting = 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      newGreeting = 'Good Afternoon';
    } else if (hour >= 17 || hour < 21) {
      newGreeting = 'Good Evening';
    }
    else {
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

const handleAddTodo = () => {
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
  };


 const handleDeleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };
  
    return (
        
         <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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

      {/* Date Picker */}
      {showDate && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowDate(false);
            if (selectedDate) {
              const d = new Date(selectedDate);
              d.setHours(date.getHours(), date.getMinutes(), 0, 0);
              setDate(d);
              setShowTime(true);
            }
          }}
        />
      )}

      {/* Time Picker */}
      {showTime && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={(_, selectedTime) => {
            setShowTime(false);
            if (selectedTime) {
              const d = new Date(date);
              d.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
              setDate(d);
            }
          }}
        />
      )}

      {/* Todo List */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <View>
              <Text style={styles.todoText}>📌 {item.text}</Text>
              <Text style={styles.todoDate}>
                ⏱ 
                 {new Date(item.date).toLocaleString()} 
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDeleteTodo(item.id)}
            >
              <Text style={styles.del}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity>
      <Text style={styles.progress}>Progress</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
   

    progress : {
      textAlign: 'center',
    },
    container : {
        flex: 1,
        height: 'auto',
        backgroundColor: '#ECFAE5',

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
        backgroundColor: '#FFE1E0',
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
        backgroundColor: '#FFE1E0',

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
        backgroundColor: '#FFE1E0',
        
     },

     calicon : {
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
      
     },

     todoDate: {
        fontSize: 12,
        textAlign: '', 

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: '',
    color:'#000',
    padding: 2,
    borderColor: '#000',
    borderWidth: 1,
    borderStyle: 'solid',
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#FFF2EB',
    borderRadius: 10,
    

     },

     todoText: {
        color: '#000',
        fontWeight: 'thin',

     },

     deleteBtn: {
        margin: 10,
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 1,
        backgroundColor: '#DA6C6C',
        borderRadius: 10,
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

     copyright: {
      fontSize: 10,
      textAlign: 'center',
     },



    });


export default Tasks;
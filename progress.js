import { useState, useEffect } from "react";
import React, { useContext } from "react";
import { StyleSheet, Text, View,Image,ScrollView,KeyboardAvoidingView,FlatList, Platform} from 'react-native';
import { TasksContext } from "./App";
import Checkbox from "expo-checkbox";


   const Progress = () => {
  const { todos, setTodos } = useContext(TasksContext);

  const toggleTask = (id) => {
    setTodos((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const today = new Date();
  const overdueTasks = todos.filter(
    (task) => task.dueDate && new Date(task.dueDate) < today && !task.completed
  );
  const completedTasks = todos.filter((task) => task.completed);


  return (
    
    <View style={{ backgroundColor: '#ffffe3', flex: 1, width: '100%' }}>
      <Text style={styles.headingp}>Track Your Progress </Text>
      <View style={{borderWidth:0, borderColor: '#000', }}>
      
    
      <Text style={styles.section}>All Tasks</Text>
      <ScrollView>
        {todos.length > 0 ? (
          todos.map((task) => (
            <View key={task.id} style={styles.taskRow}>
              <Checkbox style={{marginTop: 13, width:22, height:25,}}
                value={task.completed}
                onValueChange={() => toggleTask(task.id)}
                color={task.completed ? "#818C78" : undefined}
              />

              <View style={{ flexDirection: "column", borderWidth: 1, borderColor: '#000', borderRadius: 10, width:210,
               borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRightWidth: 0,
               backgroundColor: '#fff', fontWeight: 'thin',
              }}>
                <Text
                  style={[
                    styles.taskText,
                    task.completed && {
                      textDecorationLine: "line-through",
                      color: "gray",
                    },
                  ]}
                >
                  {task.text}
                </Text>
                <Text style={{ fontSize: 10 }}>
                  {new Date(task.date).toLocaleString()}
                </Text>
                </View>
                {/* ✅ Status text */}
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    marginLeft: 0,
                     borderWidth: 1, borderColor: '#000', borderRadius: 10,
                     borderLeftWidth:0, borderTopLeftRadius:0, borderBottomLeftRadius:0,
                    padding: 5,
                    backgroundColor: '#fff',
                    color: task.completed ? "gray" : "green",
                  }}
                >
                  {task.completed ? "Completed" : "In Progress"}
                </Text>
              
            </View>
          ))
        ) : (
          <Text>No tasks yet</Text>
        )}
      </ScrollView>
      <View style={{borderBlockColor: 'black', borderWidth: 1, flexDirection: 'row',}}>
      </View>
      {/* Closing tag for the outermost View */}
    </View>
    </View>
  );
};

export default Progress;

const styles = StyleSheet.create({
headingp : {
 alignSelf: 'flex-start',
 marginTop: 20,
 marginRight: 50,
 fontSize: 30,
 fontWeight: 'bold',

},
section : {
 borderColor: '#000',
 borderWidth: 1,
 width: 100,
 alignSelf: 'center',
 textAlign: 'center',
 borderRadius: 10,

},

taskRow : {
    borderColor: '#000',
 borderWidth: 0,
marginTop: 10,
borderRadius: 0,
flexDirection: 'row',


},

taskText: {
  fontSize: 16,
  color: '#000',
  marginLeft: 5,
},

});
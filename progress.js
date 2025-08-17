import { useState, useEffect } from "react";
import React, { useContext } from "react";
import { StyleSheet, Text, View,Image,ScrollView,KeyboardAvoidingView,FlatList, Platform} from 'react-native';
import { TasksContext } from "./App";


   const Progress = () => {
  const { todos } = useContext(TasksContext);

  const today = new Date();
  const overdueTasks = todos.filter(task => new Date(task.dueDate) < today);

  return (
    <View style={{ backgroundColor: '#ffffe3', flex: 1, width: '100%' }}>
      <Text style={styles.headingp}>Welcome To Your Progress Tab</Text>
      <View style={{borderWidth:2, borderColor: '#000', backgroundColor: '#e2eeff',}}>
      <Text style={styles.section}>All Tasks</Text>

      {todos.length > 0 ? (
        todos.map(task => (
          <View style={{borderColor: '#000', borderWidth: 1, borderRadius: 10,}} key={task.id}>
            <Text style={styles.task}>
              {task.text}
            </Text>
            <Text style={{fontSize: 10,}}>
              {new Date(task.date).toLocaleString()} 
            </Text>
          </View>
        
        ))
      ) : (
        <Text style={{textAlign: 'center',}}>No tasks yet</Text>
        
      )}
      </View>

      {overdueTasks.length > 0 && (
        <>
          <Text style={styles.section}>Overdue Tasks</Text>
          {overdueTasks.map(task => (
            <View key={task.id} style={{marginBottom: 10}}>
              <Text style={[styles.task, { color: "red" }]}>
                {task.text}
              </Text>
              <Text style={{fontSize: 10,}}>
                {new Date(task.date).toLocaleString()} 
              </Text>
            </View>
          ))}
        </>
      )}
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

},

task : {
    borderColor: '#000',
 borderWidth: 0,
marginTop: 10,
borderRadius: 0,

},

});
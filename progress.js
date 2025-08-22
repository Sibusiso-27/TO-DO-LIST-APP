import { useContext } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { TasksContext } from "./App";
import Checkbox from "expo-checkbox";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native"; 


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

const Progress = () => {
  const { todos, setTodos } = useContext(TasksContext);
  const navigation = useNavigation();

   const [update, setUpdate] = useState('');
    useEffect(() => {
      const getDate = () => {
        const today = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        const formattedDate = today.toLocaleDateString(undefined, options);
        setUpdate(formattedDate);
      };
      getDate();
    }, []);

  const toggleTask = (id) => {
    setTodos((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Separate tasks
  const inProgressTasks = todos.filter((task) => !task.completed);
  const completedTasks = todos.filter((task) => task.completed);

  return (
    <><LinearGradient
      colors={["#D9E8F3","#FCD9D9", "#fff"]} 
      style={styles.container1}
    >
      <ScrollView>
        <Text style={styles.headingp}>Your Progress Report</Text>

        
        <View style={styles.top}>
        <Text style={styles.dateUpdate}>{update}</Text>
        </View>

        {/* In Progress Tasks */}
        <Text style={styles.section}>In Progress</Text>
        {inProgressTasks.length > 0 ? (
          inProgressTasks.map((task) => (
            <View key={task.id} style={styles.taskRow}>
              <Checkbox
                value={task.completed}
                onValueChange={() => toggleTask(task.id)}
                color={task.completed ? "#007aff" : undefined} />
              <Text style={styles.taskText}>{task.text}</Text>
              <Text style={styles.dateText}>
                {new Date(task.date).toLocaleString()}
              </Text>
            </View>
          ))
        ) : (
          <View>
             <Image style={{width: 150, height: 150, alignSelf: 'center', marginTop: 10,}} source={require("./assets/servey.png")} />
          <Text style={{textAlign: 'center', color: 'gray',}}>No tasks in progress </Text>
          </View>
        )}

        {/* Completed Tasks */}
        <Text style={styles.section}>Completed</Text>

        {completedTasks.length > 0 ? (
          completedTasks.map((task) => (
            <View key={task.id} style={styles.taskRow}>
              <Checkbox
                value={task.completed}
                onValueChange={() => toggleTask(task.id)}
                color={task.completed ? "#007aff" : undefined} />
              <Text
                style={[
                  styles.taskText,
                  { textDecorationLine: "line-through", color: "gray" },
                ]}
              >
                {task.text}
              </Text>
              <Text style={styles.dateText}>
                {new Date(task.date).toLocaleString()}
              </Text>
            </View>
          ))
        ) : (
          <View>
          <Image style={{width: 150, height: 150, alignSelf: 'center', marginTop: 10,}} source={require("./assets/completed.png")} />
          <Text style={{textAlign: 'center', color: 'gray',}}>No tasks completed yet</Text>
          </View>

        )}
      </ScrollView>
    </LinearGradient>
    <BottomNav>navigation={navigation}</BottomNav></>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    width: "100%",
    padding: 15,
  },

   top: {
    marginTop: 10,
    fontSize: 20,
    alignItems: "flex-end",
  },
 dateUpdate :{
  color: 'gray',

 },
  headingp: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginVertical: 10,
    letterSpacing: 0.6,
    color: "#2d2d2d",
    textShadowColor: "rgba(0, 0, 0, 0.25)", 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 4,
  },
  section: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.7)",
    padding: 10,
    borderRadius: 10,
  },
  taskText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  dateText: {
    fontSize: 10,
    marginLeft: 5,
    color: "gray",
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
    color: "#B9B9B8",
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

});

export default Progress;

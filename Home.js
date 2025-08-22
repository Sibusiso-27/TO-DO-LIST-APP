import { useContext } from "react";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native"; 
import { LinearGradient } from "expo-linear-gradient";
import { TasksContext } from "./App";
import { AnimatedCircularProgress } from "react-native-circular-progress";



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
        onPress={() => handleNavigate("HomeScreen")}
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
        <Text style={[styles.navText,
         route.name === "Home" && styles.activeNavText,]}
        >Home</Text>
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

const Egreeting = ({ greeting, fun }) => {
  return <Text style={styles.greeting}>{greeting}, {fun}</Text>;
};

const Interactions = ({ motivation }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Daily Motivation</Text>
      <Text style={styles.cardText}>{motivation}</Text>
    </View>
  );
};


const HomeScreen = () => {
  const navigation = useNavigation();
  const { todos } = useContext(TasksContext);

  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.completed).length;
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;
  

  const Emojis = ["😀","😄","🤔","😫","😝","🥱","😭","😡","😪","🙈","😬","😱","😶","🤗","🤢",
  "🥰", "👀", "🤸🏽‍♀️", "👍🏽", "🚶🏽‍♀️", "🌹",
  ];
  const [fun, setFun] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setFun(Emojis[Math.floor(Math.random() * Emojis.length)]);
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
    else if (hour >= 17 && hour < 21) setGreeting("Good Evening");
    else setGreeting("Hello");
  }, []);

   const motivationLines = [
    "Small steps every day lead to big results.",
    "Don’t wait for opportunity. Create it.",
    "Push yourself because no one else will.",
    "Consistency is the key to success.",
    "Focus on progress, not perfection.",
    "Dream it. Wish it. Do it.",
    "The secret of getting ahead is getting started.",
    "Today is a good day to start something new.",
    "A task a day, keeps the mind awake!.",
    "Your morning mindset shapes your day—plan it with purpose.",
    "It always seems impossible until it's done.",
    "Today is your opportunity to build the tomorrow you want."
  ];
  const [motivation, setMotivation] = useState("");
  useEffect(() => {
    setMotivation(
      motivationLines[Math.floor(Math.random() * motivationLines.length)]
    );
  }, []);




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

  return (
    <>
      <LinearGradient
        colors={["#D9E8F3","#FCD9D9", "#fff" ]}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <Egreeting greeting={greeting} fun={fun} />
          
          
          {/* Subtitle */}
          {/*<Text style={styles.subtitle}></Text>*/}
          <View style={styles.top}>
            <Text style={{fontWeight: 'bold', fontSize: 30,
              textShadowColor: "rgba(0,0,0,0.6)", 
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 4,
             }}>TODAY</Text>
            <Text style={styles.dateText}>{update}</Text>
          </View>
 <TouchableOpacity
  style={styles.card}
  onPress={() => navigation.navigate("Progress")}
  activeOpacity={0.8}
>
  

  {totalTasks === 0 ? (
    <View>
  <Text style={styles.cardTitle2}>Task Progress</Text>


    <Text style={styles.cardText}>
      No tasks in progress
    </Text>
    </View>
  ) : (
    <View style={styles.progressContainer}>
      
    <Text style={styles.cardTitle}>You're Crushing It🎉</Text>
      <AnimatedCircularProgress
        size={100}
        width={12}
        fill={progress * 100}
        tintColor="#c2deff"
        backgroundColor="#e0e0e0"
        rotation={0}
        lineCap="round"
      >
        {(fill) => (
          <Text style={styles.progressText}>
            {Math.round(fill)}%
          </Text>
        )}
      </AnimatedCircularProgress>
    </View>
  )}
</TouchableOpacity>

          {/* Motivation Card */}
           <Interactions motivation={motivation} />
        
          {/*FAB*/}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("Tasks")}
          >
            <LinearGradient
              colors={["#FCD9D9", "#D9E8F3"]}
              style={styles.fabBackground}
            >
              <Image
                style={{ width: 32, height: 32, tintColor: "#fff", marginRight: 3, marginLeft: 10, }}
                source={require("./assets/addbutton.png")}
              />
              <Text style={styles.fabText} > Add a 
                new to-do item  
              </Text>
              
               <Image
                style={{ width: 20, height: 20, tintColor: "#fff", marginLeft: 5}}
                 source={require("./assets/arrow-right.png")} 
                  />
            </LinearGradient>
          </TouchableOpacity>
        <View style={{
  backgroundColor: "#f9f9f9",
  borderRadius: 12,
  padding: 10,
  marginTop: 15,
  marginHorizontal: 20,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 3,
  shadowOffset: { width: 0, height: 2 }
}}>
  <Text style={{ fontSize: 12, color: "gray", textAlign: "center" }}>
    Reminders are set automatically for every task you create.
  </Text>
</View>
        </ScrollView>
      </LinearGradient>

    
      <BottomNav />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    
  },
  scrollContent: {
    padding: 25,
    paddingBottom: 140,
  
  },
  greeting: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 5,
    marginBottom: 10,
    marginRight: 0,
    color: "#2d2d2d",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.6)", 
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  top: {
    marginTop: 10,
  
  },
  dateText: {
    fontSize: 15,
    marginTop:3,
    color: "#666",
    fontWeight: "600",
    alignItems: "flex-end",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 20,
    fontWeight: "600",
    color: "#444",
  },
  card: {
    backgroundColor: "#ffffffcc",
    borderRadius: 22,
    padding: 24,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: "#222",
  },

    cardTitle2: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: "#222",
  },
  cardText: {
    fontSize: 15,
    color: "#555",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 22,
  },
  
  addButton: {
    alignSelf: "center",
    marginTop: 40,
  },
  fabBackground: {
    width: 270,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  fabText: {
  fontSize: 14,
  fontWeight: "600",
  color: "#fff",
},
  progressContainer: {
  alignItems: "center",
  marginTop: 15,

},
progressText: {
  fontSize: 18,
  fontWeight: "700",
  color: "#333",
  position: "absolute",
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

})
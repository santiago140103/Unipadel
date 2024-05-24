import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PlayerHomeScreen from "./PlayerHomeScreen";
import TorneosScreen from "./TorneosScreen";
import PartidosScreen from "./PartidosScreen";
import { colores } from "../../colors";

const PlayerNavigation = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Tab.Screen
        name="INICIO"
        component={PlayerHomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                style={[
                  { resizeMode: "contain", width: 20 },
                  focused ? { tintColor: colores.blue } : { tintColor: "gray" },
                ]}
                source={require("../../assets/images/icons/home.png")}
              />
            </View>
          ),
          tabBarActiveTintColor: colores.blue,
          tabBarInactiveTintColor: "black",
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="PARTIDOS"
        component={PartidosScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                style={[
                  { resizeMode: "contain", width: 20 },
                  focused ? { tintColor: colores.blue } : { tintColor: "gray" },
                ]}
                source={require("../../assets/images/icons/matches.png")}
              />
            </View>
          ),
          tabBarActiveTintColor: colores.blue,
          tabBarInactiveTintColor: "black",
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="TORNEOS"
        component={TorneosScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                style={[
                  { resizeMode: "contain", width: 20 },
                  focused ? { tintColor: colores.blue } : { tintColor: "gray" },
                ]}
                source={require("../../assets/images/icons/competitions.png")}
              />
            </View>
          ),
          tabBarActiveTintColor: colores.blue,
          tabBarInactiveTintColor: "black",
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

export default PlayerNavigation;

const styles = StyleSheet.create({});

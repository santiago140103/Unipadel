import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import RecursoForm from "./RecursoForm";
import OrganizerHomeScreen from "./OrganizerHomeScreen";

import { colores } from "../../colors";

const OrganizerNavigation = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Tab.Screen name="RecursoForm" component={RecursoForm}></Tab.Screen> */}
      <Tab.Screen
        name="INICIO"
        component={OrganizerHomeScreen}
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
    </Tab.Navigator>
  );
};

export default OrganizerNavigation;

const styles = StyleSheet.create({});

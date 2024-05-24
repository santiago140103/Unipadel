import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colores } from "../colors";

const Triangles = () => {
  return (
    <View>
      <View style={[styles.triangle, styles.triangleLeft]}></View>
      <View style={[styles.triangle, styles.triangleRight]}></View>
    </View>
  );
};

export default Triangles;

const styles = StyleSheet.create({
  triangle: {
    backgroundColor: "transparent",
    borderBottomWidth: 300,
    borderLeftWidth: 400,
    borderLeftColor: "transparent",
    borderRightWidth: 400,
    borderRightColor: "transparent",
    top: 20,
  },
  triangleLeft: {
    borderBottomColor: colores.blue,
    transform: [{ rotate: "-10deg" }],
    left: -100,
  },
  triangleRight: {
    position: "absolute",
    borderBottomColor: colores.yellow,
    transform: [{ rotate: "-30deg" }],
    left: 100,
  },
});

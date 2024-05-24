import { StyleSheet, Text, View } from "react-native";
import React from "react";

const TournamentBar = ({ nombre, en_juego }) => {
  return (
    <View style={styles.torneoBar}>
      <View style={styles.torneoBarBack}>
        <View
          style={[styles.circle, en_juego == 1 ? styles.green : styles.yellow]}
        ></View>
        <Text style={styles.text}>{nombre}</Text>
      </View>
      <View
        style={[styles.torneoStatus, en_juego == 1 ? styles.green : styles.yellow]}
      >
        <Text style={[styles.text, styles.textCenter]}>
          {en_juego ? "En juego" : "Pendiente"}
        </Text>
      </View>
    </View>
  );
};

export default TournamentBar;

const styles = StyleSheet.create({
  torneoBar: {
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },
  torneoBarBack: {
    width: "69%",
    backgroundColor: "lightgrey",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 5,
  },
  circle: {
    width: 15,
    height: 15,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  torneoStatus: {
    width: "29%",
    padding: 5,
    borderRadius: 5,
  },
  yellow: {
    backgroundColor: "#ffcc00",
  },
  green: {
    backgroundColor: "lightgreen",
  },
  text: {
    fontWeight: "bold",
  },
  textCenter: {
    textAlign: "center",
  },
});

import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { UserContext } from "../context/UserDataContext";

const UserBar = () => {
  const usuarioContext = useContext(UserContext);

  return (
    <View style={styles.userBar}>
      <View style={styles.circle}></View>
      <Text style={styles.text}>{usuarioContext.user.name}</Text>
      <Text style={styles.separador}>|</Text>
      <Text style={styles.text}>{usuarioContext.user.tipo == 1 ? "Organizador" : "Jugador"}</Text>
    </View>
  );
};

export default UserBar;

const styles = StyleSheet.create({
    userBar : {
        width: "95%",
        backgroundColor: "lightgrey",
        borderRadius: 5,
        padding: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    circle:{
        width: 15,
        height: 15,
        marginRight: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "#00ff00",
    },
    separador: {
        marginHorizontal: 5,
        fontWeight: "bold",
    },
    text:{
        fontWeight: "bold",
    }

});

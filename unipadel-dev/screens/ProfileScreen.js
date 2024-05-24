import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useContext } from "react";
import SupNavbar from "../components/supNavbar";
import { auth } from "../firebase";
import { StackActions, useNavigation } from "@react-navigation/core";
import { colores } from "../colors";

import { UserContext } from "../context/UserDataContext";

const ProfileScreen = () => {
  const usercontext = useContext(UserContext);
  const navigation = useNavigation();

  const handleLogOut = () => {
    auth
      .signOut()
      .then(() => {
        usercontext.reset();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      })
      .catch((err) => alert(err.message));
  };

  return (
    <View style={styles.container}>
      <SupNavbar></SupNavbar>
      <View style={styles.user}>
        <View style={styles.userIcon}>
          <Image
            style={{ resizeMode: "contain", width: "100%" }}
            source={
              usercontext.user.tipo == 1
                ? require("../assets/images/icons/organizer.png")
                : require("../assets/images/icons/player.png")
            }
          />
        </View>
        <Text style={styles.userText}>{usercontext.user.name}</Text>
      </View>
      <View style={styles.estadisticasContainer}>
        <Text style={styles.estadisticasContainerTitle}>Estadísicas</Text>
        {usercontext.user.tipo == 0 ? (
          <View>
            <View style={styles.estadisticasContainerLine} />
            <Text style={{textAlign: "center", marginTop: 5}}>No disponibles por el momento</Text>
            {/* <Text style={styles.estadisticasContainerData}>
              Partidos jugados:
            </Text>
            <View style={styles.estadisticasContainerLine} />
            <Text style={styles.estadisticasContainerData}>Victorias:</Text>
            <View style={styles.estadisticasContainerLine} />
            <Text style={styles.estadisticasContainerData}>% Victorias:</Text>
            <View style={styles.estadisticasContainerLine} />
            <Text style={styles.estadisticasContainerData}>
              Participaciones en torneos:
            </Text> */}
          </View>
        ) : (
          <View>
            <View style={styles.estadisticasContainerLine} />
            {/* <Text style={styles.estadisticasContainerData}>
              Nº de torneos creados: -
            </Text> */}
            <Text style={{textAlign: "center", marginTop: 5}}>No disponibles por el momento</Text>
          </View>
        )}
      </View>
      {usercontext.user.tipo == 0 && (
        <TouchableOpacity
          style={[styles.button, styles.customButton]}
          onPress={() => {
            navigation.push("ParejaForm");
          }}
        >
          <Text style={[styles.buttonText, styles.customText]}>
            Crear pareja
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.button, styles.logout]}
        onPress={handleLogOut}
      >
        <Text style={[styles.buttonText, styles.logoutText]}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  estadisticasContainer: {
    backgroundColor: colores.yellow,
    width: "90%",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
  },
  estadisticasContainerTitle: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  estadisticasContainerLine: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  estadisticasContainerData: {
    fontWeight: "bold",
    fontSize: 16,
    marginVertical: 5,
  },
  button: {
    width: "90%",
    paddingVertical: 20,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
  },
  customButton: {
    backgroundColor: "white",
  },
  logout: {
    backgroundColor: "darkred",
  },
  logoutText: {
    color: "white",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "lightgray",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    width: "90%",
  },
  userIcon: {
    width: "20%",
  },
  userText: {
    fontSize: 22,
    fontWeight: "bold",
    width: "80%",
    textAlign: "center",
  },
});

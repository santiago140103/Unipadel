import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import SupNavbar from "../../components/supNavbar";
import UserBar from "../../components/UserBar";
import { useNavigation } from "@react-navigation/core";
import { colores } from "../../colors";
import { getTorneosOrg } from "../../api";
import { UserContext } from "../../context/UserDataContext";

const OrganizerHomeScreen = () => {
  const usercontext = useContext(UserContext);
  const navigation = useNavigation();
  
  // const unsubscribe = navigation.addListener('focus', () => {
  //   loadTorneosJuego();
  //   loadTorneosOrg();
  // });

  const [torneosJuego, setTorneosJuego] = useState("");
  const [torneosOrg, setTorneosOrg] = useState("");

  const loadTorneosJuego = async () => {
    const data = await getTorneosOrg(usercontext.user.id, 1);
    setTorneosJuego(data.data);
  };

  const loadTorneosOrg = async () => {
    const data = await getTorneosOrg(usercontext.user.id, 0);
    setTorneosOrg(data.data);
  };

  useEffect(() => {
    loadTorneosJuego();
    loadTorneosOrg();
  }, []);

  return (
    <View style={styles.container}>
      <SupNavbar></SupNavbar>
      <UserBar></UserBar>
      <View style={[styles.compContainer, styles.enJuego]}>
        <Text style={styles.title}>Competiciones en juego</Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          {torneosJuego.length === 0 ? (
            <Text>No hay competiciones en juego...</Text>
          ) : (
            torneosJuego.map((item, key) => (
              <TouchableOpacity
                style={[styles.competicion, styles.backBlue]}
                key={item.id}
                onPress={() =>
                  navigation.navigate("GestionarTorneo", { id: item.id })
                }
              >
                <Text style={[styles.nombreComp, styles.textWhite]}>
                  {item.nombre}
                </Text>
                <View style={styles.imageContainer}>
                  <Image
                    style={{ resizeMode: "contain", width: 50, height: 50 }}
                    source={require("../../assets/images/icons/trofeo.png")}
                  />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
      <View style={[styles.compContainer, styles.organizadas]}>
        <Text style={styles.title}>Competiciones organizadas</Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          {torneosOrg.length === 0 ? (
            <Text>No se encuentran competiciones...</Text>
          ) : (
            torneosOrg.map((item, key) => (
              <TouchableOpacity
                style={[styles.competicion, styles.backBlue]}
                key={item.id}
                onPress={() =>
                  navigation.navigate("GestionarTorneo", { id: item.id })
                }
              >
                <Text style={[styles.nombreComp, styles.textWhite]}>
                  {item.nombre}
                </Text>
                <View style={styles.imageContainer}>
                  <Image
                    style={{ resizeMode: "contain", width: 50, height: 50 }}
                    source={require("../../assets/images/icons/trofeo.png")}
                  />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.push("TorneoForm");
        }}
      >
        <Text style={styles.buttonText}>Crear competición</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.push("ListadoTorneosOrganizador");
        }}
      >
        <Text style={styles.buttonText}>Competiciones creadas</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrganizerHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  compContainer: {
    width: "90%",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  enJuego: {
    backgroundColor: colores.lightyellow,
  },
  organizadas: {
    backgroundColor: colores.lightblue,
  },
  scrollView: {
    marginTop: 10,
    flexGrow: 1,
    justifyContent: "center",
  },
  competicion: {
    padding: 5,
    width: 120,
    marginHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBlue: {
    backgroundColor: colores.darkblue,
  },
  nombreComp: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  textWhite: {
    color: "white",
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  button: {
    width: "90%",
    padding: 18,
    marginVertical: 10,
    backgroundColor: "#f2f2f2",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

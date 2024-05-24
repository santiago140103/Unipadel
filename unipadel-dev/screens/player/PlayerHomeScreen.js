import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import SupNavbar from "../../components/supNavbar";
import { useNavigation } from "@react-navigation/native";
import UserBar from "../../components/UserBar";
import { colores } from "../../colors";
import { getPartido, getTorneosJugador } from "../../api";
import Partido from "../../components/Partido";
import { UserContext } from "../../context/UserDataContext";

const PlayerHomeScreen = () => {
  const navigation = useNavigation();
  const usercontext = useContext(UserContext);

  const [partido, setPartido] = useState({});
  const [competiciones, setCompeticiones] = useState("");

  const loadProximoPartido = async () => {
    const data = await getPartido(usercontext.user.id);
    setPartido(data.data);
  };

  const loadTorneos = async () => {
    const data = await getTorneosJugador(usercontext.user.id);
    setCompeticiones(data.data);
  };

  useEffect(() => {
    loadProximoPartido();
    loadTorneos();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <SupNavbar></SupNavbar>
      <ScrollView
        contentContainerStyle={styles.container}
        style={{ backgroundColor: "white" }}
      >
        <UserBar></UserBar>
        <View style={styles.partidoContainer}>
          <Text style={styles.containerTitle}>Próximo partido</Text>
          {Object.keys(partido).length === 0 ? (
            <Text style={styles.containerWarning}>
              En este momento no tiene ningún partido programado
            </Text>
          ) : (
            <Partido partido={partido} hasActions={false}></Partido>
          )}
        </View>
        <View style={styles.competicionContainer}>
          <Text style={styles.containerTitle}>Competiciones actuales</Text>
          {competiciones.length == 0 ? (
            <Text style={styles.containerWarning}>
              En este momento no se encuentra inscrito en ninguna competición
              activa
            </Text>
          ) : (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollView}
            >
              {competiciones.map((data) => (
                <TouchableOpacity style={styles.competicion} key={data.id} onPress={() => navigation.navigate("PlayerTorneoScreen", { id: data.id })}>
                  <Text style={styles.nombreComp} numberOfLines={2}>{data.nombre}</Text>
                  <View style={styles.imageContainer}>
                    <Image
                      style={{ resizeMode: "contain", width: 50, height: 50 }}
                      source={require("../../assets/images/icons/trofeo.png")}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.push("PartidosScreen");
          }}
        >
          <Text style={styles.buttonText}>Mis partidos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.push("InscripcionesUsuario");
          }}
        >
          <Text style={styles.buttonText}>Mis inscripciones</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.push("HistoricoPartidosUsuario");
          }}
        >
          <Text style={styles.buttonText}>Histórico de resultados</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PlayerHomeScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  containerTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  partidoContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: colores.yellow,
    borderRadius: 10,
  },
  competicionContainer: {
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: colores.lightblue,
    width: "91%",
    borderRadius: 10,
  },
  containerWarning: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 5,
    padding: 10,
    borderTopWidth: 1,
    borderRadius: 5,
    fontStyle: "italic"
  },
  scrollView: {
    flexGrow: 1,
    paddingTop: 10,
    justifyContent: "center",
  },
  competicion: {
    backgroundColor: colores.darkblue,
    padding: 5,
    width: 120,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  nombreComp: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "white",
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

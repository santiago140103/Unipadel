import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/core";
import { colores } from "../../colors";

import { getTorneos, getPartido } from "../../api";
import { UserContext } from "../../context/UserDataContext";

import TournamentBar from "../../components/TournamentBar";
import SupNavbar from "../../components/supNavbar";
import Partido from "../../components/Partido";

const PlayerTorneoScreen = ({ route }) => {
  const torneoId = route.params.id;
  const navigation = useNavigation();
  const usercontext = useContext(UserContext);

  const [torneo, setTorneo] = useState("");
  const [partido, setPartido] = useState({});

  const getTorneo = async () => {
    const data = await getTorneos(torneoId);
    setTorneo(data.data);
  };

  const loadProximoPartido = async () => {
    const data = await getPartido(usercontext.user.id, torneoId);
    setPartido(data.data);
  };

  useEffect(() => {
    getTorneo();
    loadProximoPartido();
  }, []);

  return (
    <View style={styles.container}>
      <SupNavbar></SupNavbar>
      <TournamentBar
        nombre={torneo.nombre}
        en_juego={torneo.estado}
      ></TournamentBar>
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
      <TouchableOpacity
        style={[styles.calendarContainer, styles.shadow]}
        onPress={() =>
          navigation.navigate("TorneoPartidosUsuario", { torneo: torneo })
        }
      >
        <Text style={styles.calendarText}>Calendario del torneo</Text>
        <View style={styles.imageContainer}>
          <Image
            style={{ resizeMode: "contain", width: 50, height: 50 }}
            source={require("../../assets/images/icons/calendar.png")}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.calendarContainer, styles.shadow]}
        onPress={() =>
          navigation.navigate("ClasificacionTorneo", { torneo: torneo })
        }
      >
        <Text style={styles.calendarText}>Resultados / Clasificación</Text>
        <View style={styles.imageContainer}>
          <Image
            style={{ resizeMode: "contain", width: 50, height: 50 }}
            source={require("../../assets/images/icons/trofeo.png")}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.shadow]}>
        <Text style={styles.text}>Datos competición</Text>
        <View style={styles.imageContainer}>
          <Image
            style={{ resizeMode: "contain", width: 50, height: 50 }}
            source={require("../../assets/images/icons/settings.png")}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PlayerTorneoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  containerTitle: {
    fontSize: 18,
    textAlign: "center",
    color: colores.darkblue,
    fontWeight: "bold",
  },
  calendarContainer: {
    width: "90%",
    marginBottom: 15,
    backgroundColor: colores.lightblue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  calendarText: {
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 15,
  },
  button: {
    width: "90%",
    padding: 15,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 15,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

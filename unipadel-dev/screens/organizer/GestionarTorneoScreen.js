import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";

import TournamentBar from "../../components/TournamentBar";
import SupNavbar from "../../components/supNavbar";
import { getTorneos, generarCalendario, getTorneosOrg } from "../../api";
import { colores } from "../../colors";

const GestionarTorneoScreen = ({ route }) => {
  const id = route.params.id;
  const navigation = useNavigation();

  const [torneo, setTorneo] = useState("");
  const [dias, setDias] = useState("");

  const getTorneo = async () => {
    const data = await getTorneos(id);
    setTorneo(data.data);
    setDias(
      Math.round((new Date(data.data.fecha_inicio) - new Date()) / 86400000)
    );
  };

  const generateFixtures = async () => {
    let request = {
      torneo: torneo.id,
    };
    const data = await generarCalendario(request).then(() => {
      Alert.alert(
        "¡Calendario generado!",
        "Se ha generado un caledario de partidos para el torneo en base a las inscripciones y los recursos creados hasta la fecha",
        [
          {
            text: "¡OK!",
          },
        ]
      );
    });
    getTorneo();
  };

  useEffect(() => {
    getTorneo();
  }, []);

  return (
    <View style={styles.container}>
      <SupNavbar></SupNavbar>
      <TournamentBar
        nombre={torneo.nombre}
        en_juego={torneo.estado}
      ></TournamentBar>
      {torneo.estado == 1 ? (
        <View style={{ width: "100%", alignItems: "center" }}>
          {/* <TouchableOpacity style={[styles.calendarContainer, styles.shadow]}>
            <Text style={styles.calendarText}>Gestionar partidos</Text>
            <View style={styles.imageContainer}>
              <Image
                style={{ resizeMode: "contain", width: 50, height: 50 }}
                source={require("../../assets/images/icons/parejas.png")}
              />
            </View>
          </TouchableOpacity> */}

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
        </View>
      ) : (
        <View style={{ width: "100%", alignItems: "center" }}>
          <View style={styles.timer}>
            <View style={styles.imageContainer}>
              <Image
                style={{ resizeMode: "contain", width: 60, height: 60 }}
                source={require("../../assets/images/icons/timer.png")}
              />
            </View>
            <Text style={styles.timerText}>Empieza en: {dias} días</Text>
          </View>
        </View>
      )}
      {torneo.calendario_generado ? (
        <TouchableOpacity
          style={[styles.calendarContainer, styles.shadow]}
          onPress={() =>
            navigation.navigate("TorneoPartidosScreen", { torneo: torneo })
          }
        >
          <Text style={styles.calendarText}>Gestionar Calendario</Text>
          <View style={styles.imageContainer}>
            <Image
              style={{ resizeMode: "contain", width: 50, height: 50 }}
              source={require("../../assets/images/icons/calendar.png")}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.calendarContainer, styles.shadow]}
          onPress={() => generateFixtures()}
        >
          <Text style={styles.calendarText}>Generar Calendario</Text>
          <View style={styles.imageContainer}>
            <Image
              style={{ resizeMode: "contain", width: 50, height: 50 }}
              source={require("../../assets/images/icons/calendar.png")}
            />
          </View>
        </TouchableOpacity>
      )}
      <View style={styles.gestionarContainer}>
        <TouchableOpacity
          style={[styles.gestionarButton, styles.shadow]}
          onPress={() =>
            navigation.navigate("GestionarRecursos", { torneo: torneo })
          }
        >
          <Text style={styles.gestionarText}>Gestionar recursos</Text>
          <View style={styles.imageContainer}>
            <Image
              style={{ resizeMode: "contain", width: 60, height: 60 }}
              source={require("../../assets/images/icons/field.png")}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.gestionarButton, styles.shadow]}
          onPress={() =>
            navigation.navigate("GestionarInscripciones", { torneo: torneo })
          }
        >
          <Text style={styles.gestionarText}>Jugadores inscritos</Text>
          <View style={styles.imageContainer}>
            <Image
              style={{ resizeMode: "contain", width: 60, height: 60 }}
              source={require("../../assets/images/icons/player.png")}
            />
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.button, styles.shadow]}>
        <Text style={styles.text}>Editar datos competición</Text>
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

export default GestionarTorneoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  timer: {
    marginBottom: 15,
    backgroundColor: colores.darkblue,
    padding: 10,
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  timerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 5,
  },
  gestionarContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  gestionarButton: {
    width: "47%",
    padding: 20,
    backgroundColor: colores.lightyellow,
    alignItems: "center",
  },
  gestionarText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 5,
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

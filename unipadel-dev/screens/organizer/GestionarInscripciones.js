import { StyleSheet, Text, View, Image, FlatList, Alert } from "react-native";
import React, { useState, useEffect } from "react";

import SupNavbar from "../../components/supNavbar";
import TournamentBar from "../../components/TournamentBar";
import { colores } from "../../colors";

import { getInscripciones } from "../../api";
import Equipo from "../../components/Equipo";

import { validatePareja } from "../../api";

const GestionarInscripcionesScreen = ({ route }) => {
  const torneo = route.params.torneo;
  const [equipos, setEquipos] = useState("");
  const [inscritos, setInscritos] = useState("");

  async function loadEquipos() {
    const data = await getInscripciones(torneo.id);
    setEquipos(data.data);
    setInscritos(data.data.length);
  }

  useEffect(() => {
    loadEquipos();
  }, []);

  const validateEquipo = (pareja, validate) => {
    validatePareja({
      torneo: torneo.id,
      pareja: pareja,
      validate: validate,
    })
      .then(() => {
        let title = validate ? "¡Pareja validada!" : "¡Pareja rechazada!";
        let subtitle = validate
          ? "Se ha validado a la pareja para el torneo. Se confirma su participación y tendrán acceso al mismo."
          : "Se ha rechazado la inscripción de la pareja en el torneo";
        Alert.alert(title, subtitle, [
          {
            text: "¡OK!",
          },
        ]);
        loadEquipos();
      })
      .catch((error) => {
        Alert.alert("Error en la inscripción", error.response.data.message, [
          {
            text: "Vale",
            style: "cancel",
          },
        ]);
      });
  };

  const renderItem = ({ item }) => {
    return <Equipo equipo={item} validateEquipo={validateEquipo}></Equipo>;
  };

  return (
    <View style={styles.container}>
      <SupNavbar></SupNavbar>
      <TournamentBar
        nombre={torneo.nombre}
        en_juego={torneo.estado}
      ></TournamentBar>
      <View style={styles.recuadro}>
        <Text style={styles.title}>Equipos inscritos</Text>
        <View style={[styles.recuadroInscritos, styles.shadow]}>
          <View style={styles.imageContainer}>
            <Image
              style={{ resizeMode: "contain", width: 50, height: 50 }}
              source={require("../../assets/images/icons/player.png")}
            />
          </View>
          <Text style={styles.recuadroInscritosText}>
            {inscritos} de {torneo.max_parejas} inscritos
          </Text>
        </View>
      </View>
      <View style={styles.spacer}></View>

      {inscritos > 0 ? (
        <FlatList
          data={equipos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.listado}
          contentContainerStyle={{ alignItems: "center" }}
        />
      ) : (
        <View style={styles.noInscritos}>
          <Text style={styles.noInscritosText}>
            Todavía no se ha inscrito ningún equipo
          </Text>
        </View>
      )}
    </View>
  );
};

export default GestionarInscripcionesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  recuadro: {
    width: "90%",
    marginBottom: 10,
  },
  title: {
    marginBottom: 5,
    color: colores.darkblue,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  recuadroInscritos: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  recuadroInscritosText: {
    fontSize: 18,
    marginLeft: 20,
    fontWeight: "bold",
  },
  spacer: {
    width: "80%",
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  listado: {
    width: "90%",
    marginTop: 10,
  },
  noInscritos: {
    marginTop: 10,
    width: "90%",
    padding: 20,
    borderRadius: 5,
    backgroundColor: "lightgray",
  },
  noInscritosText: {
    textAlign: "center",
  },
});

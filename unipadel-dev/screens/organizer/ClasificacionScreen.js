import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";

import TournamentBar from "../../components/TournamentBar";
import SupNavbar from "../../components/supNavbar";
import { getResultadosTorneo } from "../../api";
import { colores } from "../../colors";

const ClasificacionScreen = ({ route }) => {
  const torneo = route.params.torneo;
  const navigation = useNavigation();

  const [resultados, setResultados] = useState([]);

  const getResultados = async () => {
    const data = await getResultadosTorneo(torneo.id);
    setResultados(data.data);
  };

  useEffect(() => {
    getResultados();
  }, []);

  return (
    <View style={styles.container}>
      <SupNavbar></SupNavbar>
      <TournamentBar
        nombre={torneo.nombre}
        en_juego={torneo.estado}
      ></TournamentBar>
      <View style={styles.clasificacion}>
        <Text style={styles.title}>Clasificación</Text>
        <View style={styles.firstRow}>
          <Text style={styles.pos}>Pos</Text>
          <Text style={styles.equipo}>Equipo</Text>
          <Text style={styles.res}>V</Text>
          <Text style={styles.res}>D</Text>
          <Text style={styles.res}>+/-</Text>
        </View>
        {resultados.length == 0 ? (
          <Text>Cargando resultados</Text>
        ) : (
          resultados.map((i, k) => {
            return (
              <View style={[styles.tableRows, ++k%2 == 0 ? styles.par : styles.impar]} key={i.id}>
                <Text style={[styles.pos, k == 1 ? styles.first : k == 2 ? styles.second : k == 3 ? styles.third : '']}>{k}</Text>
                <Text style={styles.equipo}>{i.pareja.nombre}</Text>
                <Text style={styles.res}>{i.p_ganados}</Text>
                <Text style={styles.res}>{i.p_perdidos}</Text>
                <Text style={styles.res}>{i.s_ganados - i.s_perdidos}</Text>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
};

export default ClasificacionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  clasificacion: {
    backgroundColor: colores.blue,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "white"
  },
  firstRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: colores.yellow,
  },
  tableRows: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    // paddingVertical: 5
  },
  pos: {
    width: "20%",
    textAlign: "center",
    paddingVertical: 5
  },
  equipo: {
    width: "50%",
    textAlign: "center",
    paddingVertical: 5
  },
  res:{
    width: "10%",
    textAlign: "center",
    paddingVertical: 5
  },
  par: {
    backgroundColor: "white"
  },
  impar: {
    backgroundColor: colores.lightblue
  },
  first:{
    backgroundColor: "gold"
  },
  second:{
    backgroundColor: "silver"
  },
  third:{
    backgroundColor: "#CD7F32"
  }
});

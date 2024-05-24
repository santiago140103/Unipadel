import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";

import SupNavbar from "../../components/supNavbar";
import TournamentBar from "../../components/TournamentBar";
import { colores } from "../../colors";

import { getCanchaTorneo } from "../../api";

const GestionarRecursosScreen = ({ route }) => {
  const torneo = route.params.torneo;
  const navigation = useNavigation();
  
  // const unsubscribe = navigation.addListener('focus', () => {
  //   loadCanchas();
  // });

  const [canchas, setCanchas] = useState("");

  const loadCanchas = async () => {
    const data = await getCanchaTorneo(torneo.id);
    setCanchas(data.data);
    console.log(canchas);
  };

  useEffect(() => {
    loadCanchas();
  }, []);

  return (
    <View style={styles.container}>
      <SupNavbar></SupNavbar>
      <TournamentBar
        nombre={torneo.nombre}
        en_juego={torneo.estado}
      ></TournamentBar>
      <View style={styles.asignados}>
        <Text style={styles.title}>Recursos asignados</Text>
        {canchas.length == 0 ? (
          <View style={styles.noRecursos}>
            <Text style={styles.noRecursosText}>
              No hay recursos asignados todavía
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}
          >
            {canchas.map((item, key) => (
              <TouchableOpacity
                style={[styles.competicion, styles.backBlue]}
                key={item.id}
                onPress={() =>
                  navigation.navigate("HorariosTorneoScreen", { cancha: item.id, isTorneo: false })
                }
              >
                <Text style={{textTransform: "uppercase", fontWeight: "bold"}}>
                  {item.nombre}
                </Text>
                <View style={styles.imageContainer}>
                  <Image
                    style={{ resizeMode: "contain", width: 50, height: 50 }}
                    source={require("../../assets/images/icons/field.png")}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
      <View style={styles.spacer}></View>
      <TouchableOpacity
        style={[styles.gestionarButton, styles.shadow]}
        onPress={() => {
          navigation.navigate("RecursoForm", { id: torneo.id });
        }}
      >
        <View style={styles.imageContainer}>
          <Image
            style={{ resizeMode: "contain", width: 50, height: 50 }}
            source={require("../../assets/images/icons/plus.png")}
          />
        </View>
        <Text style={styles.gestionarText}>Agregar cancha</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.gestionarButton, styles.shadow]}
        onPress={() => {
          navigation.navigate("HorariosTorneoScreen", { torneo: torneo.id, isTorneo: true });
        }}
      >
        <View style={styles.imageContainer}>
          <Image
            style={{ resizeMode: "contain", width: 50, height: 50 }}
            source={require("../../assets/images/icons/calendar.png")}
          />
        </View>
        <Text style={styles.gestionarText}>Ver horario completo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GestionarRecursosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  asignados: {
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
  noRecursos: {
    padding: 20,
    borderRadius: 5,
    backgroundColor: "lightgray",
  },
  noRecursosText: {
    textAlign: "center",
  },
  spacer: {
    width: "80%",
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  gestionarButton: {
    width: "90%",
    marginTop: 10,
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colores.darkblue,
  },
  gestionarText: {
    marginLeft: 10,
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
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
    backgroundColor: colores.yellow,
  },
});

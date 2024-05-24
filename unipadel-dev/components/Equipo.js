import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { colores } from "../colors";

const Equipo = ({ equipo, validateEquipo }) => {
  return (
    <View style={styles.equipo}>
      <View style={styles.superior}>
        <Text style={styles.nombre}>{equipo.nombre}</Text>
        <View style={styles.acciones}>
          {equipo.validated == 0 && (
            <TouchableOpacity
              style={styles.botonValidar}
              onPress={() => validateEquipo(equipo.id, 1)}
            >
              <Text style={styles.botonValidarText}>Validar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.botonRechazar}
            onPress={() => validateEquipo(equipo.id, 0)}
          >
            <Text style={styles.botonValidarText}>Rechazar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={[
          styles.jugadores,
          equipo.validated
            ? styles.jugadoresValidated
            : styles.jugadoresNoValidated,
        ]}
      >
        {equipo.usuarios.map((i, k) => {
          return <Text key={i.id}>{i.name}</Text>;
        })}
      </View>
    </View>
  );
};

export default Equipo;

const styles = StyleSheet.create({
  equipo: {
    width: 300,
    marginBottom: 10,
  },
  superior: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  acciones: {
    flexDirection: "row",
    width: "50%",
    justifyContent: "flex-end"
  },
  botonValidar: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: colores.darkblue,
  },
  botonRechazar: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: "darkred",
    marginLeft: 5,
  },
  botonValidarText: {
    color: "white",
  },
  nombre: {
    width: "50%",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 5,
  },
  jugadores: {
    marginBottom: 10,
    padding: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  jugadoresValidated: {
    backgroundColor: "lightgreen",
  },
  jugadoresNoValidated: {
    backgroundColor: colores.yellow,
  },
});

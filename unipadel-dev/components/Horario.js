import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React, { useState, useContext } from "react";
import { colores } from "../colors";
import moment from "moment/moment";

import { UserContext } from "../context/UserDataContext";

const Horario = ({
  horario,
  liberarHorario,
  asignarPartido,
  proponerPartido,
}) => {
  const user = useContext(UserContext);

  return (
    <View
      style={[styles.horario, horario.ocupado ? styles.ocupado : styles.libre]}
    >
      <TouchableOpacity
        style={[
          styles.estado,
          horario.ocupado ? styles.ocupadoInd : styles.libreInd,
        ]}
      >
        <Text style={styles.estText}>
          {horario.ocupado ? "Ocupado" : "Libre"}
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.nombre}>
          {moment(horario.inicio).format("DD-MM-YYYY")}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.nombre}>
            {moment(horario.inicio).format("HH:mm")}-
          </Text>
          <Text style={styles.nombre}>
            {moment(horario.fin).format("HH:mm")}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: 5,
          justifyContent: horario.ocupado == 1 ? "center" : "space-between",
        }}
      >
        <Text style={styles.nombre}>{horario.cancha.nombre}</Text>
        {asignarPartido != null ? (
          <TouchableOpacity
            style={{
              backgroundColor: colores.darkblue,
              padding: 5,
              borderRadius: 5,
            }}
            onPress={() => asignarPartido(horario.id)}
          >
            <Text
              style={{
                color: "white",
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
            >
              Asignar
            </Text>
          </TouchableOpacity>
        ) : proponerPartido != null ? (
          <TouchableOpacity
            style={{
              backgroundColor: colores.darkblue,
              padding: 5,
              borderRadius: 5,
            }}
            onPress={() => proponerPartido(horario.id)}
          >
            <Text
              style={{
                color: "white",
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
            >
              Proponer
            </Text>
          </TouchableOpacity>
        ) : (
          horario.ocupado == 0 && (
            <TouchableOpacity
              style={{
                backgroundColor: colores.darkblue,
                padding: 5,
                borderRadius: 5,
              }}
              onPress={() => liberarHorario(horario.id)}
            >
              <Text
                style={{
                  color: "white",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                Liberar horario
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
};

export default Horario;

const styles = StyleSheet.create({
  horario: {
    borderRadius: 10,
    padding: 15,
    marginTop: 25,
    width: 400,
    maxWidth: "90%",
  },
  libre: {
    backgroundColor: "#c2f0c2",
  },
  ocupado: {
    backgroundColor: colores.lightblue,
  },
  libreInd: {
    backgroundColor: "darkgreen",
  },
  ocupadoInd: {
    backgroundColor: colores.darkblue,
  },
  finalizado: {
    backgroundColor: "lightgreen",
  },
  nombre: {
    textAlign: "center",
    fontSize: 20,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  contentText: {
    fontWeight: "bold",
    marginTop: 2,
  },
  botones: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  boton: {
    backgroundColor: colores.darkblue,
    borderRadius: 15,
    padding: 10,
    width: "40%",
    elevation: 5,
  },
  botonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  boton2: {
    backgroundColor: "white",
  },
  botonText2: {
    color: colores.darkblue,
  },
  estado: {
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    position: "absolute",
    top: -15,
    left: -15,
    elevation: 10,
  },
  no_empezadoEst: {
    backgroundColor: colores.darkblue,
  },
  empezadoEst: {
    backgroundColor: colores.green,
  },
  finalizadoEst: {
    backgroundColor: colores.orange,
  },
  estText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

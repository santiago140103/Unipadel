import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { colores } from "../colors";

const Jugador = ({ jugador, addPlayer, jugadoresPareja }) => {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    jugadoresPareja.includes(jugador.id) && setSelected(true);
  }, []);

  return (
    <View style={[styles.jugador, selected && styles.selected]}>
      <View>
        <Text style={styles.jugadorText}>{jugador.name}</Text>
        <Text style={styles.jugadorText}>Alias</Text>
      </View>
      {selected ? (
        <TouchableOpacity style={styles.aviso}>
          <Text style={styles.avisoText}>¡Añadido!</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            addPlayer(jugador);
            setSelected(true);
          }}
        >
          <Text style={styles.buttonText}>Añadir al grupo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Jugador;

const styles = StyleSheet.create({
  jugador: {
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colores.lightyellow,
    borderColor: colores.yellow,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginVertical: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selected: {
    backgroundColor: colores.lightblue,
    borderColor: colores.blue,
  },
  jugadorText: {
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  aviso: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colores.green,
    borderRadius: 10,
    padding: 5,
  },
  avisoText: {
    color: colores.green,
  },
});

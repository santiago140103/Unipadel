import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Alert,
  TextInput
} from "react-native";
import React, { useState } from "react";
import { colores } from "../colors";
import { asignarResultadoPartido } from "../api";

const SelectorResultadoAsignado = ({
  modalVisible,
  setModalVisible,
  partido,
  torneo,
  p1,
  p2,
  onRefresh
}) => {
  const [r1, setR1] = useState(0);
  const [r2, setR2] = useState(0);

  const asignarResultado = async () => {
    const request = {
      partido: partido,
      torneo: torneo,
      puntos1: r1,
      puntos2: r2 
    };

    const data = await asignarResultadoPartido(request)
      .then(() => {
        onRefresh();
        setModalVisible(!modalVisible);
        Alert.alert(
          "¡Resultado asignado!",
          "Se ha asignado el resultado al partido",
          [
            {
              text: "¡OK!",
            },
          ]
        );
      })
      .catch(() => {
        Alert.alert(
          "Error en el guardado",
          "Ha surgido un error y no se ha podido guardar la información. Por favor, revise la información y vuelva a intentarlo.",
          [
            {
              text: "Vale",
              style: "cancel",
            },
          ]
        );
      });
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          modalVisible = !modalVisible;
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* Resultado P1 */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Puntos para: {p1.nombre}</Text>
              <TextInput
                placeholder="Sets pareja local"
                value={r1}
                onChangeText={(text) => setR1(text)}
                style={styles.input}
                keyboardType="numeric"
              />
            </View>

            {/* Resultado P2 */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Puntos para: {p2.nombre}</Text>
              <TextInput
                placeholder="Sets pareja visitante"
                value={r2}
                onChangeText={(text) => setR2(text)}
                style={styles.input}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              style={[styles.button, styles.buttonPropose]}
              onPress={() => asignarResultado()}
            >
              <Text style={styles.textStylePropose}>Asignar resultado</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SelectorResultadoAsignado;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalView: {
    padding: 20,
    width: "90%",
    backgroundColor: "white",
    justifyContent: "space-between",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: colores.yellow,
    marginTop: 10,
  },
  buttonPropose: {
    backgroundColor: colores.blue,
    marginTop: 10,
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  textStylePropose: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  pareja: {
    backgroundColor: "lightgrey",
    padding: 20,
    marginVertical: 10,
  },
  parejaText: {
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    color: "grey",
  },
  label: {
    color: colores.darkblue,
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
  },
});

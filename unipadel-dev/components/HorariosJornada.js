import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import { colores } from "../colors";
import { asignarHorarios } from "../api";

const HorariosJornada = ({
  modalVisible,
  setModalVisible,
  jornadas,
  torneo,
  onRefresh
}) => {
  const [jornada, setJornada] = useState(0);
  const [showI, setShowI] = useState(false);
  const [showF, setShowF] = useState(false);
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");

  const onChangeI = (event, selectedDate) => {
    setShowI(false);
    setInicio(selectedDate);
  };

  const onChangeF = (event, selectedDate) => {
    setShowF(false);
    setFin(selectedDate);
  };

  const showDatepicker = (i) => {
    switch (i) {
      case 0:
        setShowI(true);
        break;
      case 1:
        setShowF(true);
        break;
      default:
        break;
    }
  };

  const handleStore = async () => {
    if (jornada == 0 || inicio == "" || fin == "") {
      Alert.alert(
        "¡Rellena el formulario!",
        "Debes introducir todos los datos para continuar",
        [
          {
            text: "¡OK!",
          },
        ]
      );
      return;
    }

    const request = {
      jornada: jornada,
      fecha_inicio: inicio.toString(),
      fecha_fin: fin.toString(),
      torneo: torneo,
    };
    // console.log(request);
    const res = await asignarHorarios(request)
      .then((response) => {
        onRefresh();
        Alert.alert(
          response.data.jornada
            ? "¡Jornada completa!"
            : "¡Horarios establecidos!",
          response.data.jornada
            ? "Todos los partidos de la jornada tienen horarios asignados"
            : response.data.horarios
            ? "Agregados horarios a todos los partidos de la jornada"
            : "Se han asignado horarios a la jornada pero han quedado partidos sin asignar, pues no se disponen de los recursos necesarios. Se requiere una asignación manual por parte del administrador.",
          [
            {
              text: "¡OK!",
              onPress: () => setModalVisible(!modalVisible),
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
            {/* Jornada a rellenar */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                ¿A qué jornada quieres asignar horarios?
              </Text>
              <View style={[styles.input, { paddingVertical: 0 }]}>
                <Picker
                  selectedValue={jornada}
                  onValueChange={(itemValue, itemIndex) =>
                    setJornada(itemValue)
                  }
                  mode={"dropdown"}
                >
                  <Picker.Item label={"Selecciona una jornada"} value={0} />
                  {jornadas.map((item, key) => (
                    <Picker.Item
                      key={item.id}
                      label={"Jornada" + item.numero}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Fecha de inicio */}
            <View style={{}}>
              <Text style={styles.label}>Fecha de inicio</Text>
              <TouchableOpacity onPress={() => showDatepicker(0)}>
                <Text style={styles.input}>
                  {inicio
                    ? moment(inicio).format("DD-MM-YYYY")
                    : "Selecciona una fecha"}
                </Text>
              </TouchableOpacity>
              {showI && (
                <DateTimePicker
                  value={inicio ? inicio : new Date()}
                  onChange={onChangeI}
                  minimumDate={new Date()}
                />
              )}
            </View>

            {/* FECHA FIN */}
            <View style={{}}>
              <Text style={styles.label}>Fecha de fin</Text>
              <TouchableOpacity onPress={() => showDatepicker(1)}>
                <Text style={styles.input}>
                  {fin
                    ? moment(fin).format("DD-MM-YYYY")
                    : "Selecciona una fecha"}
                </Text>
              </TouchableOpacity>
              {showF && (
                <DateTimePicker
                  value={fin ? fin : inicio ? inicio : new Date()}
                  onChange={onChangeF}
                  minimumDate={new Date()}
                />
              )}
            </View>
            <TouchableOpacity
              style={[styles.button, styles.buttonAsign]}
              onPress={() => handleStore()}
            >
              <Text style={styles.textStyleAsign}>Asignar horarios</Text>
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

export default HorariosJornada;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalView: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: "white",
    // justifyContent: "space-between",
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
  buttonAsign: {
    backgroundColor: colores.blue,
    marginTop: 10,
  },
  buttonClose: {
    backgroundColor: colores.yellow,
    marginTop: 10,
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  textStyleAsign: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  inputContainer: {
    width: "90%",
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
    fontSize: 16,
    marginTop: 10,
  },
});

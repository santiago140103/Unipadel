import { StyleSheet, Text, View, Modal, TouchableOpacity, FlatList, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { colores } from "../colors";
import Horario from "./Horario";
import { getHorariosDisponibles, proponerHorarioPartido } from "../api";

const SelectorHorarioPropuesto = ({
  modalVisible,
  setModalVisible,
  partido,
  torneo,
  onRefresh,
  user
}) => {
  const [horarios, setHorarios] = useState([]);

  const loadHorarios = async () => {
    const data = await getHorariosDisponibles(torneo);
    setHorarios(data.data);
  };

  const proponerPartido = async (horario) => {
    const request = {
      horario: horario,
      partido: partido,
      user: user
    }
    
    const data = await proponerHorarioPartido(request)
    .then(() => {
      onRefresh();
      setModalVisible(!modalVisible)
      Alert.alert(
        "¡Horario propuesto!",
        "Se ha propuesto a la pareja rival un nuevo horario",
        [
          {
            text: "¡OK!",
            onPress: () => loadHorarios(),
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
  }

  const renderItem = ({ item }) => {
    return <Horario horario={item} proponerPartido={proponerPartido}/>;
  };

  useEffect(() => {
    loadHorarios();
  }, []);

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
            {horarios.length == 0 ? (
              <View
                style={{
                  backgroundColor: "lightgray",
                  width: "90%",
                  marginTop: 20,
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontSize: 20, textAlign: "center" }}>
                  No se han encontrado horarios
                </Text>
              </View>
            ) : (
              <FlatList
                data={horarios}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                style={styles.listado}
                contentContainerStyle={{ alignItems: "center" }}
              />
            )}
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

export default SelectorHorarioPropuesto;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalView: {
    padding: 10,
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
  textStyle: {
    color: "black",
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
});

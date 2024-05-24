import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { colores } from "../colors";
import { UserContext } from "../context/UserDataContext";

const SelectorPareja = ({
  modalVisible,
  setModalVisible,
  handleInscripcion,
}) => {
  
  const usuarioContext = useContext(UserContext);

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
            {usuarioContext.parejas.map((item, key) => (
              <View key={item.id}>
                <TouchableOpacity
                  onPress={() => handleInscripcion(item.id)}
                  style={styles.pareja}
                >
                  <Text style={styles.parejaText}>{item.nombre}</Text>
                </TouchableOpacity>
              </View>
            ))}
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

export default SelectorPareja;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalView: {
    padding: 30,
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
    marginVertical: 10
  },
  parejaText:{
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  }
});

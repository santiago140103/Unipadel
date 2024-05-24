import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { Searchbar } from "react-native-paper";

import SupNavbar from "../../components/supNavbar";
import { colores } from "../../colors";
import { createPareja, getJugadores } from "../../api";
import { useNavigation } from "@react-navigation/core";
import Jugador from "../../components/Jugador";
import { UserContext } from "../../context/UserDataContext";

const ParejaForm = () => {
  const navigation = useNavigation();
  const usuarioContext = useContext(UserContext);

  const [nombre, setNombre] = useState("");
  const [jugadores, setJugadores] = useState([]);

  const [jugadoresPareja, setJugadoresPareja] = useState([]);
  const [jugadoresParejaNombre, setJugadoresParejaNombre] = useState([]);

  const onChangeSearch = async (query) => {
    const data = await getJugadores(query);
    setJugadores(data.data);
  };

  const datosPareja = {
    nombre: nombre,
    jugadores: jugadoresPareja,
  };

  // Función para hacer el guardado de la info en la base de datos y mostrar mensaje de aviso
  const handleStore = async () => {
    console.log('Entra');
    console.log(datosPareja);
    const res = await createPareja(datosPareja)
      .then(() => {
        Alert.alert(
          "¡Pareja creada!",
          "Se ha creado la pareja con los usuarios seleccionados",
          [
            {
              text: "¡OK!",
              onPress: () => navigation.pop(),
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

  const goBack = () => {
    navigation.pop();
  };

  function addPlayer(player) {
    setJugadoresPareja([...jugadoresPareja, player.id]);
    setJugadoresParejaNombre([...jugadoresParejaNombre, player.name]);
    setJugadores([]);
  }
  
  useEffect(() => {
    setJugadoresPareja([...jugadoresPareja, usuarioContext.user.id]);
    setJugadoresParejaNombre([...jugadoresParejaNombre, usuarioContext.user.name]);
    console.log('Añadido un jugador');
  }, []);

  const renderItem = ({ item }) => {
    return (
      <Jugador
        jugador={item}
        jugadoresPareja={jugadoresPareja}
        addPlayer={addPlayer}
      ></Jugador>
    );
  };

  return (
    <SafeAreaView>
      <SupNavbar></SupNavbar>
      <View style={styles.container}>
        <Text style={styles.title}>Crear Pareja</Text>
        <View style={styles.titleUnderline}></View>
        {/* NOMBRE PAREJA */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre de la pareja</Text>
          <TextInput
            placeholder="Introduce un nombre para la pareja..."
            value={nombre}
            onChangeText={(text) => setNombre(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.jugadoresAdded}>
          <Text
            style={[
              styles.jugadoresAddedText,
              { textAlign: "center", fontSize: 20 },
            ]}
          >
            Jugadores añadidos
          </Text>
          {jugadoresParejaNombre.length != 0 && (
            <View
              style={{ backgroundColor: "white", marginTop: 5, padding: 5 }}
            >
              {jugadoresParejaNombre.map((item) => (
                <Text key={item} style={styles.jugadoresAddedText}>
                  ·{item}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* SEARCHBAR DE JUGADORES */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Buscador de jugadores</Text>
          <Searchbar
            placeholder="Introduce un nombre..."
            onChangeText={onChangeSearch}
            value={jugadores}
            style={styles.searchbar}
          />
        </View>

        {/* RESULTADOS DE BÚSQUEDA DEL SEARCHBAR */}
        <View style={{ width: "90%" }}>
          <FlatList
            data={jugadores}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={styles.listado}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonSave}
            onPress={() => handleStore()}
          >
            <Text style={styles.buttonSaveText}>Crear pareja</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonSave, { backgroundColor: "darkred" }]}
            onPress={() => goBack()}
          >
            <Text style={styles.buttonSaveText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ParejaForm;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    color: colores.darkblue,
    fontSize: 20,
    fontWeight: "bold",
  },
  titleUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: colores.darkblue,
    paddingBottom: 5,
    width: "25%",
  },
  jugadoresAdded: {
    backgroundColor: colores.yellow,
    padding: 10,
    marginTop: 10,
    width: "90%",
    borderRadius: 10,
  },
  jugadoresAddedText: {
    fontWeight: "bold",
  },
  inputContainer: {
    width: "90%",
    marginVertical: 5,
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
  buttonContainer: {
    marginVertical: 20,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonSave: {
    backgroundColor: colores.darkblue,
    width: "49%",
    padding: 15,
    borderRadius: 2,
    alignItems: "center",
    marginVertical: 5,
  },
  buttonSaveText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    textTransform: "uppercase",
  },
  jugador: {
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colores.lightyellow,
    borderColor: colores.yellow,
    padding: 20,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  searchbar: {
    marginTop: 10,
  },
  listado: {
    maxHeight: 200,
    width: "100%",
    marginTop: 5,
  },
});

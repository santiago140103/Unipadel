import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";

import SupNavbar from "../../components/supNavbar";
import { colores } from "../../colors";
import { storeTorneoData } from "../../api";
import { auth } from "../../firebase";
import { useNavigation } from "@react-navigation/core";

const TorneoForm = () => {
  const navigation = useNavigation();
  const [organizador, setOrganizador] = useState(auth.currentUser.email);
  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [lugar, setLugar] = useState("");
  const [formato, setFormato] = useState(0);
  const [jugadores, setJugadores] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [politica_cancelacion, setPoliticaCancelacion] = useState("");
  // const [activo, setActivo] = useState(false);

  const [showI, setShowI] = useState(false);
  const [showF, setShowF] = useState(false);
  const [showL, setShowL] = useState(false);
  const [inicio, setInicio] = useState("");
  const [limite, setLimite] = useState("");
  const [fin, setFin] = useState("");

  const datosTorneo = {
    nombre: nombre,
    ciudad: ciudad,
    club: lugar,
    formato: formato,
    max_jugadores: jugadores,
    precio: precio,
    descripcion: descripcion,
    // activo: activo,
    fecha_inicio: inicio ? moment(inicio).format('YYYY-MM-DDTHH:mm:ss') : '',
    fecha_fin: fin ? moment(fin).format('YYYY-MM-DDTHH:mm:ss') : '',
    fecha_limite: limite ? moment(limite).format('YYYY-MM-DDTHH:mm:ss') : '',
    organizador: organizador,
    politica_cancelacion: politica_cancelacion,
  };

  const onChangeI = (event, selectedDate) => {
    setShowI(false);
    setInicio(selectedDate);
  };

  const onChangeF = (event, selectedDate) => {
    setShowF(false);
    setFin(selectedDate);
  };

  const onChangeL = (event, selectedDate) => {
    setShowL(false);
    setLimite(selectedDate);
  };

  const showDatepicker = (i) => {
    switch (i) {
      case 0:
        setShowI(true);
        break;
      case 1:
        setShowF(true);
        break;
      case 2:
        setShowL(true);
        break;
      default:
        break;
    }
  };

  // Función para hacer el guardado de la info en la base de datos y mostrar mensaje de aviso
  const handleStore = async () => {
    const res = await storeTorneoData(datosTorneo)
      .then(() => {
        Alert.alert(
          "¡Torneo creado!",
          "Se ha creado un torneo con los datos proporcionados. Podrás gestionarlo desde tu perfil",
          [
            {
              text: "¡OK!",
              onPress: () => 
              navigation.reset({
                index: 0,
                routes: [{ name: 'OrganizerHome' }],
              }),
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

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <SupNavbar></SupNavbar>
        <Text style={styles.title}>CREAR COMPETICIÓN</Text>
        <View style={styles.titleUnderline}></View>

        {/* Comienzo de los inputs */}
        {/* NOMBRE */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            placeholder="Nombre del torneo"
            value={nombre}
            onChangeText={(text) => setNombre(text)}
            style={styles.input}
          />
        </View>

        {/* CIUDAD */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ciudad</Text>
          <TextInput
            placeholder="Ciudad donde se jugará"
            value={ciudad}
            onChangeText={(text) => setCiudad(text)}
            style={styles.input}
          />
        </View>

        {/* CLUB / CANCHAS */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Club / Canchas</Text>
          <TextInput
            placeholder="Club o canchas donde se jugará"
            value={lugar}
            onChangeText={(text) => setLugar(text)}
            style={styles.input}
          />
        </View>

        {/* FORMATO */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Formato</Text>
          <View style={[styles.input, { paddingVertical: 0 }]}>
            <Picker
              selectedValue={formato}
              onValueChange={(itemValue, itemIndex) => setFormato(1)}
              mode={"dropdown"}
            >
              <Picker.Item label="Liga" value="0" color="blue"/>
              <Picker.Item label="Torneo" value="1" />
            </Picker>
          </View>
        </View>

        {/* Nº JUGADORES */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nº de parejas</Text>
          <TextInput
            placeholder="Cantidad de parejas que podrán inscribirse"
            value={jugadores}
            onChangeText={(text) => setJugadores(text)}
            style={styles.input}
            keyboardType="numeric"
          />
        </View>

        {/* FECHA INICIO */}
        <View style={styles.inputContainer}>
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
              value={inicio ? new Date(inicio) : new Date()}
              onChange={onChangeI}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* FECHA FIN */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fecha de fin</Text>
          <TouchableOpacity onPress={() => showDatepicker(1)}>
            <Text style={styles.input}>
              {fin ? moment(fin).format("DD-MM-YYYY") : "Selecciona una fecha"}
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

        {/* FECHA LÍMITE INSCRIPCIÓN */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fecha límite de inscripción</Text>
          <TouchableOpacity onPress={() => showDatepicker(2)}>
            <Text style={styles.input}>
              {limite
                ? moment(limite).format("DD-MM-YYYY")
                : "Selecciona una fecha"}
            </Text>
          </TouchableOpacity>
          {showL && (
            <DateTimePicker
              value={limite ? limite : new Date()}
              onChange={onChangeL}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* PRECIO */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Precio de la inscripción</Text>
          <TextInput
            placeholder="Precio de la inscripción"
            value={precio}
            onChangeText={(text) => setPrecio(text)}
            style={styles.input}
            keyboardType="decimal-pad"
          />
        </View>

        {/* DESCRIPCIÓN */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            placeholder="Descripción del torneo"
            value={descripcion}
            onChangeText={(text) => setDescripcion(text)}
            style={styles.input}
            multiline={true}
            numberOfLines={4}
          />
        </View>
        {/* POLITICA DE CANCELACION */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Politica de cancelacion</Text>
          <TextInput
            placeholder="Numero de horas minimo para cancelar sin que haya penalizacion"
            value={politica_cancelacion}
            onChangeText={(text) => setPoliticaCancelacion(text)}
            style={styles.input}
            keyboardType="numeric"
          />
        </View>

        {/* ACTIVO */}
        {/* <View
          style={[
            styles.inputContainer,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <Text style={[styles.label, { width: "85%" }]}>
            Activar torneo y hacerlo visible a los usuarios
          </Text>
          <Checkbox
            style={styles.checkbox}
            value={activo}
            onValueChange={setActivo}
          />
        </View> */}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleStore()}>
            <Text style={styles.buttonText}>Crear competición</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "darkred" }]}
            onPress={() => goBack()}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TorneoForm;

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    backgroundColor: "white",
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
  buttonContainer: {
    marginVertical: 20,
    width: "80%",
  },
  button: {
    backgroundColor: colores.darkblue,
    width: "100%",
    padding: 15,
    borderRadius: 2,
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    textTransform: "uppercase",
  },
});

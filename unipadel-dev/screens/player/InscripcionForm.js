import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import Checkbox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";
import { UserContext } from "../../context/UserDataContext";

import SupNavbar from "../../components/supNavbar";
import { colores } from "../../colors";
import { getParejas, inscripcion } from "../../api";
import { useNavigation } from "@react-navigation/core";

const InscripcionForm = ({ route }) => {
  const usuarioContext = useContext(UserContext);
  const navigation = useNavigation();
  const [pareja, setPareja] = useState("");
  const [parejas, setParejas] = useState(usuarioContext.parejas);
  const [tododia, setTododia] = useState(false);

  const [inicio, setInicio] = useState("");
  const [showI, setShowI] = useState(false);

  const [fin, setFin] = useState("");
  const [showF, setShowF] = useState(false);

  const [lunes, setLunes] = useState(false);
  const [martes, setMartes] = useState(false);
  const [miercoles, setMiercoles] = useState(false);
  const [jueves, setJueves] = useState(false);
  const [viernes, setViernes] = useState(false);
  const [sabado, setSabado] = useState(false);
  const [domingo, setDomingo] = useState(false);

  const [horarios, setHorarios] = useState([]);

  const onChangeI = (event, selectedHour) => {
    setShowI(false);
    setInicio(selectedHour);
  };

  const onChangeF = (event, selectedHour) => {
    setShowF(false);
    setFin(selectedHour);
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

  // Función para hacer el guardado de la info en la base de datos y mostrar mensaje de aviso
  const handleStore = async () => {
    if (pareja == 0) {
      Alert.alert(
        "¡Error!",
        "Se debe seleccionar una pareja para el torneo",
        [
          {
            text: "¡OK!"
          },
        ]
      );
      return;
    }

    // if (horarios.length == 0) {
    //   Alert.alert(
    //     "¡Error!",
    //     "Se debe introducir al menos un rango horario. Puedes añadir que puedes todos los días si no tienes preferencias.",
    //     [
    //       {
    //         text: "¡OK!"
    //       },
    //     ]
    //   );
    //   return;
    // }

    let data = {
      torneo: route.params.torneo.id,
      pareja: pareja,
      horarios: horarios,
    };

    const res = await inscripcion(data)
      .then(() => {
        Alert.alert(
          "¡Inscripción realizada!",
          "Se ha inscrito a la pareja en el torneo con las preferencias horarias seleccionadas.",
          [
            {
              text: "¡OK!",
              onPress: () => 
              navigation.reset({
                index: 0,
                routes: [{ name: 'PlayerHome' }],
              }),
            },
          ]
        );
      })
      .catch((error) => {
        let mensaje = error.response.data.message;
        Alert.alert(
          "Error en la inscripción",
          mensaje,
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

  const borrarHorario = (index) => {
    const reducedArr = [...horarios];
    reducedArr.splice(index, 1);
    setHorarios(reducedArr);
  };

  const handleAgregarHorario = () => {
    let horario = {
      inicio: moment(inicio).format("HH:mm"),
      fin: moment(fin).format("HH:mm"),
      lunes: lunes,
      martes: martes,
      miercoles: miercoles,
      jueves: jueves,
      viernes: viernes,
      sabado: sabado,
      domingo: domingo,
      todo_dia: tododia,
    };

    setHorarios((horarios) => [...horarios, horario]);

    setInicio("");
    setFin("");
    setLunes(false);
    setMartes(false);
    setMiercoles(false);
    setJueves(false);
    setViernes(false);
    setSabado(false);
    setDomingo(false);
    setTododia(false);
  };

  async function fetchParejas() {
    const par = await getParejas(usuarioContext.user.email);
    setParejas(par.data);
  }

  useEffect(() => {
    console.log('Entró');
    fetchParejas();
    console.log(parejas);
  }, []);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <SupNavbar></SupNavbar>
        <Text style={styles.title}>
          Inscripción: {route.params.torneo.nombre}
        </Text>
        <View style={styles.titleUnderline}></View>

        {/* Comienzo de los inputs */}
        {/* Pareja */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Selecciona una pareja para jugar</Text>
          <Picker
            selectedValue={pareja}
            onValueChange={(itemValue, itemIndex) => {setPareja(itemValue); console.log('pareja: ' +  pareja)}}
            mode={"dropdown"}
          >
            <Picker.Item label="Selecciona una pareja" value="0" selected/>
            {parejas.map((item) => (
              <Picker.Item label={item.nombre} value={item.id} key={item.id} style={{ backgroundColor: 'ligthblue', color: 'black' }} />
            ))}
          </Picker>
        </View>

        <View style={styles.disponibilidadContainer}>
          <Text
            style={[styles.dispLabel, { textAlign: "center", fontSize: 20 }]}
          >
            Introduce los rangos horarios en los que puedes jugar
          </Text>
        </View>

        <View style={[styles.inputContainer, { alignItems: "center" }]}>
          <Text style={[styles.label, { alignSelf: "flex-start" }]}>
            ¿Qué días contarán con este horario?
          </Text>
          <ScrollView horizontal contentContainerStyle={{ padding: 5 }}>
            <View style={styles.dia}>
              <Text style={styles.checkLabel}>L</Text>
              <Checkbox
                style={styles.checkDia}
                value={lunes}
                onValueChange={setLunes}
              />
            </View>
            <View style={styles.dia}>
              <Text style={styles.checkLabel}>M</Text>
              <Checkbox
                style={styles.checkDia}
                value={martes}
                onValueChange={setMartes}
              />
            </View>
            <View style={styles.dia}>
              <Text style={styles.checkLabel}>X</Text>
              <Checkbox
                style={styles.checkDia}
                value={miercoles}
                onValueChange={setMiercoles}
              />
            </View>
            <View style={styles.dia}>
              <Text style={styles.checkLabel}>J</Text>
              <Checkbox
                style={styles.checkDia}
                value={jueves}
                onValueChange={setJueves}
              />
            </View>
            <View style={styles.dia}>
              <Text style={styles.checkLabel}>V</Text>
              <Checkbox
                style={styles.checkDia}
                value={viernes}
                onValueChange={setViernes}
              />
            </View>
            <View style={styles.dia}>
              <Text style={styles.checkLabel}>S</Text>
              <Checkbox
                style={styles.checkDia}
                value={sabado}
                onValueChange={setSabado}
              />
            </View>
            <View style={styles.dia}>
              <Text style={styles.checkLabel}>D</Text>
              <Checkbox
                style={styles.checkDia}
                value={domingo}
                onValueChange={setDomingo}
              />
            </View>
          </ScrollView>
        </View>

        <View style={styles.underline}></View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "90%",
            marginTop: 10,
          }}
        >
          <Text style={[styles.labelCheck, { marginRight: 10 }]}>
            ¿Puedes todo el día?
          </Text>
          <Checkbox
            style={styles.checkDia}
            value={tododia}
            onValueChange={setTododia}
          />
        </View>
        {tododia == false && (
          <View style={{ width: "90%", justifyContent: "center" }}>
            <View style={{ width: "100%", marginTop: 10 }}>
              <Text style={{ fontSize: 16 }}>
                Si no, introduce el horario en el que estarías disponible los
                días indicados
              </Text>
            </View>
            <View style={styles.horas}>
              <View style={styles.horaInput}>
                <Text style={styles.label}>Hora inicio</Text>
                <TouchableOpacity onPress={() => showDatepicker(0)}>
                  <Text style={styles.input}>
                    {inicio ? moment(inicio).format("HH:mm") : "Hora inicio"}
                  </Text>
                </TouchableOpacity>
                {showI && (
                  <DateTimePicker
                    value={inicio ? inicio : new Date()}
                    mode="time"
                    onChange={onChangeI}
                  />
                )}
              </View>
              <View style={styles.horaInput}>
                <Text style={styles.label}>Hora fin</Text>
                <TouchableOpacity onPress={() => showDatepicker(1)}>
                  <Text style={styles.input}>
                    {fin ? moment(fin).format("HH:mm") : "Hora fin"}
                  </Text>
                </TouchableOpacity>
                {showF && (
                  <DateTimePicker
                    value={fin ? fin : inicio ? inicio : new Date()}
                    mode="time"
                    onChange={onChangeF}
                    disabled={true}
                  />
                )}
              </View>
            </View>
          </View>
        )}

        <View style={styles.underline}></View>

        <View style={{ alignItems: "center", width: "90%" }}>
          <Text style={styles.title}>Horarios añadidos</Text>
          {horarios.length == 0 ? (
            <View
              style={{
                backgroundColor: "lightgray",
                width: "90%",
                padding: 10,
              }}
            >
              <Text style={{ textAlign: "center" }}>
                No hay horarios añadidos todavía
              </Text>
            </View>
          ) : (
            horarios.map((h, index) => {
              return (
                <View style={styles.horario} key={index}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.horarioText}>
                      {h.lunes && "L"}
                      {h.martes && "M"}
                      {h.miercoles && "X"}
                      {h.jueves && "J"}
                      {h.viernes && "V"}
                      {h.sabado && "S"}
                      {h.domingo && "D"}
                    </Text>
                    <Text style={{ marginHorizontal: 4 }}>|</Text>
                    {h.todo_dia ? (
                      <Text style={styles.horarioText}>Todo el día</Text>
                    ) : (
                      <Text style={styles.horarioText}>
                        {h.inicio} - {h.fin}
                      </Text>
                    )}
                  </View>
                  <View style={{}}>
                    <TouchableOpacity
                      style={styles.borrarButton}
                      onPress={() => borrarHorario(index)}
                    >
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        Borrar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.disponibilidadContainer}>
          <TouchableOpacity
            style={styles.buttonAgregar}
            onPress={() => handleAgregarHorario()}
          >
            <View style={styles.imageContainer}>
              <Image
                style={{ resizeMode: "contain", width: 30, height: 30 }}
                source={require("../../assets/images/icons/plus.png")}
              />
            </View>
            <Text style={styles.disponibilidadText}>Agregar horario</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleStore()}>
            <Text style={styles.buttonText}>Inscribirse</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "darkred" }]}
            onPress={() => goBack()}
          >
            <Text style={styles.buttonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InscripcionForm;

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
  labelCheck: {
    color: colores.darkblue,
    fontWeight: "bold",
    fontSize: 18,
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    width: "80%",
    marginTop: 20,
    marginBottom: 10,
  },
  disponibilidadContainer: {
    width: "90%",
    marginVertical: 5,
  },
  dispLabel: {
    color: colores.darkblue,
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  buttonContainer: {
    marginVertical: 20,
    width: "80%",
  },
  buttonAgregar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colores.lightblue,
    width: "100%",
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    marginTop: 5,
    justifyContent: "center",
  },
  disponibilidadText: {
    marginLeft: 20,
    fontSize: 20,
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
  horas: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  horaInput: {
    width: "45%",
  },
  dia: {
    marginHorizontal: 10,
    alignItems: "center",
  },
  checkDia: {
    marginTop: 5,
  },
  horario: {
    backgroundColor: "lightgray",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    width: "100%",
    marginVertical: 5,
  },
  horarioText: {
    fontWeight: "bold",
  },
  borrarButton: {
    backgroundColor: "darkred",
    borderRadius: 5,
    padding: 5,
  },
});

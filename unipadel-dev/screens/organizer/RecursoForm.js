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
import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import Checkbox from "expo-checkbox";

import SupNavbar from "../../components/supNavbar";
import { colores } from "../../colors";
import { createRecursos } from "../../api";
import { useNavigation } from "@react-navigation/core";

const RecursoForm = ({ route }) => {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState("");

  const [inicio, setInicio] = useState("");
  const [showI, setShowI] = useState(false);

  const [fin, setFin] = useState("");
  const [showF, setShowF] = useState(false);

  const [fechaInicio, setFechaInicio] = useState("");
  const [showFI, setShowFI] = useState(false);

  const [fechaFin, setFechaFin] = useState("");
  const [showFF, setShowFF] = useState(false);

  const [turnos, setTurnos] = useState("");

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

  const onChangeFI = (event, selectedHour) => {
    setShowFI(false);
    setFechaInicio(selectedHour);
  };

  const onChangeFF = (event, selectedHour) => {
    setShowFF(false);
    setFechaFin(selectedHour);
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
        setShowFI(true);
        break;
      case 3:
        setShowFF(true);
        break;
      default:
        break;
    }
  };

  // Función para hacer el guardado de la info en la base de datos y mostrar mensaje de aviso
  const handleStore = async () => {
    let data = {
      torneo: route.params.id,
      cancha: nombre,
      horarios: horarios,
    };

    const res = await createRecursos(data)
      .then(() => {
        Alert.alert(
          "¡Recurso creado!",
          "Se ha creado una cancha con los horarios indicados. Podrás gestionarlos en la sección de recursos del torneo.",
          [
            {
              text: "¡OK!",
              onPress: () =>
                navigation.navigate("GestionarTorneo", { id: route.params.id }),
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

  const borrarHorario = (index) => {
    const reducedArr = [...horarios];
    reducedArr.splice(index, 1);
    setHorarios(reducedArr);
  };

  const handleAgregarHorario = () => {
    let horario = {
      inicio: moment(inicio).format("HH:mm"),
      fin: moment(fin).format("HH:mm"),
      fechaInicio: moment(fechaInicio).format("Y-MM-DD"),
      fechaFin: moment(fechaFin).format("Y-MM-DD"),
      turnos: turnos,
      lunes: lunes,
      martes: martes,
      miercoles: miercoles,
      jueves: jueves,
      viernes: viernes,
      sabado: sabado,
      domingo: domingo,
    };

    setHorarios((horarios) => [...horarios, horario]);

    setInicio("");
    setFin("");
    setFechaInicio("");
    setFechaFin("");
    setTurnos("");
    setLunes(false);
    setMartes(false);
    setMiercoles(false);
    setJueves(false);
    setViernes(false);
    setSabado(false);
    setDomingo(false);
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <SupNavbar></SupNavbar>
        <Text style={styles.title}>Agregar Cancha</Text>
        <View style={styles.titleUnderline}></View>

        {/* Comienzo de los inputs */}
        {/* NOMBRE */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Número / Nombre de la cancha</Text>
          <TextInput
            placeholder="Número/Nombre"
            value={nombre}
            onChangeText={(text) => setNombre(text)}
            style={styles.input}
          />
        </View>

        <View style={styles.underline}></View>

        <View style={styles.disponibilidadContainer}>
          <Text style={styles.dispLabel}>Disponibilidad de la cancha</Text>
        </View>

        <View style={styles.horas}>
          <View style={styles.horaInput}>
            <Text style={styles.label}>Fecha inicio</Text>
            <TouchableOpacity onPress={() => showDatepicker(2)}>
              <Text style={styles.input}>
                {fechaInicio
                  ? moment(fechaInicio).format("DD-MM-Y")
                  : "Fecha inicio"}
              </Text>
            </TouchableOpacity>
            {showFI && (
              <DateTimePicker
                value={fechaInicio ? fechaInicio : new Date()}
                mode="date"
                onChange={onChangeFI}
              />
            )}
          </View>
          <View style={styles.horaInput}>
            <Text style={styles.label}>Fecha fin</Text>
            <TouchableOpacity onPress={() => showDatepicker(3)}>
              <Text style={styles.input}>
                {fechaFin ? moment(fechaFin).format("DD-MM-Y") : "Fecha fin"}
              </Text>
            </TouchableOpacity>
            {showFF && (
              <DateTimePicker
                value={
                  fechaFin ? fechaFin : fechaInicio ? fechaInicio : new Date()
                }
                mode="date"
                onChange={onChangeFF}
              />
            )}
          </View>
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
              />
            )}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            ¿Entre cuántos turnos dividimos el horario?
          </Text>
          <TextInput
            placeholder="Nº de turnos"
            value={turnos}
            onChangeText={(text) => setTurnos(text)}
            style={styles.input}
            keyboardType={"numeric"}
          />
        </View>

        <View style={styles.agregarButtonContainer}>
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
                  <View>
                    <Text>
                      Desde el
                      <Text style={{ fontWeight: "bold" }}>
                        {" " + moment(h.fechaInicio).format("DD-MM-Y") + " "}
                      </Text>
                      hasta el
                      <Text style={{ fontWeight: "bold" }}>
                        {" " + moment(h.fechaFin).format("DD-MM-Y")}
                      </Text>
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                    <Text style={styles.horarioText}>
                      {h.inicio} - {h.fin}
                    </Text>
                    <Text style={{ marginHorizontal: 4 }}>|</Text>
                    <Text style={styles.horarioText}>{h.turnos} turnos</Text>
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleStore()}>
            <Text style={styles.buttonText}>Crear recurso</Text>
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

export default RecursoForm;

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
    fontSize: 20,
    textAlign: "center",
  },
  buttonContainer: {
    marginVertical: 20,
    width: "80%",
  },
  agregarButtonContainer: {
    width: "90%",
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonAgregar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colores.lightblue,
    width: "80%",
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    marginTop: 5,
  },
  disponibilidadText: {
    marginLeft: 10,
    fontSize: 18,
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
    width: "90%",
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
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    width: "100%",
    marginVertical: 5,
  },
  horarioText: {
    fontWeight: "bold",
    fontSize: 16,
    marginVertical: 5,
  },
  borrarButton: {
    backgroundColor: "darkred",
    borderRadius: 5,
    padding: 5,
  },
});

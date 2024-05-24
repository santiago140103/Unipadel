import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { colores } from "../colors";
import moment from "moment";

const Partido = ({
  partido,
  handleHorario,
  handleHorarioPropuesto,
  handleResultadoPropuesto,
  handleResultadoAsignado,
  hasActions,
  isPlayer,
  aceptarPropuesta,
  rechazarPropuesta,
  aceptarResultado,
  rechazarResultado,
}) => {
  return (
    <View style={{ width: "100%" }}>
      {partido.estado == 0 &&
        partido.propio &&
        partido.propuesta != null &&
        partido.propuesta_externa && (
          <View
            style={{
              backgroundColor: "#ffe6cc",
              padding: 5,
              borderRadius: 5,
            }}
          >
            <Text style={{ textAlign: "center", marginTop: 5 }}>
              La pareja rival ha propuesto un horario
            </Text>
            <Text style={{ textAlign: "center" }}>
              El día {moment(partido.fechor_propuesta).format("DD-MM-YYYY")} a
              las {moment(partido.fechor_propuesta).format("HH:mm")}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <TouchableOpacity
                style={{
                  borderRadius: 5,
                  marginVertical: 5,
                  backgroundColor: colores.green,
                  marginHorizontal: 10,
                  padding: 5,
                }}
                onPress={() => aceptarPropuesta(partido.id)}
              >
                <Text style={{ color: "white" }}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderRadius: 5,
                  marginVertical: 5,
                  backgroundColor: "darkred",
                  marginHorizontal: 10,
                  padding: 5,
                }}
                onPress={() => rechazarPropuesta(partido.id)}
              >
                <Text style={{ color: "white" }}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      {partido.estado == 0 &&
        partido.propio &&
        partido.propuesta != null &&
        partido.propuesta_externa == false && (
          <View
            style={{
              backgroundColor: "#ffe6cc",
              padding: 5,
              borderRadius: 10,
            }}
          >
            <Text style={{ textAlign: "center" }}>
              Esperando respuesta del rival
            </Text>
          </View>
        )}
      {partido.estado == 1 &&
        partido.propio &&
        partido.pareja_propuesta_resultado != null &&
        partido.propuesta_externa && (
          <View
            style={{
              borderTopColor: "gray",
              borderTopWidth: 2,
              borderBottomColor: "lightgray",
              borderBottomWidth: 2,
              backgroundColor: "#ffe6cc",
              padding: 5,
              borderRadius: 5,
            }}
          >
            <Text style={{ textAlign: "center", marginTop: 5 }}>
              La pareja rival ha propuesto un resultado
            </Text>
            <Text style={{ textAlign: "center" }}>
              {partido.resultado_propuesto}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <TouchableOpacity
                style={{
                  borderRadius: 5,
                  marginVertical: 5,
                  backgroundColor: colores.green,
                  marginHorizontal: 10,
                  padding: 5,
                }}
                onPress={() => aceptarResultado(partido.id)}
              >
                <Text style={{ color: "white" }}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderRadius: 5,
                  marginVertical: 5,
                  backgroundColor: "darkred",
                  marginHorizontal: 10,
                  padding: 5,
                }}
                onPress={() => rechazarResultado(partido.id)}
              >
                <Text style={{ color: "white" }}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      {partido.estado == 1 &&
        partido.propio &&
        partido.pareja_propuesta_resultado != null &&
        partido.propuesta_externa == false && (
          <View
            style={{
              backgroundColor: "#ffe6cc",
              padding: 5,
              borderRadius: 5,
            }}
          >
            <Text style={{ textAlign: "center" }}>
              Esperando respuesta del rival para el resultado
            </Text>
          </View>
        )}
      <View
        style={[
          styles.partidoInfoContainer,
          isPlayer && partido.propio && styles.partidoPropioColor,
        ]}
      >
        <View>
          <Text style={styles.partidoInfoTorneoText}>
            {partido.torneo.nombre} - Jornada {partido.jornada.numero}
          </Text>
        </View>
        {partido.estado != 2 && (
          <View style={styles.partidoInfoHora}>
            {partido.horario_id != null && (
              <Text style={styles.partidoInfoText}>
                {moment(partido.horario.inicio).format("DD-MM-YYYY")}
              </Text>
            )}
            {partido.horario_id != null && (
              <Text style={styles.partidoInfoText}>
                {moment(partido.horario.inicio).format("HH:mm")}
              </Text>
            )}
            {partido.horario_id != null && (
              <Text style={styles.partidoInfoText}>
                {partido.horario.cancha.nombre}
              </Text>
            )}
          </View>
        )}
        <View style={styles.partidoInfoParejas}>
          <Text style={styles.partidoParejaText}>{partido.pareja1.nombre}</Text>
          <View style={{ width: "20%", alignItems: "center" }}>
            <Image
              style={[{ resizeMode: "contain" }]}
              source={require("../assets/images/icons/home.png")}
            />
          </View>
          <Text style={styles.partidoParejaText}>{partido.pareja2.nombre}</Text>
        </View>
        {partido.estado == 2 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                  fontFamily: "monospace",
                  backgroundColor: "white",
                  padding: 10,
                }}
              >
                {partido.puntos_p1}
              </Text>
            </View>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                marginHorizontal: 50,
              }}
            >
              -
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                  fontFamily: "monospace",
                  backgroundColor: "white",
                  padding: 10,
                }}
              >
                {partido.puntos_p2}
              </Text>
            </View>
          </View>
        )}

        {hasActions && (
          <View style={styles.accionesPartido}>
            {isPlayer ? (
              partido.propio &&
              partido.estado == 0 && (
                <TouchableOpacity
                  style={[
                    styles.accionesButton,
                    { backgroundColor: colores.darkblue },
                  ]}
                  onPress={() => handleHorarioPropuesto(partido.id)}
                >
                  <Text style={styles.accionesButtonText}>
                    Proponer horario
                  </Text>
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity
                style={[
                  styles.accionesButton,
                  { backgroundColor: colores.darkblue },
                ]}
                onPress={() => handleHorario(partido.id)}
              >
                <Text style={styles.accionesButtonText}>Asignar horario</Text>
              </TouchableOpacity>
            )}
            {isPlayer ? (
              partido.propio &&
              partido.estado != 2 && (
                <TouchableOpacity
                  style={[
                    styles.accionesButton,
                    { backgroundColor: colores.green },
                  ]}
                  onPress={() =>
                    handleResultadoPropuesto(
                      partido.id,
                      partido.pareja1,
                      partido.pareja2
                    )
                  }
                >
                  <Text style={styles.accionesButtonText}>
                    Proponer resultado
                  </Text>
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity
                style={[
                  styles.accionesButton,
                  { backgroundColor: colores.green },
                ]}
                onPress={() =>
                  handleResultadoAsignado(
                    partido.id,
                    partido.pareja1,
                    partido.pareja2
                  )
                }
              >
                <Text style={styles.accionesButtonText}>Asignar resultado</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default Partido;

const styles = StyleSheet.create({
  partidoInfoContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: colores.lightyellow,
    width: "95%",
    borderRadius: 10,
  },
  partidoPropioColor: {
    backgroundColor: colores.lightblue,
  },
  partidoInfoTorneoText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  partidoInfoText: {
    textAlign: "center",
    width: "33%",
    fontWeight: "bold",
  },
  partidoInfoHora: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  partidoInfoParejas: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  partidoParejaText: {
    fontSize: 16,
    fontWeight: "bold",
    width: "40%",
    textAlign: "center",
    textTransform: "uppercase",
    color: colores.darkblue,
    backgroundColor: "lightgrey",
    padding: 5,
    borderRadius: 5,
  },
  accionesPartido: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
  },
  accionesButton: {
    width: 150,
    padding: 5,
    borderRadius: 10,
  },
  accionesButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

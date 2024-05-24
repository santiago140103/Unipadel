import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { colores } from "../../colors";
import { useNavigation } from "@react-navigation/core";

import SupNavbar from "../../components/supNavbar";
import { getHorariosTorneo, deleteHorario } from "../../api";
import { useIsFocused } from "@react-navigation/native";
import Horario from "../../components/Horario";
import { UserContext } from "../../context/UserDataContext";

const HorariosTorneoScreen = ({ route }) => {
  let request;
  if (route.params.isTorneo) {
    request = route.params.torneo;
  } else {
    request = route.params.cancha;
  }

  const usercontext = useContext(UserContext);

  const liberarHorario = async (id) => {
    await deleteHorario(id)
      .then(() => {
        Alert.alert(
          "¡Horario liberado!",
          "Se ha eliminado ese horario, por lo que ningún partido podrá ser asignado en ese horario y la cancha quedará libre",
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
          "Error",
          "Ha surgido un error y no se ha podido eliminar el horario. Por favor, revise la información y vuelva a intentarlo.",
          [
            {
              text: "Vale",
              style: "cancel",
            },
          ]
        );
      });
  };

  const renderItem = ({ item }) => {
    return <Horario horario={item} liberarHorario={liberarHorario} />;
  };

  const [horarios, setHorarios] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const isFocusing = useIsFocused();

  const loadHorarios = async () => {
    const data = await getHorariosTorneo(request, route.params.isTorneo);
    setHorarios(data.data);
  };

  const onRefresh = React.useCallback(async () => {
    setRefresh(true);
    await loadHorarios();
    setRefresh(false);
  });

  useEffect(() => {
    loadHorarios();
  }, [isFocusing]);

  return (
    <View style={styles.container}>
      <SupNavbar></SupNavbar>
      <Text style={styles.title}>Horarios creados</Text>
      <View style={styles.titleUnderline}></View>
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
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
          }
          style={styles.listado}
          contentContainerStyle={{ alignItems: "center" }}
        />
      )}
    </View>
  );
};

export default HorariosTorneoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  title: {
    color: colores.darkblue,
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  titleUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: colores.darkblue,
    paddingBottom: 5,
    width: "25%",
  },
  listado: {
    width: "100%",
    marginTop: 5,
  },
});

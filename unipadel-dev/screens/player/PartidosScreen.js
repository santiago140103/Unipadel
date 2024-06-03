import { StyleSheet, Text, View, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import SupNavbar from "../../components/supNavbar";
import { useNavigation } from "@react-navigation/core";

import { colores } from "../../colors";
import { useIsFocused } from "@react-navigation/native";
import Partido from "../../components/Partido";
import { getPartidos } from "../../api";

import { UserContext } from "../../context/UserDataContext";

const PartidosScreen = () => {
  const usercontext = useContext(UserContext);
  const navigation = useNavigation();

  const [partidos, setPartidos] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const isFocusing = useIsFocused();

  const loadPartidos = async () => {
    let request = {
      user: usercontext.user.id,
    };
    const data = await getPartidos(request);
    setPartidos(data.data);
  };

  const onRefresh = React.useCallback(async () => {
    setRefresh(true);
    await loadPartidos();
    setRefresh(false);
  });

  useEffect(() => {
    loadPartidos();
  }, [isFocusing], );

  const renderItem = ({ item }) => {
    console.log("Log del renderItem : " + item.id);
    return (
      <View>
        {/* Botón Chat */}
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate("ChatPartido", item.id)}
        >
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
        {/* Componente Partido */}
        <Partido partido={item} hasActions={true}></Partido>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SupNavbar></SupNavbar>
      <Text style={styles.title}>Partidos</Text>
      <View style={styles.titleUnderline}></View>
      
      <FlatList
        
        data={partidos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
        style={styles.listado}
        contentContainerStyle={{ alignItems: "center" }}
      />
    </View>
  );
};

export default PartidosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
  listado: {
    width: "100%",
    marginTop: 5,
  },

  buttonContainer: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 10,
    width: 1,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 8, // Aumenta el padding vertical para más espacio arriba y abajo
    paddingHorizontal: 12, // Ajusta el padding horizontal para reducir la amplitud
    borderRadius: 5,
  },

  chatButton: {
    backgroundColor: 'blue',
    paddingVertical: 8, // Aumenta el padding vertical para más espacio arriba y abajo
    paddingHorizontal: 12, // Ajusta el padding horizontal para reducir la amplitud
    borderRadius: 5,
    marginTop: 30,
    marginRight: 20,
    alignSelf: 'flex-end',
    width: '15%',
  },
  buttonText: {
    color: 'white',
    fontSize: 14, // Reducimos el tamaño de la fuente
  },
});

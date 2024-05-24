import { StyleSheet, Text, View, FlatList, RefreshControl } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import SupNavbar from "../../components/supNavbar";

import { colores } from "../../colors";
import { useIsFocused } from "@react-navigation/native";
import Partido from "../../components/Partido";
import { getPartidos } from "../../api";

import { UserContext } from "../../context/UserDataContext";

const PartidosScreen = () => {
  const usercontext = useContext(UserContext);

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
  }, [isFocusing]);

  const renderItem = ({ item }) => {
    return <Partido partido={item} hasActions={false}></Partido>;
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
});

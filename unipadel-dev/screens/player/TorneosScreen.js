import { StyleSheet, Text, View, FlatList, RefreshControl } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import SupNavbar from "../../components/supNavbar";

import { colores } from "../../colors";
import { useIsFocused } from "@react-navigation/native";
import Torneo from "../../components/Torneo";
import { getTorneos, getParejas } from "../../api";

import { UserContext } from "../../context/UserDataContext";

const TorneosScreen = () => {
  const usercontext = useContext(UserContext);
  const [torneos, setTorneos] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const isFocusing = useIsFocused();

  const loadTorneos = async () => {
    const data = await getTorneos();
    setTorneos(data.data);
  };

  const loadParejas = async () => {
    let par = await getParejas(usercontext.user.email);
    usercontext.setParejas(par.data);
  }

  const onRefresh = React.useCallback(async () => {
    setRefresh(true);
    await loadTorneos();
    await loadParejas();
    setRefresh(false);
  });

  useEffect( () => {
     loadTorneos();
     loadParejas();
  }, [isFocusing]);

  const renderItem = ({ item }) => {
    return <Torneo torneo={item} state={true}></Torneo>;
  };

  return (
    <View style={styles.container}>
      <SupNavbar></SupNavbar>
      <Text style={styles.title}>TORNEOS</Text>
      <View style={styles.titleUnderline}></View>
      <FlatList
        data={torneos}
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

export default TorneosScreen;

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

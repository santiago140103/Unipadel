import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { colores } from "../../colors";
import { auth } from "../../firebase";

import SupNavbar from "../../components/supNavbar";
import { getTorneosOrg } from "../../api";
import { useIsFocused } from "@react-navigation/native";
import Torneo from "../../components/Torneo";
import { UserContext } from "../../context/UserDataContext";

const TorneosOrganizadorScreen = () => {

  const usercontext = useContext(UserContext);

  const renderItem = ({ item }) => {
    return <Torneo torneo={item} state={false}/>;
  };

  const [torneos, setTorneos] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const isFocusing = useIsFocused();

  const loadTorneos = async () => {
    const data = await getTorneosOrg(usercontext.user.id);
    setTorneos(data.data);
  };

  const onRefresh = React.useCallback(async () => {
    setRefresh(true);
    await loadTorneos();
    setRefresh(false);
  });

  useEffect(() => {
    loadTorneos();
  }, [isFocusing]);

  return (
    <View style={styles.container}>
      <SupNavbar></SupNavbar>
      <Text style={styles.title}>Torneos creados</Text>
      <View style={styles.titleUnderline}></View>
      <FlatList
        data={torneos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
        style={styles.listado}
        contentContainerStyle={{alignItems: 'center'}}
      />
    </View>
  );
};

export default TorneosOrganizadorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%"
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
  listado:{
    width: "100%",
    marginTop: 5
  }
});

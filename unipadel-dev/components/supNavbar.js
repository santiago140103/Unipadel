import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/core";
import { auth } from "../firebase";

const SupNavbar = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.navbar}>
      <View>
        <Image
          style={{ resizeMode: "contain", width: 100 }}
          source={require("../assets/images/logo/logo2.png")}
        />
      </View>
      {auth.currentUser && (
        <TouchableOpacity onPress={() => navigation.push("Profile")}>
          <Image
            style={{ resizeMode: "contain", height: 25 }}
            source={require("../assets/images/icons/user.png")}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SupNavbar;

const styles = StyleSheet.create({
  navbar: {
    // position: "absolute",
    // top: 0,
    // marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    // flex: 1,
    height: 50,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    backgroundColor: "white",
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    zIndex: 1,
  },
});

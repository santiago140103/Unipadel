import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import React, { useState, useEffect, useContext } from "react";
import { auth } from "../firebase";
import { colores } from "../colors";

import { useNavigation } from "@react-navigation/core";
import Triangles from "../components/triangles";
import { attemptLogin, getParejas } from "../api";

import { UserContext } from "../context/UserDataContext";


const LoginScreen = () => {
  const usuarioContext = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const detectUser = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const res = await attemptLogin(user.email);
        if (res.data.data != null) {
          usuarioContext.setUser(res.data.data);
          if (res.data.data.tipo === 1) {
            console.log(res.data.data.tipo);
            navigation.replace("OrganizerHome");
          } else {
            const par = await getParejas(user.email);
            usuarioContext.setParejas(par.data);
            navigation.replace("PlayerHome");
          }
        } else {
          // PENDIENTE DESARROLLAR
          // Código para mostrar aviso de que hay un problema con su usuario
        }
      }
    });

    return detectUser;
  }, [user]);

  const handleLogin = () => {
    auth.signInWithEmailAndPassword(email, password)
    .then((res) => {
      setUser(res);
    })
    .catch((err) => {
      alert(err.message);
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.imageContainer}>
          <Image
            style={{ resizeMode: "contain", width: 150, height: 150 }}
            source={require("../assets/images/logo/logo1.png")}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            placeholder="Correo de acceso..."
            value={email}
            onChangeText={(text) => setEmail(text.trim())}
            style={styles.input}
          />
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            placeholder="Contraseña de acceso..."
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            style={styles.input}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Acceder</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.linksContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.replace("Register");
            }}
          >
            <Text style={styles.link}>¿No tienes cuenta? ¡Únete gratis!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.push("Home");
            }}
          >
            <Text style={[styles.link, { textAlign: "right" }]}>
              Continuar como invitado
            </Text>
          </TouchableOpacity>
        </View>

        <Triangles></Triangles>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  label: {
    color: colores.darkblue,
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
  },
  linksContainer: {
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  link: {
    color: colores.darkblue,
    fontWeight: "bold",
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  button: {
    backgroundColor: colores.darkblue,
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 10,
    borderColor: "blue",
    borderWidth: 1,
  },
  buttonOutlineText: {
    color: "blue",
  },
});

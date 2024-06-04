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
import { useNavigation } from "@react-navigation/core";

import { auth } from "../firebase";
import { colores } from "../colors";
import Triangles from "../components/triangles";
import { attemptLogin, storeUserInfo, getParejas } from "../api";
import { UserContext } from "../context/UserDataContext";

const RegisterScreen = () => {
  const usuarioContext = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState(0);
  const [user, setUser] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    // PENDIENTE DESARROLLAR
    // Posibilidad de mostrar un icono de loading

    const detectUser = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const res = await attemptLogin(user.email);
        if (res.data.data != null) {
          usuarioContext.setUser(res.data.data);
          if (res.data.data.tipo == 1) {
            console.log('Tipo: ' + res.data.data.tipo);
            navigation.replace("OrganizerHome");
          } else {
            const par = await getParejas(user.email);
            usuarioContext.setParejas(par.data);
            navigation.replace("PlayerHome");
            console.log('Tipo: ' + res.data.data.tipo);
          }
        } else {
          // PENDIENTE DESARROLLAR
          // Código para mostrar aviso de que hay un problema con su usuario
        }
      }
    });

    return detectUser;
  }, [user]);

  const handleSignUp = async () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(async () => {
        const res = await storeUserInfo({
          email: email.toLowerCase(),
          name: nombre,
          tipo: tipo,
        });
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
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            placeholder="Correo de acceso..."
            value={email}
            onChangeText={(text) => setEmail(text)}
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
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            placeholder="Introduce tu nombre"
            value={nombre}
            onChangeText={(text) => setNombre(text)}
            style={styles.input}
          />
          <Text style={styles.label}>Tipo de usuario</Text>
          <View style={styles.selector}>
            <TouchableOpacity
              style={[
                styles.selection,
                tipo === 0 ? styles.selected : styles.notSelected,
              ]}
              onPress={() => setTipo(0)}
            >
              <Text style={styles.touchableText}>Jugador</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selection,
                tipo === 0 ? styles.notSelected : styles.selected,
              ]}
              onPress={() => setTipo(1)}
            >
              <Text style={styles.touchableText}>Organizador</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSignUp} style={styles.button}>
            <Text style={styles.buttonText}>Unirse</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.linksContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.replace("Login");
            }}
          >
            <Text style={styles.link}>Volver al login</Text>
          </TouchableOpacity>
        </View>

        <Triangles></Triangles>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;

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
  selector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  selection: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  selected: {
    backgroundColor: colores.yellow,
    borderColor: colores.blue,
    shadowColor: "gray",
    elevation: 15,
  },
  notSelected: {
    backgroundColor: "#fff",
  },
});

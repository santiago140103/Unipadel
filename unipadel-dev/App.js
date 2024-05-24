import { StyleSheet, LogBox, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";

import { UserProvider } from "./context/UserDataContext";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

import HomeScreen from "./screens/HomeScreen";

import ProfileScreen from "./screens/ProfileScreen";

import PlayerNavigation from "./screens/player/PlayerNavigation";
import OrganizerNavigation from "./screens/organizer/OrganizerNavigation";

import TorneoForm from "./screens/organizer/TorneoForm";
import RecursoForm from "./screens/organizer/RecursoForm";
import TorneosOrganizadorScreen from "./screens/organizer/OrganizerTournamentsScreen";
import GestionarTorneoScreen from "./screens/organizer/GestionarTorneoScreen";
import GestionarRecursosScreen from "./screens/organizer/GestionarRecursosScreen";
import GestionarInscripcionesScreen from "./screens/organizer/GestionarInscripciones";
import HorariosTorneoScreen from "./screens/organizer/HorariosTorneoScreen";
import TorneoPartidos from "./screens/organizer/TorneoPartidos";
import ClasificacionScreen from "./screens/organizer/ClasificacionScreen";

import ParejaForm from "./screens/player/ParejaForm";
import PartidosScreen from "./screens/player/PartidosScreen";
import PlayerTorneoScreen from "./screens/player/PlayerTournamentsScreen";
import TorneoPartidosUsuario from "./screens/player/TorneoPartidosUsuario";
import InscripcionForm from "./screens/player/InscripcionForm";

const Stack = createNativeStackNavigator();
LogBox.ignoreLogs([
  "AsyncStorage has been extracted from react-native core and will be removed in a future release",
]);

export default function App() {
  return (
    <UserProvider>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "white" },
            }}
          >
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}>
            </Stack.Screen>
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
            ></Stack.Screen>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}>
            </Stack.Screen>
            <Stack.Screen
              name="PlayerHome"
              component={PlayerNavigation}
            ></Stack.Screen>
            <Stack.Screen
              name="OrganizerHome"
              component={OrganizerNavigation}
            ></Stack.Screen>
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
            ></Stack.Screen>
            <Stack.Screen
              name="TorneoForm"
              component={TorneoForm}
            ></Stack.Screen>
            <Stack.Screen
              name="ListadoTorneosOrganizador"
              component={TorneosOrganizadorScreen}
            ></Stack.Screen>
            <Stack.Screen
              name="GestionarTorneo"
              component={GestionarTorneoScreen}
            ></Stack.Screen>
            <Stack.Screen
              name="GestionarRecursos"
              component={GestionarRecursosScreen}
            ></Stack.Screen>
            <Stack.Screen
              name="GestionarInscripciones"
              component={GestionarInscripcionesScreen}
            ></Stack.Screen>
            <Stack.Screen
              name="ParejaForm"
              component={ParejaForm}
            ></Stack.Screen>
            <Stack.Screen
              name="RecursoForm"
              component={RecursoForm}
            ></Stack.Screen>
            <Stack.Screen
              name="PartidosScreen"
              component={PartidosScreen}
            ></Stack.Screen>
            <Stack.Screen
              name="HorariosTorneoScreen"
              component={HorariosTorneoScreen}
            ></Stack.Screen>
            <Stack.Screen
              name="TorneoPartidosScreen"
              component={TorneoPartidos}
            ></Stack.Screen>
            <Stack.Screen
              name="PlayerTorneoScreen"
              component={PlayerTorneoScreen}
            ></Stack.Screen>
            <Stack.Screen
              name="TorneoPartidosUsuario"
              component={TorneoPartidosUsuario}
            ></Stack.Screen>
            <Stack.Screen
              name="InscripcionTorneoUsuario"
              component={InscripcionForm}
            ></Stack.Screen>
            <Stack.Screen
              name="ClasificacionTorneo"
              component={ClasificacionScreen}
            ></Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({});

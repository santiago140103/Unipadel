import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, TextInput, FlatList, RefreshControl } from 'react-native';
import { useRoute } from "@react-navigation/native";
import Mensaje from "../../components/Mensaje";

import { getMensajesPartido, saveMensaje } from '../../api';
import { useIsFocused } from "@react-navigation/native";

import { UserContext } from "../../context/UserDataContext";

const ChatPartido = () => {
    const route = useRoute();
    const [mensajes, setMensajes] = useState([]);
    const [content, setContent] = useState("");
    const isFocusing = useIsFocused();
    const usercontext = useContext(UserContext);
    const flatListRef = useRef(null);
    
    const getMensajes = async () => {
        const data = await getMensajesPartido(route.params);
        setMensajes(data.data);
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }, 0);
    };

    useEffect(() => {
        console.log("Partido: " + route.params);
        getMensajes();
        
      }, [isFocusing]);

      const renderItem = ({ item }) => {
        if (item != undefined) {
            return (
                <View>
                  <Mensaje mensaje={item} hasActions={false}></Mensaje>
                </View>
              );
        }
        
        return;
      };

      const enviarMensaje = async () => {
        let request = {
            uidSender: usercontext.user.id,
            idPartido: route.params,
            content: content
        };
        await saveMensaje(request);

        //actualizar mensajes
        const nuevosMensajes = await getMensajesPartido(route.params);
        const allMensajes = [...mensajes, ...nuevosMensajes.data];
        const uniqueMensajes = Array.from(new Set(allMensajes.map(m => m.id)))
            .map(id => allMensajes.find(m => m.id === id));
        setMensajes(uniqueMensajes);

        //vaciar text input
        setContent("");

        //hacer automaticamente scroll down
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 0);
      }

  return (
    <View style={styles.container}>
      
      <FlatList
        style = {styles.FlatList}
        ref={flatListRef}
        data={mensajes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      
      {/**Text input */}
      <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Ajusta el valor según sea necesario
    >
        <TouchableOpacity style={styles.sendButton} onPress={() => enviarMensaje()}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
        <TextInput
            placeholder="Envia un mensaje..."
            value={content}
            onChangeText={(text) => setContent(text)}
            style={styles.textInput}
          />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },

  FlatList: {
    marginBottom: 50,
  },
  
  sendButton: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'flex-end',
    backgroundColor: 'lightgreen',
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 12,
    paddingBottom: 5,
    borderRadius: 15,
    width: '18%'
  },
  sendButtonText: {
    fontSize: 14,
    marginBottom: 2,
  },
  
textInput: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  paddingHorizontal: 10,
  paddingBottom: 5,
  backgroundColor: 'white',
  height: 40,
  borderWidth: 1,
  borderColor: 'gray',
  paddingHorizontal: 10,
  width: '80%',
  borderRadius: 20,
  marginBottom: 5,
},

});

export default ChatPartido;

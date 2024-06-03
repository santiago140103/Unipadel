import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, TextInput, FlatList, Platform } from 'react-native';
import { useRoute, useIsFocused } from "@react-navigation/native";
import Mensaje from "../../components/Mensaje";
import { chatBot, getMensajesPartido, saveMensaje, getTorneoIdWithPartidoId } from '../../api';
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
        }, 100);
    };

    useEffect(() => {
        if (isFocusing) {
            getMensajes();
        }
    }, [route.params, isFocusing]);

    const renderItem = ({ item }) => {
        if (item !== undefined) {
            return (
                <View>
                    <Mensaje mensaje={item} hasActions={false} />
                </View>
            );
        }
        return null;
    };

    const actualizarMensajes = async () => {
        const nuevosMensajes = await getMensajesPartido(route.params);
        const allMensajes = [...mensajes, ...nuevosMensajes.data];
        const uniqueMensajes = Array.from(new Set(allMensajes.map(m => m.id)))
            .map(id => allMensajes.find(m => m.id === id));
        setMensajes(uniqueMensajes);
        setContent("");
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const enviarMensaje = async () => {
        let request = {
            uidSender: usercontext.user.id,
            idPartido: route.params,
            content: content
        };
        await saveMensaje(request);
        await actualizarMensajes();

        if (content.startsWith('@chatbot')) {
            const mensajeParaChatbot = content.slice('@chatbot'.length).trim();
            const data = await getTorneoIdWithPartidoId(route.params);
            const idTorneo = parseInt(data.data[0], 10);

            let requestChatBot = {
                mensaje: mensajeParaChatbot,
                idTorneo: idTorneo,
                idPartido: route.params,
                uidSender: usercontext.user.id
            };
            console.log('Request para el chatbot: ')
            console.log(requestChatBot);
            console.log(mensajeParaChatbot);
            await chatBot(requestChatBot);
            await actualizarMensajes();
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View style={styles.header}>
                <Text style={styles.headerText}>Chat</Text>
            </View>

            <FlatList
                style={styles.FlatList}
                ref={flatListRef}
                data={mensajes}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Envia un mensaje..."
                    value={content}
                    onChangeText={setContent}
                    style={styles.textInput}
                />
                <TouchableOpacity style={styles.sendButton} onPress={enviarMensaje}>
                    <Text style={styles.sendButtonText}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    FlatList: {
        marginTop: 75,
        marginBottom: 50,
    },
    inputContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 5
    },
    sendButton: {
        backgroundColor: 'lightgreen',
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 15,
    },
    sendButtonText: {
        fontSize: 14,
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 10,
        height: 40,
    },
});

export default ChatPartido;

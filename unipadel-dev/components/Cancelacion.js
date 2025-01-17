import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Button, TextInput } from 'react-native';
import { useRoute, useIsFocused } from '@react-navigation/native';
import { getUsuariosCancelacion, updateEstadoCancelacion, getFullPartido, getTorneos, updateComentarioCancelacion } from '../api';
import colores from '../colors.js';

const Cancelacion = ({ cancelacion }) => {
    const [cancelacionUsers, setCancelacionUsers] = useState([]); 
    const [torneo, setTorneo] = useState(""); 
    const [comentario, setComentario] = useState(cancelacion.comentario ?? ""); 
    const [loading, setLoading] = useState(false);
    const isFocused = useIsFocused();
    const inputRef = useRef();

    const obtenerUsuarios = useCallback(async () => {
        setLoading(true);
        console.log('Fetching cancelaciones');
        try {
            const data = await getUsuariosCancelacion(cancelacion.idPareja); 
            setCancelacionUsers(data.data);
            const partidoData = await getFullPartido(cancelacion.idPartido);
            const torneoData = await getTorneos(partidoData.data.torneo_id);
            setTorneo(torneoData.data.nombre);
        } catch (error) {
            console.error('Error fetching usuarios cancelaciones:', error);
        } finally {
            setLoading(false);
        }
    }, [cancelacion.idPareja]);

    const marcarComoGestionada = useCallback(async () => {
        setLoading(true);
        try {
            const request = {
                id:cancelacion.id,
                estado:1
            }
            const data = await updateEstadoCancelacion(request);
            cancelacion.estado = 1;
        } catch (error) {
            console.error('Error actualizando el estado de la cancelacion:', error);
        } finally {
            setLoading(false);
        }
    },);

    const saveComentario = useCallback(async () => {
        setLoading(true);
        try {
            const request = {
                id:cancelacion.id,
                comentario:comentario
            }
            const data = await updateComentarioCancelacion(request);
        } catch (error) {
            console.error('Error actualizando el comentario de la cancelacion:', error);
        } finally {
            setLoading(false);
        }
    },);


    useEffect(() => {
        if (isFocused && !loading) {
            obtenerUsuarios();
        }
      }, [isFocused, cancelacion.idPareja]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{torneo}</Text>
            <ScrollView>
                <Text style={styles.userInfo}>{cancelacion.date}</Text>
                {cancelacionUsers.map(user => (
                    <TouchableOpacity key={user.id} style={styles.card}>
                        <Text style={styles.userInfo}>{user.name}</Text>
                        <Text style={styles.userInfo}>{user.email}</Text>
                    </TouchableOpacity>
                ))}
                <TextInput
                    useRef = {inputRef}
                    autoFocus = {true}
                    style={{height: 40}}
                    placeholder = {comentario == "" ? "Escribe un comentario" : comentario}
                    onChangeText={comentario => setComentario(comentario)}
                    defaultValue={comentario}
                />
                <Button onPress={saveComentario} title = "Guardar comentario"/>
            </ScrollView>
            {cancelacion.estado == 0 ? (
                <TouchableOpacity style={styles.gestionarButton}
                onPress = {() => marcarComoGestionada()}>
                <Text style={styles.gestionarButtonText}>Marcar como gestionada</Text>
            </TouchableOpacity>
            ) : (
                <Text style={styles.gestionadaText}>Cancelación gestionada</Text>
            )}
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#bee1f4',
        padding: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        backgroundColor: '#fbeab6'
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
    },
    userInfo: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    gestionarButton: {
        backgroundColor: '#FF6666',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    gestionarButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },

    gestionadaText: {
        color: '#28A745',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },

    TextInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },

});

export default Cancelacion;

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useIsFocused } from '@react-navigation/native';
import { getUsuariosCancelacion } from '../api';
import colores from '../colors.js';

const Cancelacion = ({ cancelacion }) => {
    const [cancelacionUsers, setCancelacionUsers] = useState([]); 
    const [loading, setLoading] = useState(false);
    const isFocused = useIsFocused();

    const obtenerUsuarios = useCallback(async () => {
        setLoading(true);
        console.log('Fetching cancelaciones');
        try {
            const data = await getUsuariosCancelacion(cancelacion.idPareja); 
            setCancelacionUsers(data.data);
        } catch (error) {
            console.error('Error fetching usuarios cancelaciones:', error);
        } finally {
            setLoading(false);
            console.log('Users: ');
            console.log(cancelacionUsers);
        }
    }, [cancelacion.idPareja]);


    useEffect(() => {
        if (isFocused && !loading) {
            obtenerUsuarios();
        }
      }, [isFocused, cancelacion.idPareja]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Torneo Verano LP - Jornada 2</Text>
            <ScrollView>
                {cancelacionUsers.map(user => (
                    <TouchableOpacity key={user.id} style={styles.card}>
                        <Text style={styles.userInfo}>{user.name}</Text>
                        <Text style={styles.userInfo}>{user.email}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <TouchableOpacity style={styles.gestionarButton}>
                <Text style={styles.gestionarButtonText}>Gestionar</Text>
            </TouchableOpacity>
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
});

export default Cancelacion;

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useRoute, useIsFocused } from '@react-navigation/native';
import { getCancelaciones } from '../../api';
import Cancelacion from '../../components/Cancelacion';

const GestionarCancelaciones = () => {
  const route = useRoute();
  const isFocused = useIsFocused();
  const [cancelaciones, setCancelaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const obtenerCancelaciones = useCallback(async () => {
        setLoading(true);
        console.log('Fetching cancelaciones');
        try {
            const data = await getCancelaciones(route.params); 
            setCancelaciones(data.data);
            console.log('Cancelaciones:', data.data);
        } catch (error) {
            console.error('Error fetching cancelaciones:', error);
        } finally {
            setLoading(false);
        }
  }, [route.params]);

  useEffect(() => {
    if (isFocused && !loading) {
        obtenerCancelaciones();
    }
  }, [isFocused, route.params, getCancelaciones]);

  const renderItem = ({ item }) => (
    <Cancelacion cancelacion={item} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Cancelaciones</Text>
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : cancelaciones.length > 0 ? (
        <FlatList
          data={cancelaciones}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.noCancelaciones}>No hay cancelaciones</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    cancelacionItem: {
        backgroundColor: '#E0E0E0',
        padding: 16,
        borderRadius: 8,
        marginBottom: 56, 
      },
    parejaText: {
        fontSize: 16,
        marginBottom: 4,
    },
    fechaText: {
        fontSize: 14,
        color: '#888',
    },
    noCancelaciones: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default GestionarCancelaciones;

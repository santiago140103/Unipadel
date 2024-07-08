import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { useRoute, useIsFocused } from '@react-navigation/native';
import { getCancelaciones } from '../../api';
import Cancelacion from '../../components/Cancelacion';
import DropDownPicker from 'react-native-dropdown-picker';

const GestionarCancelaciones = () => {
  const route = useRoute();
  const isFocused = useIsFocused();
  const [cancelaciones, setCancelaciones] = useState([]);
  const [cancelacionesCopia, setCancelacionesCopia] = useState([]);
  const [loading, setLoading] = useState(false);

  const [estadoOpen, setEstadoOpen] = useState(false);
  const [estadoValue, setEstadoValue] = useState(null);
  const [estadoItems, setEstadoItems] = useState([
    { label: 'No Gestionadas', value: '0' },
    { label: 'Gestionadas', value: '1' },
    { label: 'Ambas', value: '2' }
  ]);

  const [fechaOpen, setFechaOpen] = useState(false);
  const [fechaValue, setFechaValue] = useState(null);
  const [fechaItems, setFechaItems] = useState([
    { label: 'Fecha Ascendente', value: 0 }, //ascendente
    { label: 'Fecha Descendente', value: 1 } //descendente
  ]);

  const obtenerCancelaciones = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getCancelaciones(route.params); 
            setCancelaciones(data.data);
            setCancelacionesCopia(data.data);
            console.log('Cancelaciones:', data.data);
        } catch (error) {
            console.error('Error fetching cancelaciones:', error);
        } finally {
            setLoading(false);
        }
  }, [route.params]);

  const filtrarPorEstado = (estado) => {
    
    if (estado == 2) {
      setCancelaciones(cancelacionesCopia);
      return;
    }
    setCancelaciones(cancelacionesCopia.filter(param=> param.estado === estado.toString()));
  }

  const ordenarPorFecha = (orden) => {
    const sortedCancelaciones = [...cancelaciones].sort((a, b) => {
        const dateA = new Date(a.date.replace(" ", "T"));
        const dateB = new Date(b.date.replace(" ", "T"));

        if (orden === 0) { //ascendente
            return dateA - dateB;
        } else if (orden === 1) { //descendente
            return dateB - dateA;
        }
        
        return 0; //caso en el que no es ni ascendente ni descendente
    });
    setCancelaciones(sortedCancelaciones);
  }

  useEffect(() => {
    if (isFocused && !loading) {
        obtenerCancelaciones();
        if (estadoValue !== null) {
          filtrarPorEstado(estadoValue);
        }
    }
  }, [isFocused, route.params, getCancelaciones]);

  const renderItem = ({ item }) => (
    <Cancelacion cancelacion={item} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Cancelaciones</Text>
      <View style= {styles.filterContainer}>
        <DropDownPicker
          open={estadoOpen}
          value={estadoValue}
          items={estadoItems}
          setOpen={setEstadoOpen}
          setValue={setEstadoValue}
          setItems={setEstadoItems}
          onChangeValue={(value) => {
            filtrarPorEstado(value);
          }}
          style={styles.dropdown}
          placeholder="Seleccionar Estado"
          zIndex={3000}
          zIndexInverse={1000}
        />
        <DropDownPicker
          open={fechaOpen}
          value={fechaValue}
          items={fechaItems}
          setOpen={setFechaOpen}
          setValue={setFechaValue}
          setItems={setFechaItems}
          onChangeValue={(value) => {
            ordenarPorFecha(value);
          }}
          style={styles.dropdown}
          placeholder="Ordenar por Fecha"
          zIndex={2000}
          zIndexInverse={2000}
        />
      </View>
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

    filterButton: {
      backgroundColor: '#90EE90', // Color verde claro
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },

    filterText: {
      color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },

    filterContainer: {
      flexDirection: 'row',
      width: '50%',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    dropdown: {
        width: '80%',
    },

});

export default GestionarCancelaciones;

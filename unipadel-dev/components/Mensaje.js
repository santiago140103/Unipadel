import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Mensaje = ({ mensaje }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.content}>{mensaje.content}</Text>
      <Text style={styles.date}>{mensaje.date}</Text>
      <Text style={styles.sender}>{mensaje.uidSender}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  content: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: 'gray',
  },
  sender: {
    fontSize: 12,
    color: 'blue',
    marginTop: 5,
  },
});

export default Mensaje;

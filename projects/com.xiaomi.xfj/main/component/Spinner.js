import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';

const Spinner = ({ visible, dataSource = [], defaultValue, onValueChanged, onClose }) => {
  const [selected, setSelected] = useState(defaultValue || dataSource[0]);

  const handleSelect = (item) => {
    setSelected(item);
    onValueChanged && onValueChanged({ newValue: item });
    onClose && onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.container}>
        <FlatList
          data={dataSource}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.item, selected === item && styles.selected]}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: 300,
    paddingVertical: 16
  },
  item: {
    padding: 16,
    alignItems: 'center'
  },
  selected: {
    backgroundColor: '#e0f7fa'
  },
  text: {
    fontSize: 18
  }
});

export default Spinner;
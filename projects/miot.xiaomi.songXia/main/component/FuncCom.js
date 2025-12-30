import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';


const FuncCom = ({ params, onControlPress }) => {

  // 控制按钮点击事件
  const handleControlPress = (item, index) => {
    onControlPress(item.key, !item.value);
  };

  return (
    <View style={styles.container}>
      {params.title && <Text style={styles.title}>{params.title}</Text>}
      <View style={styles.controlContainer}>
        {
          params.modeList && params.modeList.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.controlButton}
              onPress={() => handleControlPress(item, !item.value)}
            >
              <Image resizeMode="contain" style={styles.controlImage} source={item.value ? item.img.on : item.img.off}></Image>
              <Text style={styles.controlText}>{item.title}</Text>
            </TouchableOpacity>
          ))
        }
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginLeft: 12,
    marginRight: 12,
    borderRadius: 12,
    minHeight: 115,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 12
  },
  title: {
    fontSize: 15,
    color: '#1F2022',
    marginLeft: 30,
    fontWeight: 'bold',
    marginBottom: 10
  },
  controlContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  controlButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  controlImage: {
    width: 60,
    height: 60
  },
  controlText: {

    fontSize: 13,
    color: '#0a0b0cff'
  }
};

export default FuncCom;

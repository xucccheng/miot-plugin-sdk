import React, { useRef, useState, useEffect, useMemo } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import PluginStrings from "../../resources/strings";
import { DarkMode } from 'miot';
const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const images = {
  lockIcon: require('../../resources/images/lock_icon.png'),
  unLockIcon: require('../../resources/images/unlock_icon.png'),
  powerIcon: require('../../resources/images/power_icon.png'),
  historyIcon: require('../../resources/images/history_icon.png')
};

let isDark = false;
let mDarkModeListener = null;
const BottomCom = (props) => {


  const [powerTxt, setPowerTxt] = useState(PluginStrings.powerOff);

  const [lockImg, setLockImg] = useState(images.lockIcon);

  useEffect(() => {
    isDark = DarkMode.getColorScheme() === 'dark' ? true : false;
    mDarkModeListener = DarkMode.addChangeListener((object) => {
      if (object.colorScheme) {
        isDark = object.colorScheme === 'dark' ? true : false;
      }
    });
  }, []);

  useEffect(() => {
    console.log(props.params.power);
    setPowerTxt(props.params.power ? PluginStrings.powerOff : PluginStrings.powerOn);
  }, [props.params.power]);

  useEffect(() => {
    setLockImg(props.params.lock ? images.lockIcon : images.unLockIcon);
  }, [props.params.lock]);

  return (
    <View style={[styles.baseContainer, props.style]}>
      <TouchableOpacity style={[styles.BItem]} onPress={() => props.lockOnOff()}>
        <View style={[styles.BIconContainer, isDark ? { backgroundColor: 'xmrgba(255, 255, 255, .1)' } : { backgroundColor: 'rgba(255, 255, 255, .1)' }]}>
          <Image style={[styles.BIcon]} resizeMode="contain" source={lockImg} />
        </View>
        <Text style={[styles.BText]}>{PluginStrings.lock}</Text>
      </TouchableOpacity>
      <View style={[styles.BItem]}>
        <TouchableOpacity style={[styles.BIconContainer, isDark ? { backgroundColor: 'xmrgba(255, 255, 255, .1)' } : { backgroundColor: 'rgba(255, 255, 255, .1)' }]} onPress={() => props.powerOnOff()}>
          <Image style={[styles.BIcon]} resizeMode="contain" source={images.powerIcon} />
        </TouchableOpacity>
        <Text style={[styles.BText]}>{powerTxt}</Text>
      </View>
      <TouchableOpacity style={[styles.BItem]} onPress={() => props.linkChart()}>
        <View style={[styles.BIconContainer, isDark ? { backgroundColor: 'xmrgba(255, 255, 255, .1)' } : { backgroundColor: 'rgba(255, 255, 255, .1)' }]}>
          <Image style={[styles.BIcon]} resizeMode="contain" source={images.historyIcon} />
        </View>
        <Text style={[styles.BText]}>{PluginStrings.historyData}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    marginLeft: 11,
    marginRight: 11,
    // flex: 1,
    height: 107,
    paddingLeft: 19,
    paddingRight: 19,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    backgroundColor: "#2F3045",
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden'
  },
  BItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  BIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .1)'
  },
  BIcon: {
    width: 54,
    height: 54
  },
  BText: {
    marginTop: 4,
    fontSize: 15,
    color: '#fff'
  }
});

export default BottomCom;
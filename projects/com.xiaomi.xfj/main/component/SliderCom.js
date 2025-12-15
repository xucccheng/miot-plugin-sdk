import React, { useRef, useState, useEffect, useMemo } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from "react-native";
import PluginStrings from "../../resources/strings";

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const SliderCom = ({ style, params, openSet }) => {

  const [num, setNum] = useState(100);
  const [sliderColor, setSliderColor] = useState('#1CBCB4');

  useEffect(() => {
    let bfb = params.bfb;
    setNum(bfb);
    console.log('bfb', bfb);
    if (bfb >= 0 && bfb <= 5) {
      setSliderColor('rgba(243, 62, 48, 1)');
    } else if (bfb > 5 && bfb <= 20) {
      setSliderColor('rgba(243, 164, 34, 1)');
    } else {
      setSliderColor('#1CBCB4');
    }
  }, [params.bfb]);

  return (
    <View style={[styles.baseContainer, style]}>
      <View style={[styles.lvHeader]}>
        <Text style={[styles.lvTitle]}>{PluginStrings.lvWSY}</Text>
        <View style={[styles.lvSeparator]}></View>
        <Text style={[styles.lvNum]}>{num}%</Text>
        <TouchableOpacity style={[styles.lvSet]} onPress={() => openSet()} >
          <Text style={[styles.lvSetText]} >{PluginStrings.set}</Text></TouchableOpacity>
      </View>
      <View style={[styles.sliderContainer]}>
        <View style={[styles.container]}>
          <View style={[styles.slider, { backgroundColor: sliderColor, width: `${ num }%` }]}>
            <View style={[styles.block]}></View>
          </View>
        </View>
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  baseContainer: {
    marginLeft: 11,
    marginRight: 11,
    // marginTop: 11,
    // flex: 1,
    padding: 16,
    borderRadius: 17,
    backgroundColor: "#2F3045"
  },
  lvHeader: {
    flexDirection: 'row',
    alignItems: 'center'
    // justifyContent: 'space-between',
  },
  lvTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff'
  },
  lvSeparator: {
    width: 1,
    height: 10,
    backgroundColor: '#fff',
    marginLeft: 7,
    marginRight: 7
  },
  lvNum: {
    color: '#fff',
    fontSize: 15
  },
  lvSet: {
    position: 'absolute',
    right: 0,
    // marginLeft: auto,
    color: '#fff',
    fontSize: 15
    // marginLeft: 5,
  },
  lvSetText: {
    color: '#fff',
    fontSize: 15
  },
  lvSliderContainer: {

  },
  container: {
    flex: 1,
    height: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    justifyContent: 'center'
  },
  slider: {
    height: 15,
    width: '100%',
    paddingLeft: 15,
    borderRadius: 15,
    backgroundColor: '#1CBCB4',
    justifyContent: 'center',
    alignItems: 'center'
  },
  block: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    height: 11,
    width: 11,
    borderRadius: 11,
    overflow: 'hidden',
    backgroundColor: '#fff'
  },
  sliderContainer: {
    marginTop: 16,
    // overflow: 'hidden',
    height: 15,
    borderRadius: 15,
    backgroundColor: "#2F3045"
  },
  sliderBlockStyle: {
    // width: 11,
    // height: 11,
    // borderRadius: 11,
    // overflow: "hidden",
  }
});

export default SliderCom;
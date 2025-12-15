import React, { useRef, useState, useEffect, useMemo } from "react";
import { DarkMode } from 'miot';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Dimensions } from 'react-native';
let isDark = false;
let mDarkModeListener = null;
const PuDataCom = ({ params, style, sensor }) => {
  const [puDataList, setPuDataList] = useState([
    { title: 'VOC', value: 0, unit: '', key: 'voc' },
    { title: 'CO₂', value: 0, unit: 'ppm', key: 'co2' },
    { title: 'PM2.5', value: 0, unit: 'μg/m³', key: 'pm25' },
    { title: 'CHO', value: 0, unit: 'mg/m³', key: 'cho2' }
  ]);

  useEffect(() => {
    isDark = DarkMode.getColorScheme() === 'dark' ? true : false;

    mDarkModeListener = DarkMode.addChangeListener((object) => {
      if (object.colorScheme) {
        isDark = object.colorScheme === 'dark' ? true : false;
      }
    });
  }, []);

  useEffect(() => {

    if (!sensor || Object.keys(sensor).length === 0) {
      return;
    }
    if (!params || Object.keys(params).length === 0) {
      return;
    }
    let list = [];

    Object.keys(sensor).forEach((key) => {
      if (sensor[key]) {
        let item = sensor[key];
        if (key === 'voc') {
          list.unshift({ title: 'VOC', value: params.voc, unit: '', key: item.key });
        } else if (key === 'co2') {
          list.push({ title: 'CO₂', value: params.co2, unit: 'ppm', key: item.key });
        } else if (key === 'pm25') {
          list.push({ title: 'PM2.5', value: params.pm25, unit: 'μg/m³', key: item.key });
        } else if (key === 'cho2') {
          list.push({ title: 'CH₂O', value: parseFloat(params.cho2) / 100, unit: 'mg/m³', key: item.key });
        }
      }
    });

    setPuDataList(list);

  }, [sensor, params]);

  return (
    <View style={[styles.puDataContainer, style]}>
      {puDataList.map((item, index) => {
        if (item.title === 'VOC') {
          return (
            <View key={index} style={[styles.puDataItem]}>
              <Text style={[styles.puDataItemTitle, puDataList.length === 1 && styles.onlyTtitle]}>{item.title}</Text>
              <View style={[styles.puDataItemNumRow, styles.vocContainer]}>
                {/* isDark && item.value >= 2 */}
                <View
                  style={[styles.Level1, { backgroundColor: item.value >= 1 ? isDark ? 'xmrgba(255, 255, 255, .8)' : 'rgba(255, 255, 255, 1)' : 'xmrgba(255, 255, 255, .1)' }]}></View>
                <View style={[styles.Level2, { backgroundColor: item.value >= 2 ? isDark ? 'xmrgba(255, 255, 255, .8)' : 'rgba(255, 255, 255, 1)' : 'xmrgba(255, 255, 255, .1)' }]}></View>
                <View style={[styles.Level3, { backgroundColor: item.value >= 3 ? isDark ? 'xmrgba(255, 255, 255, .8)' : 'rgba(255, 255, 255, 1)' : 'xmrgba(255, 255, 255, .1)' }]}></View>
                <View style={[styles.Level4, { backgroundColor: item.value >= 4 ? isDark ? 'xmrgba(255, 255, 255, .8)' : 'rgba(255, 255, 255, 1)' : 'xmrgba(255, 255, 255, .1)' }]}></View>
                <View style={[styles.Level5, { backgroundColor: item.value >= 5 ? isDark ? 'xmrgba(255, 255, 255, .8)' : 'rgba(255, 255, 255, 1)' : 'xmrgba(255, 255, 255, .1)' }]}></View>
              </View>

              {(index + 1) !== puDataList.length && <View type="column" style={[styles.puDataItemSeparator, { backgroundColor: isDark ? 'xmrgba(255, 255, 255, .8)' : 'rgba(255, 255, 255, .2)' }]} />}
            </View>
          );
        } else {
          return (
            <View key={index} style={[styles.puDataItem]}>
              <Text style={[styles.puDataItemTitle, puDataList.length === 1 && styles.onlyTtitle]}>{item.title}</Text>
              <View style={[styles.puDataItemNumRow]}>
                <Text style={[styles.puDataItemNum]}>{item.value}</Text>
                <Text style={[styles.puDataItemUnit]}>{item.unit}</Text>
              </View>

              {(index + 1) !== puDataList.length && <View type="column" style={[styles.puDataItemSeparator, { backgroundColor: isDark ? 'xmrgba(255, 255, 255, .8)' : 'rgba(255, 255, 255, .2)' }]} />}
            </View>
          );
        }

      })}
    </View>
  );
};

const styles = StyleSheet.create({
  puDataContainer: {
    // marginTop: 24,
    // height: 47,
    flexDirection: 'row',
    position: 'relative',
    paddingLeft: 13,
    paddingRight: 13,
    marginBottom: 21
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  puDataItem: {
    flex: 1,
    marginTop: 24,
    height: 47,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  puDataItemTitle: {
    fontSize: 11,
    color: '#fff',
    alignSelf: 'flex-start',
    flex: 1,
    marginLeft: 5
  },
  onlyTtitle: {
    // 只有一个标题的时候居中
    alignSelf: 'center'
  },
  puDataItemNumRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  puDataItemNum: {
    fontSize: 21,
    color: '#fff',
    textAlign: 'center',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignContent: 'center'
  },
  puDataItemUnit: {
    fontSize: 9,
    marginLeft: 4,
    top: 5,
    color: '#fff'
  },
  puDataItemSeparator: {
    height: 24,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, .2)',
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  vocContainer: {
    width: 43,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  Level1: {
    width: 7,
    height: 7,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'xmrgba(255, 255, 255, .1)'
  },
  Level2: {
    width: 7,
    height: 9,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'xmrgba(255, 255, 255, .1)'
  },
  Level3: {
    width: 7,
    height: 11,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'xmrgba(255, 255, 255, .1)'
  },
  Level4: {
    width: 7,
    height: 13,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'xmrgba(255, 255, 255, .1)'
  },
  Level5: {
    width: 7,
    height: 15,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'xmrgba(255, 255, 255, .1)'
  },
  vocActive: {
    backgroundColor: '#fff'
  }
});

export default PuDataCom;
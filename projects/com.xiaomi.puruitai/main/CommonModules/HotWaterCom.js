import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { API_LEVEL, Package, Host, Device, PackageEvent, Service, DeviceEvent } from 'miot';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions
} from "react-native";
import { Switch } from "mhui-rn";
import PluginStrings from '../../resources/strings';

const HotWaterCom = ({ setHot, hotNum, updateData, hotWaterState }) => {
  const [value, setValue] = useState(0); // 当前值

  const [switchValue, setSwitchValue] = useState(false);

  const [updateTimer, setUpdateTimer] = useState(1);

  const [isUpdating, setIsUpdating] = useState(false);

  const minValue = 35; // 最小值
  const maxValue = 55; // 最大值

  const sliderWidth = Dimensions.get("window").width - 206; // 滑动条总宽度
  const animatedWidth = useRef(
    new Animated.Value(((value - minValue) / (maxValue - minValue)) * sliderWidth)
  ).current; // 动画宽度

  const panResponder = useRef(
    PanResponder.create({
    })
  ).current;

  const setPropertiesValue = (params) => {
    console.log('setPropertiesValue', params);
    Service.spec.setPropertiesValue(params).then((res) => {
      console.log('setPropertiesValue success ', res);
    }).catch((error) => {
      console.log('setPropertiesValue error ', error);
    });
  };

  useEffect(() => {
    console.log('setHot', setHot);
    // setValue(setHot);
    upDateValue(setHot);
  }, [setHot]);

  useEffect(() => {
    console.log('hotWaterState', hotWaterState);
    // setValue(setHot);
    setSwitchValue(hotWaterState);
  }, [hotWaterState]);

  const upDateValue = (value) => {
    Animated.timing(animatedWidth, {
      toValue: ((value - minValue) / (maxValue - minValue)) * sliderWidth,
      duration: 200,
      useNativeDriver: false
    }).start();
    setValue(value);
    clearTimeout(updateTimer);
    setUpdateTimer(setTimeout(() => {
      let params = [
        { did: Device.deviceID, siid: 6, piid: 2, value: value }
        // { did: Device.deviceID, siid: 6, piid: 16, value: true }
      ];
      setPropertiesValue(params);
    }, 500));
    // updateData(value);
  };

  const updateSwitchValue = (value) => {
    setSwitchValue(value);
    clearTimeout(updateTimer);
    setUpdateTimer(setTimeout(() => {
      let params = [
        { did: Device.deviceID, siid: 6, piid: 16, value: value }
      ];
      setPropertiesValue(params);
    }, 500));
  };


  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <Text style={styles.nums}>{value ? value : '--'}℃</Text>
        <Text style={styles.current}>{PluginStrings.currentWaterTemperature}：{hotNum}℃</Text>
      </View>
      <View style={[styles.switchContent]}>
        <Text style={[styles.sContnet]}>{PluginStrings.hotWaterValve}</Text>
        <Switch
          onTintColor="#447EF2"
          style={{ width: 41, height: 21, marginLeft: 'auto' }}
          value={switchValue}
          onValueChange={(value) => updateSwitchValue(value)}

        ></Switch>
      </View>
      <View style={[styles.content]}>
        {/* 减号按钮 */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (value > minValue) {
              const newValue = value - 1;
              upDateValue(newValue);
            } else {
              upDateValue(minValue);
            }
          }}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>

        {/* 中间滑动条 */}
        <View style={[styles.slider, !switchValue ? styles.disabledStyle : '']}>
          <View style={styles.track}>
            {/* 蓝色进度条 */}
            <Text style={styles.valueLeftText}>{minValue}</Text>
            <Text style={styles.valueRightText}>{maxValue}</Text>
            <Animated.View
              style={[
                styles.progress,
                { width: animatedWidth } // 动态宽度
              ]}
              {...panResponder.panHandlers} // 手势绑定
            >
            </Animated.View>
          </View>
        </View>

        {/* 加号按钮 */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (!value) {
              upDateValue(minValue);
            } else if (value < maxValue) {
              const newValue = value + 1;
              upDateValue(newValue);
            } else {
              upDateValue(maxValue);
            }
          }}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    // marginTop: 50,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 25,
    paddingBottom: 25
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  nums: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#000000'
  },
  current: {
    fontSize: 14,
    color: 'rgba(102, 102, 102, .9)'
  },
  switchContent: {
    flexDirection: "row",
    marginTop: 32,
    // backgroundColor: '#000',
    // width: '100%',
    alignItems: "center",
    paddingLeft: 32,
    paddingRight: 32
  },
  sContnet: {
    flex: 1,
    fontSize: 14,
    color: '#000'
  },
  content: {
    flexDirection: "row",
    marginTop: 32,
    marginBottom: 20,
    marginLeft: 32,
    marginRight: 32
  },
  button: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EDEEEF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000"
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#888"
  },
  slider: {
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
    height: 46,
    borderRadius: 23,
    overflow: "hidden",
    marginHorizontal: 10,
    backgroundColor: "#EDEEEF"
  },
  track: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "#EDEEEF",
    position: "relative"
  },
  progress: {
    // flex: 1,
    // width: '100%',
    // position: 'absolute',
    height: "100%",
    backgroundColor: "#447EF2",
    alignItems: "center",
    justifyContent: "center"
    // borderTopLeftRadius: 23,
    // borderBottomLeftRadius: 23,
  },
  valueLeftText: {
    fontSize: 13,
    color: "#fff",
    position: "absolute",
    marginLeft: 14,
    zIndex: 3
  },
  valueRightText: {
    fontSize: 13,
    color: "#fff",
    position: "absolute",
    right: 14,
    zIndex: 3
  },
  disabledStyle: {
    opacity: 0.6
  }
});

export default HotWaterCom;
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  Image,
  ScrollView
} from "react-native";
import PluginStrings from "../../resources/strings";
import { useEffect } from "react";
import { use } from "react";

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const comHeight = screenHeight - 150;

const HumidityCom = ({ humi, updateData }) => {
  const [humidity, setHumidity] = useState(50);
  const [sliderHeight, setSliderHeight] = useState(0);
  const [mtSize, setMtSize] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true); // 控制ScrollView是否可滚动
  const sliderRef = useRef(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        setScrollEnabled(false); // 开始滑动时禁用ScrollView
        updateHumidity(gestureState.y0);
      },
      onPanResponderMove: (evt, gestureState) => {
        updateHumidity(gestureState.moveY);
      },
      onPanResponderRelease: () => {
        setScrollEnabled(true); // 结束滑动时重新启用ScrollView
      },
      onPanResponderTerminate: () => {
        setScrollEnabled(true); // 被终止时也要重新启用ScrollView
      },
      onPanResponderTerminationRequest: () => false
    })
  ).current;

  const updateHumidity = (y) => {
    sliderRef.current.measure((_, __, ___, height, ___2, pageY) => {
      const position = y - pageY; // 获取触摸点相对滑块顶部的距离
      let percentage = Math.max(0, Math.min(1, 1 - position / height)); // 计算百分比（反转方向）
      const newHumidity = Math.round(percentage * 100); // 转换为百分比
      setHumidity(newHumidity); // 更新湿度值
      updateData(newHumidity);
    });
  };

  useEffect(() => {
    setHumidity(humi);
  }, [humi]);

  useEffect(() => {
    setMtSize(humidity > 80 ? ((100 - humidity) * 3 + 30) : 16);
  }, [humidity]);



  return (
    <View style={styles.container}>
      <ScrollView
        scrollEnabled={scrollEnabled} // 动态控制滚动
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1, ...styles.containerScroll }}>
        <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.subHumiTitle}>
            {PluginStrings.humiTips}
          </Text>
          <View>
            <View
              style={styles.sliderContainer}
              ref={sliderRef}
              onLayout={(event) => setSliderHeight(event.nativeEvent.layout.height)}
              {...panResponder.panHandlers}
            >
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}>
                <Text style={[styles.humiNum, { marginTop: mtSize, color: humidity > 80 ? '#fff' : '#000' }]}>{humidity}</Text>
              </View>

              <Image
                resizeMode="contain"
                style={styles.humiIcon}
                source={require('../../resources/images/humi_icon.png')}
              />
              {/* 蓝色部分填充 */}
              <View style={[styles.filled, { height: `${ humidity }%` }]} />
              {/* 滑块 */}

              <View style={[styles.knob, { bottom: `${ humidity }%` }]}>
                <Image
                  resizeMode="contain"
                  style={styles.knobImg}
                  source={require('../../resources/images/humi_knob.png')}
                ></Image>
              </View>
            </View>
            <View style={styles.imgScaleContainer}>
              <Image
                resizeMode="contain"
                source={require('../../resources/images/humi_scale.png')} // 替换为你的本地图片路径
                style={[styles.imgScale]} // 修改颜色为红色
              />
              <View style={[styles.imgScaleOverlay, { height: `${ humidity }%` }]}>
                <Image
                  resizeMode="contain"
                  source={require('../../resources/images/humi_scale.png')} // 替换为你的本地图片路径
                  style={[{ tintColor: '#447EF2', height: 300 }]} // 修改颜色为红色
                />
              </View>

            </View>

          </View>
        </View>
      </ScrollView>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    // alignItems: "center",
    // marginTop: 50,
    height: comHeight > 412 ? 412 : comHeight,
    paddingBottom: 25,
    position: 'relative',
    width: '100%'
    // backgroundColor: '#000'
  },
  containerScroll: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20
  },
  subHumiTitle: {
    fontSize: 14,
    width: 230,
    color: '#666',
    textAlign: 'center'
  },
  sliderContainer: {
    marginTop: 50,
    width: 116,
    height: 300,
    borderRadius: 15,
    backgroundColor: '#F4F5FA',
    overflow: 'hidden',
    position: 'relative'
  },
  filled: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#447EF2',
    bottom: 0
  },
  knob: {
    position: 'absolute',
    width: 55,
    height: 55,
    // backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    transform: [
      { translateX: 30.5 }, // 水平偏移一半宽度
      { translateY: 30.5 } // 垂直偏移一半高度
    ]
  },
  knobImg: {
    width: 55,
    height: 55
  },
  humiNum: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 16,
    color: '#000000',
    zIndex: 9
  },
  humidityText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  humiIcon: {
    position: 'absolute',
    zIndex: 2,
    width: 24,
    height: 24,
    bottom: 20,
    left: '50%',
    transform: [
      { translateX: -12 } // 水平偏移一半宽度
    ]
  },
  imgScaleContainer: {
    marginTop: 50,
    height: 300,
    position: 'absolute',
    zIndex: 4,
    marginLeft: 130,
    justifyContent: 'flex-end'
  },
  imgScale: {
    height: 300,
    position: 'absolute'
  },
  imgScaleOverlay: {
    overflow: 'hidden',
    height: 300,
    justifyContent: 'flex-end'
    // backgroundColor: '#000000',
  }
});

export default HumidityCom;
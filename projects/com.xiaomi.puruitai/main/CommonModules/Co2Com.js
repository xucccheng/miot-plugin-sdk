import React, { useRef, useState, useEffect, useMemo } from "react";
import Svg, { Circle, Polygon, G } from "react-native-svg";

import { View, StyleSheet, Text, Image, Modal, PanResponder, Alert, Animated } from "react-native";
import PluginStrings from "../../resources/strings";

const Co2Com = ({ co2, updateData }) => {
  const targetRef = useRef(null); // 组件引用
  const [centerData, setCenterData] = useState({ x: 0, y: 0 }); // 中心点
  const centerDataRef = useRef(centerData); // Ref 存储最新的中心点数据
  const angle = useRef(new Animated.Value(0)).current;

  const [isInit, setIsInit] = useState(true); // 是否初始化

  const [isLoaded, setIsLoaded] = useState(false); // 是否加载完成
  const [angleValue, setAngleValue] = useState(300); // 用 state 监听角度变化
  const handleMeasure = (event) => {
    if (targetRef.current) {
      setTimeout(() => { // 让它延迟执行，确保组件已经渲染完成
        targetRef.current.measureInWindow((pageX, pageY, width, height) => {
          const centerX = pageX + width / 2;
          const centerY = pageY + height / 2;

          setCenterData({ x: centerX, y: centerY });
          // console.log("✅ 绝对中心点:", centerX, centerY);
        });
      }, 100);
    }
  };

  useEffect(() => {
    if (isInit) {
      setAngleValue(co2);
      // 平滑动画
      Animated.timing(angle, {
        toValue: parseAngle(co2),
        duration: 0, // 让动画更平滑
        useNativeDriver: true
      }).start();

      setIsInit(false);
    }
  }, [co2]);

  const parseAngle = (co2) => {
    if (co2 <= 300) {
      return 0;
    } else if (co2 > 300 && co2 <= 600) {
      return (co2 - 300) / 300 * 50;
    } else if (co2 > 600 && co2 <= 800) {
      return 50 + (co2 - 600) / 200 * 45;
    } else if (co2 > 800 && co2 <= 1000) {
      return 95 + (co2 - 800) / 200 * 55;
    } else if (co2 > 1000 && co2 <= 1200) {
      return 150 + (co2 - 1000) / 200 * 45;
    } else {
      return 195;
    }
  };

  useEffect(() => {
    centerDataRef.current = centerData; // 每次更新 centerData 时同步更新 ref
    // console.log("最新的中心点:", centerDataRef.current);
  }, [centerData]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, // 开始响应手势
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const { moveX, moveY } = gestureState;

        const { x: centerX, y: centerY } = centerDataRef.current; // 从 ref 获取中心点
        const dx = moveX - centerX;
        const dy = moveY - centerY;

        let newAngle = (Math.atan2(-dy, -dx) * 180) / Math.PI;
        newAngle = newAngle + 45;

        // 限制角度范围在 0 - 195 之间
        newAngle = Math.max(-150, Math.min(newAngle, 225));

        newAngle = newAngle < -45 ? 225 : newAngle;

        newAngle = newAngle > -45 && newAngle > 0 ? newAngle : 0;
        const r = Math.round(195 * newAngle / 225 * 100 / 100);
        // newAngle = newAngle > -60 && newAngle < 0 ? 0 : newAngle;
        // console.log("计算后的角度:", r);

        // 平滑动画
        Animated.timing(angle, {
          toValue: r,
          duration: 0, // 让动画更平滑
          useNativeDriver: true
        }).start();
      }
    })
  ).current;

  useEffect(() => {
    // ✅ 监听 Animated.Value 变化
    const listener = angle.addListener(({ value }) => {
      // console.log('value:', value)
      let v = 300;
      if (value <= 50 && value >= 0) {
        // 优
        v = 300 + Math.round(300 / 50 * value);
      } else if (value > 50 && value <= 95) {
        // 良
        v = 600 + Math.round(200 / 45 * (value - 50));
      } else if (value > 95 && value <= 150) {
        // 轻度污染
        v = 800 + Math.round(200 / 55 * (value - 95));
      } else if (value > 150 && value <= 195) {
        // 中度污染
        v = 1000 + Math.round(200 / 45 * (value - 150));
      } else {
        v = 1200;
      }
      setAngleValue(v); // 更新 state，触发渲染
      updateData(v);
    });

    setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => {
      angle.removeListener(listener); // 清理监听
    };
  }, []);

  // 让 Animated.Value 适配 transform.rotate
  const rotateInterpolate = angle.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"]
  });

  return (
    <View style={styles.co2Container} {...panResponder.panHandlers}>
      <Image
        resizeMode="contain"
        style={styles.co2Bg}
        source={require('../../resources/images/co2_chart.png')}
      ></Image>
      <Image
        resizeMode="contain"
        style={styles.co2BgScale}
        source={require('../../resources/images/co2_chart_scale.png')}
      >
      </Image>
      <View style={styles.rateContainer}>
        <Text style={styles.you}>{PluginStrings.rate1}</Text>
        <Text style={styles.liang}>{PluginStrings.rate2}</Text>
        <Text style={styles.qindu}>{PluginStrings.rate3}</Text>
        <Text style={styles.zhongdu}>{PluginStrings.rate4}</Text>
        <Text style={styles.zhongdu1}>{PluginStrings.rate5}</Text>
        <Text style={styles.yanzhong}>{PluginStrings.rate6}</Text>
      </View>
      <View style={[styles.co2BgPointerC]} ref={targetRef} onLayout={handleMeasure} {...panResponder.panHandlers}>
        <Animated.View style={[{
          transform: [
            { rotate: rotateInterpolate }
          ],
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1
        }]}>
          {isLoaded && <View style={[{
            transform: [
              { rotate: '-125deg' }
            ]
          }]}>
            <View style={[styles.pointer]} />
          </View>}
          <Image
            resizeMode="contain"
            style={styles.co2BgPointer}
            source={require('../../resources/images/co2_chart_pointer.png')}
          >

          </Image>


        </Animated.View>

        <View style={styles.co2Msg}>
          <Text style={styles.co2Num}>{angleValue}</Text>
          <Text style={styles.co2Unit}>ppm</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 285,
    height: 285
  },
  co2Container: {
    width: 285,
    height: 285,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  co2Bg: {
    width: 285,
    height: 220,
    position: 'absolute',
    top: 0
  },
  co2BgScale: {
    width: 221,
    height: 171,
    position: 'absolute',
    top: 31,
    left: 31,
    zIndex: 3
  },
  rateContainer: {
    width: 221,
    height: 171,
    position: 'absolute',
    top: 31,
    left: 31,
    zIndex: 3
  },
  you: {
    position: 'absolute',
    left: 30,
    bottom: 0,
    fontSize: 12,
    color: '#c2c2c2'
  },
  liang: {
    position: 'absolute',
    left: 15,
    top: 75,
    fontSize: 12,
    color: '#c2c2c2'
  },
  qindu: {
    position: 'absolute',
    left: 50,
    top: 22,
    fontSize: 12,
    color: '#c2c2c2'
  },
  zhongdu: {
    position: 'absolute',
    right: 50,
    top: 22,
    fontSize: 12,
    color: '#c2c2c2'
  },
  zhongdu1: {
    position: 'absolute',
    right: 15,
    top: 75,
    fontSize: 12,
    color: '#c2c2c2'
  },
  yanzhong: {
    position: 'absolute',
    right: 28,
    bottom: 0,
    fontSize: 12,
    color: '#c2c2c2'
  },
  co2BgPointerC: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  co2BgPointer: {
    width: 138,
    height: 138,
    position: 'absolute'
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 100,
    marginTop: -40,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "gold", // 黄色指针
    zIndex: 0
  },
  co2BgPoint: {
    width: 138,
    height: 138,
    position: 'absolute',
    top: 74,
    left: 74,
    zIndex: 4
  },
  co2Msg: {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 5
  },
  co2Num: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000'
  },
  co2Unit: {
    fontSize: 14,
    color: '#666666'
  }
});

export default Co2Com;
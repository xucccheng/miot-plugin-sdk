import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// 通风模式下不能控制温度
const TempControl = ({ tempNum, setValue, isDisabled }) => {
  const [temp, setTemp] = useState(0); // 当前值
  const minValue = 16; // 最小值
  const maxValue = 30; // 最大值
  const [isSend, setIsSend] = useState(false); // 是否在发送
  const [timer, setTimer] = useState(null); // 定时器

  const sliderWidth = Dimensions.get("window").width - 166; // 滑动条总宽度
  const animatedWidth = useRef(
    new Animated.Value(((tempNum - minValue) / (maxValue - minValue)) * sliderWidth)
  ).current; // 动画宽度

  const panResponder = useRef(
    PanResponder.create({})
  ).current;

  useEffect(() => {
    if (!isSend) {
      setTemp(tempNum);
      Animated.timing(animatedWidth, {
        toValue: ((tempNum - minValue) / (maxValue - minValue)) * sliderWidth,
        duration: 200,
        useNativeDriver: false
      }).start();
    }
  }, [tempNum]);

  const updateTemp = (value) => {
    if (isDisabled) {
      return; // 通风模式下不允许修改温度
    }
    setTemp(value);
    clearTimeout(timer);
    setIsSend(true);
    setValue(value);

    setTimer(setTimeout(() => {
      setIsSend(false);
    }, 300));

    Animated.timing(animatedWidth, {
      toValue: ((value - minValue) / (maxValue - minValue)) * sliderWidth,
      duration: 200,
      useNativeDriver: false
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* 减号按钮 */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (temp > minValue) {
            updateTemp(temp - 0.5);
          }
        }}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>

      {/* 中间滑动条 */}
      <View style={styles.slider}>
        <View style={styles.track}>
          {/* 蓝色进度条 */}
          <Text style={styles.valueLeftText}>16</Text>
          <Text style={styles.valueRightText}>30</Text>
          <Animated.View
            style={[
              styles.progress,
              isDisabled && styles.disabled, // 如果禁用则添加样式
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
          if (temp < maxValue) {
            updateTemp(temp + 0.5);
          }
        }}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 25,
    paddingBottom: 25
  },
  button: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EDEEEF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000"
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
  disabled: {
    opacity: 0.6
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
  }
});

export default TempControl;

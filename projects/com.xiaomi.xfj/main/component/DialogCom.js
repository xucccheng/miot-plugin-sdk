import { StringSpinner } from "mhui-rn";
import React, { useEffect, useState, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View, Image, Linking } from "react-native";
import PluginStrings from "../../resources/strings";
const screenWidth = Dimensions.get("window").width;
const DialogCom = ({ comType, visible, close, dialogList, title, confirm, type, hide, content, activeIndex }) => {
  if (!visible) return null; // 不显示时直接返回 null，不卸载组件

  // const [title, setTitle] = useState('设置');
  const [sendData, setSendData] = useState(0);

  const [btnTxtList, setBtnTxtList] = useState([PluginStrings.cancel, PluginStrings.confirm]);

  const [selectValue, setSelectValue] = useState(0);

  // const [list, setList] = useState(['自动', '手动', '定时', '睡眠'])
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      // 组件卸载时清除定时器，防止内存泄漏
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [])
  ;
  useEffect(() => {
    setSendData(dialogList[activeIndex]);
    setSelectValue(dialogList[activeIndex]);
  }, [dialogList]);

  const hideOverlay = () => {
    close();
  };
  const sendDataRef = useRef(sendData);

  useEffect(() => {
    sendDataRef.current = sendData;
    console.log('sendData', sendDataRef.current);
  }, [sendData]);

  const sure = () => {
    console.log('sendData', sendDataRef.current);
    // hideOverlay();
    timeoutRef.current = setTimeout(() => {
      console.log('sendData', sendDataRef.current);
      confirm(sendDataRef.current);
      hideOverlay();
    }, 300);

  };

  const updateSendData = (value) => {
    console.log('updateSendData', value.newValue);
    setSendData(value.newValue);
    setTimeout(() => {
      setSelectValue(value.newValue);
    }, 1000);
    console.log('sendData', sendData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay} onStartShouldSetResponder={() => close()}>
        <Animated.View
          style={[
            styles.modal
          ]}
          onStartShouldSetResponder={(e) => {
            // 阻止点击 modal 内容时触发关闭
            e.stopPropagation();
          }}
        >
          <Text style={styles.title}>{title}</Text>
          <View>
            {type === 'swiper' && <StringSpinner
              style={[styles.spinner]}
              dataSource={[...dialogList]}
              defaultValue={dialogList[activeIndex]}
              pickerInnerStyle={{
                lineColor: "rgba(255, 255, 255, .2)",
                textColor: "#fff",
                selectTextColor: "#1CBCB4",
                fontSize: 15,
                selectFontSize: 19,
                rowHeight: 40
              }}
              onValueChanged={(data) => {
                updateSendData(data);

              }}
            />}
            {type === 'text' &&
                            <View style={[styles.textContainer]}>
                              {content && content.length > 0 && content.map((item, index) => {
                                return (
                                  <Text key={`content${ index }`} style={[styles.textItem, index >= 1 && { marginTop: 7 }]} > {item}</Text>
                                );
                              })}
                            </View>
            }
          </View>
          {type === 'swiper' && <View style={styles.buttons} >
            <TouchableOpacity style={[styles.buttonItem]} onPress={hideOverlay}>
              <Text style={styles.cancelText}>{btnTxtList[0]}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonItem, styles.ml14]} onPress={sure}>
              <Text style={styles.confirmText}>{btnTxtList[1]}</Text>
            </TouchableOpacity>
          </View>}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    zIndex: 10
  },
  modal: {
    backgroundColor: "#2F3045",
    position: 'absolute',
    alignItems: 'center',
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    paddingTop: 19
  },
  title: {
    fontSize: 19,
    color: '#fff',
    width: '100%',
    paddingLeft: 33
  },
  spinner: {
    // flex: 1,
    height: 200,
    width: screenWidth - 72,
    marginTop: 10,
    marginBottom: 10
  },
  textContainer: {
    marginTop: 80,
    marginBottom: 67
  },
  textItem: {
    color: '#fff',
    fontSize: 15
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 20
  },
  buttonItem: {
    width: 146,
    height: 45,
    borderRadius: 23,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center"
  },
  ml14: {
    marginLeft: 14
  },
  cancelText: {
    color: "#1CBCB4",
    fontWeight: "bold",
    fontSize: 16
  },
  confirmButton: {
    marginLeft: 13
  },
  confirmText: {
    color: "#1CBCB4",
    fontWeight: "bold",
    fontSize: 16
  }
});

export default DialogCom;

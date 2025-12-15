import React, { useEffect, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View, Image, Linking, SafeAreaView } from "react-native";
import Co2Com from "./Co2Com";
import HumidityCom from "./HumidityCom";
import HotWaterCom from "./HotWaterCom";
import DatePickerCom from "./DatePickerCom";
import PluginStrings from "../../resources/strings";
const screenWidth = Dimensions.get("window").width;
const OverlayPage = ({ comType, close, comData, confirm, hide }) => {
  const [title, setTitle] = useState('设置');

  const [sendData, setSendData] = useState();

  const [btnTxtList, setBtnTxtList] = useState([PluginStrings.cancel, PluginStrings.sure]);

  const [isBottom, setIsBottom] = useState(false);

  // // 控制弹窗的动画
  // const slideAnim = new Animated.Value(screenHeight);

  // const showOverlay = () => {
  //     setVisible(true);
  //     Animated.timing(slideAnim, {
  //         toValue: 0,
  //         duration: 300,
  //         useNativeDriver: true
  //     }).start();
  // };

  const phoneNumber = 'tel:4008010113';

  const handleCall = () => {
    Linking.openURL(phoneNumber)
      .catch((err) => console.error('Failed to open dialer:', err));
  };

  const hideOverlay = () => {
    close();
  };

  const sure = () => {
    confirm(sendData);
  };

  useEffect(() => {
    setIsBottom(true);
    if (comType === 'co2') {
      return setTitle(PluginStrings.setCo2);
    } else if (comType === 'humi') {
      setSendData(comData.humi);
      return setTitle(PluginStrings.setHumi);
    } else if (comType === 'hotWater') {
      setIsBottom(false);
      setBtnTxtList([PluginStrings.hotWaterOff, PluginStrings.hotWaterOn]);
      return setTitle(PluginStrings.setHotWater);
    } else if (comType === 'resetTip') {
      return setTitle(PluginStrings.resetFilter);
    } else if (comType === 'datePicker') {
      return setTitle('');
    } else if (comType === 'error') {
      setIsBottom(false);
      return setTitle('');
    }
  }, []);

  const updateSendData = (value) => {
    setSendData(value);
    if (comType === 'hotWater') {
      confirm(sendData);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay} onStartShouldSetResponder={hide}>
        <Animated.View
          style={[
            styles.modal
          ]}
          onStartShouldSetResponder={(e) => {
            // 阻止点击 modal 内容时触发关闭
            e.stopPropagation();
          }}
        >
          {title.length > 0 && <Text style={styles.title}>{title}</Text>}
          {/* 中间的内容可以自由定制 */}
          {comType === 'co2' && <View style={styles.co2Content} visible={comType === 'co2'}>
            <Co2Com updateData={updateSendData} co2={comData.co2 ?? 0}></Co2Com>
          </View>
          }

          {comType === 'humi' && <View style={styles.humiContent} visible={comType === 'humi'}>
            <HumidityCom updateData={updateSendData} humi={comData.humi ?? 0}></HumidityCom>
          </View>
          }

          {comType === 'hotWater' && <View style={styles.humiContent} visible={comType === 'humi'}>
            {comData.hotWater !== -40 && <HotWaterCom updateData={updateSendData} hotNum={comData.hotWater} setHot={comData.setHotWater} hotWaterState={comData.hotWaterState}></HotWaterCom>}
            {comData.hotWater === -40 && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 223 }}>
              <Image style={{ width: 51.06, height: 45 }} source={require('../../resources/images/no_func_icon.png')}></Image>
            </View>}
          </View>
          }

          {comType === 'resetTip' && <View style={styles.humiContent} visible={comType === 'humi'}>
            <Text style={styles.resetTip}>{PluginStrings.resetFilterTips}</Text>
          </View>
          }

          {comType === 'datePicker' && <View style={styles.DatePickerContent} visible={comType === 'datePicker'}>
            <DatePickerCom updateData={updateSendData} type={comData.type} time={comData.time}></DatePickerCom>
          </View>
          }

          {comType === 'error' && <View style={styles.errorContent} visible={comType === 'datePicker'}>
            <Image
              style={styles.errorIcon}
              source={require('../../resources/images/error_icon.png')}></Image>
            <Text style={styles.errorTitle}>{comData.errorMsg.join('、')}</Text>
            <TouchableOpacity onPress={handleCall}>
              <Text style={styles.errorPhone}>{PluginStrings['A/SHotline']}:4008010113</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={close}>
              <Text style={styles.konwBtn}>{PluginStrings.Iknow}</Text>
            </TouchableOpacity>
          </View>
          }

          {comType === 'hotWater' && <View style={styles.buttons}>
            <TouchableOpacity onPress={close} style={styles.closeBtn}>
              <Text style={styles.closeBtn}>{PluginStrings.Close}</Text>
            </TouchableOpacity>
          </View>}

          {isBottom && <View style={styles.buttons}>
            <TouchableOpacity style={[styles.buttonItem]} onPress={hideOverlay}>
              <Text style={styles.cancelText}>{btnTxtList[0]}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonItem, styles.confirmButton]} onPress={sure}>
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
    flex: 1,
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
    flex: 1,

    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    zIndex: 10
  },
  modal: {
    backgroundColor: "#fff",
    position: 'absolute',
    alignItems: 'center',
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
    // paddingBottom: 28
  },
  title: {
    fontSize: 16,
    height: 62,
    lineHeight: 62,
    fontWeight: 'bold'
  },
  content: {
    alignItems: "center",
    overflow: 'hidden'
  },
  co2Content: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  humiContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
    width: '100%'

  },
  DatePickerContent: {
    // flex: 1
    paddingTop: 10,
    overflow: 'hidden',
    marginBottom: 20
  },
  value: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333"
  },
  unit: {
    fontSize: 16,
    color: "#999"
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 20,
    width: "100%"
  },
  buttonItem: {
    width: 146,
    height: 45,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#F5F5F5'
  },
  cancelText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16
  },
  confirmButton: {
    marginLeft: 13
  },
  confirmText: {
    color: "#447EF2",
    fontWeight: "bold",
    fontSize: 16
  },
  resetTip: {
    color: '#000',
    fontSize: 14,
    lineHeight: 20,
    width: 240,
    textAlign: 'center',
    marginTop: 35,
    marginBottom: 35
  },
  errorContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50

    //    display: 'flex',
  },
  errorIcon: {
    width: 56.5,
    height: 50
  },
  errorTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 15,
    // marginBottom: 35,
    flex: 1
  },
  errorPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 10
  },
  konwBtn: {
    color: '#447EF2',
    fontWeight: 'bold',
    fontSize: 16,
    width: screenWidth - 54,
    borderRadius: 23,
    textAlign: 'center',
    lineHeight: 45,
    height: 45,
    marginTop: 50,
    marginBottom: 35,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden'
  },
  closeBtn: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    width: screenWidth - 54,
    borderRadius: 23,
    textAlign: 'center',
    lineHeight: 45,
    height: 45,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden'
  }
});

export default OverlayPage;

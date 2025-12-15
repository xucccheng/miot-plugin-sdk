import React from 'react';
import { Device, DeviceEvent, Service, DarkMode } from 'miot';
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PluginStrings from '../../resources/strings';
import NavigationBar from 'miot/ui/NavigationBar';

const { width: screenWidth } = Dimensions.get("screen");
/**
 * 自定义智能自动化开发-开发自定义自动化页面
 * 该功能并非插件开发的必须功能，具体详情可参考文档：
 * https://iot.mi.com/new/doc/extension-development/topics/automation-develop
 */

let isDark = false;

export default class ScenePage extends React.Component {

  constructor(props) {
    super(props);
    this.initNavigationBar();
    this.state = {
      index_0_0: '0',
      index_0_1: '0',
      index_0_2: '0',

      index_1_0: '0',
      index_1_1: '0',
      index_1_2: '0',

      index_2_0: '0',
      index_2_1: '0',
      index_2_2: '0',

      index_3_0: '0',
      index_3_1: '0',
      index_3_2: '0',

      index_4_0: '0',
      index_4_1: '0',
      index_4_2: '0',

      index_5_0: '0',
      index_5_1: '0',
      index_5_2: '0',

      index_6_0: '0',
      index_6_1: '0',
      index_6_2: '0',

      index_7_0: '1',
      index_7_1: '0',
      index_7_2: '0',

      index_8_0: '2',
      index_8_1: '0',
      index_8_2: '0',

      queryData: [
        // 室内温度
        { did: Device.deviceID, siid: 4, piid: 1 },
        // 室内湿度
        { did: Device.deviceID, siid: 4, piid: 2 },
        // 温度校准
        { did: Device.deviceID, siid: 6, piid: 14 },
        // 湿度校准
        { did: Device.deviceID, siid: 6, piid: 15 },
        // 低档送风电机转速
        { did: Device.deviceID, siid: 7, piid: 5 },
        // 中档送风电机转速
        { did: Device.deviceID, siid: 7, piid: 6 },
        // 高档送风电机转速
        { did: Device.deviceID, siid: 7, piid: 7 },
        // 低档新风电机转速
        { did: Device.deviceID, siid: 7, piid: 8 },
        // 中档新风电机转速
        { did: Device.deviceID, siid: 7, piid: 9 },
        // 高档新风电机转速
        { did: Device.deviceID, siid: 7, piid: 10 },
        // 低档排风电机转速
        { did: Device.deviceID, siid: 7, piid: 11 },
        // 中档排风电机转速
        { did: Device.deviceID, siid: 7, piid: 12 },
        // 高档排风电机转速
        { did: Device.deviceID, siid: 7, piid: 13 },
        // 低档室外电机转速
        { did: Device.deviceID, siid: 7, piid: 14 },
        // 中档室外电机转速
        { did: Device.deviceID, siid: 7, piid: 15 },
        // 高档室外电机转速
        { did: Device.deviceID, siid: 7, piid: 16 },
        // 低循环风角度
        { did: Device.deviceID, siid: 7, piid: 17 },
        // 中循环风角度
        { did: Device.deviceID, siid: 7, piid: 18 },
        // 高循环风角度
        { did: Device.deviceID, siid: 7, piid: 19 }

      ],
      acceptData: {},
      isSendData: false,
      parseDataTimer: null
    };
  }

  get parameteProps() {
    return [{
      title: `${ PluginStrings.professional1 }(rpm)`,
      subTitles: [`${ PluginStrings.lowSpeed }`, `${ PluginStrings.mediumSpeed }`, `${ PluginStrings.highSpeed }`],
      isInteger: true,
      Limits_0: [0, 3000],
      Limits_1: [0, 3000],
      Limits_2: [0, 3000],
      isEdit: [true, true, true]
    }, {
      title: `${ PluginStrings.professional2 }(rpm)`,
      subTitles: [`${ PluginStrings.lowSpeed }`, `${ PluginStrings.mediumSpeed }`, `${ PluginStrings.highSpeed }`],
      isInteger: true,
      Limits_0: [0, 3000],
      Limits_1: [0, 3000],
      Limits_2: [0, 3000],
      isEdit: [true, true, true]
    }, {
      title: `${ PluginStrings.professional3 }(rpm)`,
      subTitles: [`${ PluginStrings.lowSpeed }`, `${ PluginStrings.mediumSpeed }`, `${ PluginStrings.highSpeed }`],
      isInteger: true,
      Limits_0: [0, 3000],
      Limits_1: [0, 3000],
      Limits_2: [0, 3000],
      isEdit: [true, true, true]
    }, {
      title: `${ PluginStrings.professional4 }(rpm)`,
      subTitles: [`${ PluginStrings.lowSpeed }`, `${ PluginStrings.mediumSpeed }`, `${ PluginStrings.highSpeed }`],
      isInteger: true,
      Limits_0: [0, 3000],
      Limits_1: [0, 3000],
      Limits_2: [0, 3000],
      isEdit: [true, true, true]
    }, {
      title: `${ PluginStrings.professional5 }(°)`,
      subTitles: [`${ PluginStrings.lowSpeed }`, `${ PluginStrings.mediumSpeed }`, `${ PluginStrings.highSpeed }`],
      isInteger: true,
      Limits_0: [0, 90],
      Limits_1: [0, 90],
      Limits_2: [0, 90],
      isEdit: [true, true, true]
    }, {
      title: `${ PluginStrings.professional6 }`,
      subTitles: [`${ PluginStrings.currentValue }(℃)`, `${ PluginStrings.corrected }(℃)`, `${ PluginStrings.correctionFactor }`],
      // unitList: ['℃', '℃', ''],
      isEdit: [false, false, true],
      isInteger: false,
      Limits_2: [-5, 5]
    }, {
      title: `${ PluginStrings.professional7 }`,
      subTitles: [`${ PluginStrings.currentValue }(%)`, `${ PluginStrings.corrected }(%)`, `${ PluginStrings.correctionFactor }`],
      isEdit: [false, false, true],
      // 是否是整数
      isInteger: true,
      // unitList: ['%', '%', ''],
      Limits_2: [-15, 15]
    }];
  }

  componentWillUnmount() {
    this.removeListener();
  }

  removeListener() {
    this.mDarkModeListener && DarkMode.removeChangeListener(this.mDarkModeListener);
    // 取消监听 隐私权限
    this.mPackageAuthorizationAgreed && this.mPackageAuthorizationAgreed.remove();
    // 取消订阅
    this.mSubcription && this.mSubcription.remove();
    // 取消监听
    this.mDeviceReceivedMessages && this.mDeviceReceivedMessages.remove();

    this._deviceNameChangedListener && this._deviceNameChangedListener.remove();
  }

  UNSAFE_componentWillMount() {
    // this.addListener();
    console.log('DarkMode.getColorScheme()', DarkMode.getColorScheme());
    isDark = DarkMode.getColorScheme() === 'dark' ? true : false;
    this.getDevicePropsValue();
    this.mDarkModeListener = DarkMode.addChangeListener((object) => {
      console.log(object);
      if (object.colorScheme) {
        isDark = object.colorScheme === 'dark' ? true : false;
      }
    });
  }

  initNavigationBar() {
    this.props.navigation.setParams({
      titleProps: {
        backgroundColor: '#F7F7F7',
        title: PluginStrings.parameterSettings,
        left: [
          {
            key: NavigationBar.ICON.BACK,
            onPress: () => {
              this.props.navigation.goBack();
              // navigation.goBack();
            }
          }
        ]
      }
    });
  }

  addListener() {
    let subscribeData = [];
    for (let i in this.state.queryData) {
      let item = this.state.queryData[i];
      subscribeData.push(`prop.${ item.siid }.${ item.piid }`);
    }

    console.log(subscribeData);

    Device.getDeviceWifi().subscribeMessages(...subscribeData).then((subcription) => {
      console.log('subscribeMessages success', subcription);
      this.mSubcription = subcription;
    }).catch((error) => {
      console.log('subscribeMessages error', error);
    });

    let that = this;
    this.mDeviceReceivedMessages = DeviceEvent.deviceReceivedMessages.addListener(
      (device, map, data) => {
        clearTimeout(that.state.parseDataTimer);
        console.log('deviceReceivedMessages', data);
        for (let i in data) {
          let item = data[i];
          let key = item.key.replace("prop.", '');
          let iData = item.value;
          let i_d = iData[0];
          that.setState((state) => {
            state.acceptData[key] = i_d;
          });
        }

        let time = that.state.isSendData ? 300 : 0;
        let timer = setTimeout(() => {
          for (let i in that.state.acceptData) {
            let key = i;
            let i_d = that.state.acceptData[key];
            that.parseData(key, i_d);
          }
          that.setState((state) => {
            state.acceptData = {};
            state.isSendData = false;
          });
          that.forceUpdate();

        }, time);

        that.setState((state) => {
          state.parseDataTimer = timer;
        });

      });
  }

  getDevicePropsValue() {

    /**
                                         * 这里的 siid 和 piid 的获取，可以通过解析 getSpecString 获取的spec信息， 也可以通过开发者平台上查询该设备对应的设备属性 siid 和 piid值
                                         */
    let params = this.state.queryData;
    //  'prop.6.1', 'prop.7.1', 'prop.7.2'
    Service.spec.getPropertiesValue(params).then((res) => {
      console.log('getPropertiesValue', res);
      for (let i in res) {
        let item = res[i];
        let key = `${ item.siid }.${ item.piid }`;
        let iData = item.value;
        this.parseData(key, iData);
      }
      this.forceUpdate();
    }).catch((error) => {
      console.log('getPropertiesValue error ', error);
    });
    this.forceUpdate();
  }

    parseData = (key, iData) => {
      // if (iData) {
      console.log('``', key, iData);
      iData = iData ?? 0;
      switch (key) {
        case '4.1':
          this.setState({
            // 室内温度
            index_5_0: iData
          });
          break;
        case '4.2':
          this.setState({
            // 室内湿度
            index_6_0: iData
          });
          break;
        case '6.14':
          this.setState((state) => {

            // 温度校准
            let num = this.parseByteToValue(iData) / 10;
            state.index_5_1 = this.formatNumber(state.index_5_0 + num);
            state.index_5_2 = num;
          });
          break;
        case '6.15':
          this.setState((state) => {
            let num = this.parseByteToValue(iData);
            state.index_6_1 = this.formatNumber(state.index_6_0 + num);
            // 温度校准
            state.index_6_2 = num;
          });
          break;
          // 开关
        case '7.5':
          this.setState({
            index_0_0: iData
          });
          break;
        case '7.6':
          this.setState({
            index_0_1: iData
          });
          break;
        case '7.7':
          this.setState({
            index_0_2: iData
          });
          break;
        case '7.8':
          this.setState({
            index_1_0: iData
          });
          break;
        case '7.9':
          this.setState({
            index_1_1: iData
          });
          break;
        case '7.10':
          this.setState({
            index_1_2: iData
          });
          break;
        case '7.11':
          this.setState({
            index_2_0: iData
          });
          break;
        case '7.12':
          this.setState({
            index_2_1: iData
          });
          break;
        case '7.13':
          this.setState({
            index_2_2: iData
          });
          break;
        case '7.14':
          this.setState({
            index_3_0: iData
          });
          break;
        case '7.15':
          this.setState({
            index_3_1: iData
          });
          break;
        case '7.16':
          this.setState({
            index_3_2: iData
          });
          break;
        case '7.17':
          this.setState({
            index_4_0: iData
          });
          break;
        case '7.18':
          this.setState({
            index_4_1: iData
          });
          break;
        case '7.19':
          this.setState({
            index_4_2: iData
          });
          break;
      }
      // }
    };

    formatNumber(value) {
      const num = parseFloat(value); // 转换为数字
      if (!num || isNaN(num)) {
        return "--";
      }
      return Number.isInteger(num) ? num : num.toFixed(1);
      // return Number.isInteger(num) ? num : num.toFixed(1);
    }

    handleChange = (text, index) => {
      let f_index = index.split('_')[0];
      let s_index = index.split('_')[1];

      let limits = this.parameteProps[f_index][`Limits_${ s_index }`] ?? null;
      if (limits) {
        let min = limits[0];
        let max = limits[1];
        if (text < min) {
          text = min;
        } else if (text > max) {
          text = max;
        }
      }

      console.log('handleChange', text, (`${ text }`).startsWith('-'));
      // 判断第一位是否是负号
      if (text === '') {
        // 如果是空字符串，则不处理
        text = '';
      } else if (((`${ text }`).startsWith('-') && text.length === 1)) {
        // 如果是负号，则不处理
        text = '-';
      } else {
        // if (text.startsWith('-')) {
        // 如果是整数，则转换为整数
        if (this.parameteProps[f_index].isInteger) {
          text = this.inputValid(text, f_index, s_index);
          text = parseInt(text, 10);
        } else {
          // console.log('不是整数', text, text.indexOf('.'));

          // 判断是否是小数
          if ((`${ text }`).indexOf('.') === -1) {
            // 如果不是小数，则转换为整数
            // text = this.inputValid(text, f_index, s_index);
            text = parseInt(text);
          } else {

            console.log('小数', text, text.indexOf('.'));
            // 如果超过两位小数则保留一位
            if (text.endsWith('.')) {

            } else {
              // 判断是否有小数
              if (text.indexOf('.') !== -1) {
                text = text.length > 2 ? parseFloat(text).toFixed(1) : text;
              }
            }
          }
        }
      }

      this.setState({
        [`index_${ f_index }_${ s_index }`]: text
      });
    };

    inputValid = (text = '', f_index, s_index) => {
      let t = text ?? ''.replace(/\s+/g, '');
      let num = parseFloat(t);
      if (isNaN(num)) {
        return 0; // 不是数字
      }
      let limits = this.parameteProps[f_index][`Limits_${ s_index }`] ?? null;
      if (limits) {
        let min = limits[0];
        let max = limits[1];
        if (num < min) {
          num = min;
        } else if (num > max) {
          num = max;
        }
      }
      return num;
    };

    convertToBytes = (value) => {
      value = value * 10; // 乘以10
      // 判断符号位，负数则为1，正数为0
      let signBit = value < 0 ? 1 : 0;

      // 获取绝对值并限制在0~127范围内
      let absValue = Math.abs(value) & 0x7F; // 保证在 0~127 之间

      // 拼接符号位和数值
      let byteValue = (signBit << 7) | absValue; // 合并符号位和数值部分

      return byteValue;
    };

    parseByteToValue(byte) {
      // 获取符号位 (bit7)
      let signBit = (byte & 0x80) >> 7; // 最高位 (bit7)

      // 获取数值部分 (bit6-0)
      let value = byte & 0x7F; // 低7位 (bit6-0)

      // 根据符号位判断是负数还是正数
      if (signBit === 1) {
        value = -value; // 如果符号位为1，则是负数
      }

      return value;
    }


    sendProfessionalData = () => {
      // let tempNum = index_5_2;
      // console.log(this.convertToBytes(-20));
      // tempNum = tempNum < 0 ? 256 + tempNum : tempNum;
      let tempCalibration = this.convertToBytes(this.state.index_5_2);
      let humiCalibration = this.convertToBytes(this.state.index_6_2 / 10);
      console.log('humiCalibration', humiCalibration);
      let params = [
        { did: Device.deviceID, siid: 7, piid: 5, value: parseInt(this.state.index_0_0) },
        { did: Device.deviceID, siid: 7, piid: 6, value: parseInt(this.state.index_0_1) },
        { did: Device.deviceID, siid: 7, piid: 7, value: parseInt(this.state.index_0_2) },
        { did: Device.deviceID, siid: 7, piid: 8, value: parseInt(this.state.index_1_0) },
        { did: Device.deviceID, siid: 7, piid: 9, value: parseInt(this.state.index_1_1) },
        { did: Device.deviceID, siid: 7, piid: 10, value: parseInt(this.state.index_1_2) },
        { did: Device.deviceID, siid: 7, piid: 11, value: parseInt(this.state.index_2_0) }

      ];
      this.setPropertiesValue(params);
      let params1 = [
        { did: Device.deviceID, siid: 7, piid: 12, value: parseInt(this.state.index_2_1) },
        { did: Device.deviceID, siid: 7, piid: 13, value: parseInt(this.state.index_2_2) },
        { did: Device.deviceID, siid: 7, piid: 14, value: parseInt(this.state.index_3_0) },
        { did: Device.deviceID, siid: 7, piid: 15, value: parseInt(this.state.index_3_1) },
        { did: Device.deviceID, siid: 7, piid: 16, value: parseInt(this.state.index_3_2) },
        { did: Device.deviceID, siid: 7, piid: 17, value: parseInt(this.state.index_4_0) },
        { did: Device.deviceID, siid: 7, piid: 18, value: parseInt(this.state.index_4_1) },
        { did: Device.deviceID, siid: 7, piid: 19, value: parseInt(this.state.index_4_2) },

        { did: Device.deviceID, siid: 6, piid: 14, value: tempCalibration },
        { did: Device.deviceID, siid: 6, piid: 15, value: humiCalibration }
      ];
      console.log('params1', params1);
      let that = this;
      setTimeout(function() {
        that.setPropertiesValue(params1);
      }, 500);
      // this.props.navigation.goBack();
    };

    setPropertiesValue(params) {
      console.log('setPropertiesValue', params);
      Service.spec.setPropertiesValue(params).then((res) => {
        console.log('setPropertiesValue success ', res);
        this.setState(() => ({
          isSendData: true
        }));

      }).catch((error) => {
        console.log('setPropertiesValue error ', error);
      });
    }

    render() {
      return (
        <View style={styles.container}>
          <ScrollView style={{ flex: 1, marginBottom: 86 }} onMomentumScrollEnd={() => {
          }}>
            <View style={styles.wrapper}>
              {
                this.parameteProps.map((item, index) => (
                  <View key={`paramete_${ index }`} style={styles.parameContent}>
                    <View>
                      <Text style={styles.title}>{item.title}</Text>
                      <View style={styles.speedContainer}>
                        <View style={styles.speedItem}>
                          <Text style={styles.speedItemTitle}>{item.subTitles[0]}</Text>
                          <TextInput editable={item.isEdit[0]} style={[styles.speedItemInput, { color: isDark ? 'xmrgba(255, 255, 255, .8)' : 'rgba(165, 165, 165, 1)' }]}
                            value={`${ this.state[`index_${ index }_0`] }`}
                            onChangeText={(text) => this.handleChange(text, `${ index }_0`)} />
                          {/* <Text>{item.unitList && item.unitList.length > 0 ? item.unitList[0] : ''}</Text> */}
                        </View>
                        <View style={styles.speedItem}>
                          <Text style={styles.speedItemTitle}>{item.subTitles[1]}</Text>
                          <TextInput editable={item.isEdit[1]} style={[styles.speedItemInput, { color: isDark ? 'xmrgba(255, 255, 255, .8)' : 'rgba(165, 165, 165, 1)' }]}
                            value={`${ this.state[`index_${ index }_1`] }`}
                            onChangeText={(text) => this.handleChange(text, `${ index }_1`)} />
                          {/* <Text>{item.unitList && item.unitList.length > 0 ? item.unitList[1] : ''}</Text> */}
                        </View>
                        <View style={styles.speedItem}>
                          <Text style={styles.speedItemTitle}>{item.subTitles[2]}</Text>
                          <TextInput editable={item.isEdit[2]} style={[styles.speedItemInput, { color: isDark ? 'xmrgba(255, 255, 255, .8)' : 'rgba(165, 165, 165, 1)' }]}
                            onEndEditing={() => {
                              console.log('...');
                              if (index === 5) {
                                console.log('温度校准');
                                let num = this.inputValid(this.state[`index_5_2`], 5, 2);
                                this.setState({
                                  index_5_1: this.formatNumber(parseFloat(this.state['index_5_0']) + parseFloat(num)),
                                  index_5_2: num
                                });
                              } else if (index === 6) {
                                console.log('湿度校准');
                                let num = this.inputValid(this.state[`index_6_2`], 6, 2);
                                this.setState({
                                  index_6_1: this.formatNumber(parseFloat(this.state['index_6_0']) + parseFloat(num)),
                                  index_6_2: num
                                });
                              }
                            }}
                            onChangeText={(text) => this.handleChange(text, `${ index }_2`)}
                            value={`${ this.state[`index_${ index }_2`] }`} />
                          {/* <Text>{item.unitList && item.unitList.length > 0 ? item.unitList[2] : ''}</Text> */}
                        </View>
                      </View>
                    </View>
                  </View>
                ))
              }
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity style={[styles.buttonItem]} onPress={this.sendProfessionalData}>
              <Text style={styles.saveText}>{PluginStrings.save}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    flex: 1
  },
  wrapper: {
    paddingBottom: 12
  },
  parameContent: {
    backgroundColor: '#Fff',
    borderRadius: 12,
    width: screenWidth - 24,
    marginLeft: 12,
    marginTop: 12,
    overflow: 'hidden',
    paddingBottom: 25,
    flexDirection: 'column',
    paddingTop: 17
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000'
  },
  speedContainer: {
    marginTop: 25,
    flexDirection: 'row'
  },
  speedItem: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column'
  },
  speedItemTitle: {
    fontSize: 13,
    color: '#000',
    marginBottom: 10
  },
  speedItemInput: {
    borderRadius: 6,
    color: '#A5A5A5',
    width: 85,
    height: 36,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    paddingVertical: 0
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 86,
    backgroundColor: '#fff',
    alignItems: 'center'
    // justifyContent: 'center'
  },
  buttonItem: {
    width: '80%',
    height: 45,
    backgroundColor: '#447EF2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 23,
    marginTop: 13
  },
  saveText: {
    fontSize: 16,
    color: '#fff'
  }
});

import React from 'react';
import { Device, DeviceEvent, Package, PackageEvent, Service } from 'miot';
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import NavigationBar from 'miot/ui/NavigationBar';
import Separator from 'miot/ui/Separator';

/**
 * SDK 提供的多语言 和 插件提供的多语言
 */
import { strings as SdkStrings, Styles as SdkStyles } from 'miot/resources';
import PluginStrings from '../resources/strings';
/**
 * SDK 支持的字体
 */
import { ListItemWithSlider, ListItemWithSwitch } from 'mhui-rn';

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const { width } = Dimensions.get('window');

/**
 * wifi 类型设备通用模板， 提供了设备属性获取及订阅相关功能， 开发者在进行实现设备属性订阅相关功能时，需要修改相关参数
 */
export default class MainPage extends React.Component {

  constructor(props) {
    super(props);

    // this.initNavigationBar();
    this.state = {

      light: false,
      swing: false,
      brightness: 35,
      puMode: 0,
      temp: 30,
      defecation: false,
      washing: false,
      power: false,
      isSendData: false,
      parseDataTimer: null,
      acceptData: {},
      modes: [
        {
          description: PluginStrings.waterfall,
          icon: {
            normal: require('../resources/images/pb.png'),
            press: require('../resources/images/pb-press.png'),
            active: require('../resources/images/pb-active.png'),
            activeDisabled: require('../resources/images/pb-activeDisabled.png')
          },
          // isDisabled: true,
          isActive: false,
          isPressing: false
        },
        {
          description: PluginStrings.hotSpring,
          icon: {
            normal: require('../resources/images/wq.png'),
            press: require('../resources/images/wq-press.png'),
            active: require('../resources/images/wq-active.png'),
            activeDisabled: require('../resources/images/wq-activeDisabled.png')
          },
          // isDisabled: true,
          isActive: false,
          isPressing: false
        }, {
          description: PluginStrings.baby,
          icon: {
            normal: require('../resources/images/baobao.png'),
            press: require('../resources/images/baobao-press.png'),
            active: require('../resources/images/baobao-active.png'),
            activeDisabled: require('../resources/images/baobao-activeDisabled.png')
          },
          // isDisabled: true,
          isActive: false,
          isPressing: false
        }
      ],
      modes1: [{
        description: PluginStrings.smartWashing,
        icon: {
          normal: require('../resources/images/xs.png'),
          press: require('../resources/images/xs-press.png'),
          active: require('../resources/images/xs-active.png'),
          activeDisabled: require('../resources/images/xs-activeDisabled.png')
        },
        // isDisabled: true,
        isActive: false,
        isPressing: false
      }, {
        description: PluginStrings.defecation,
        icon: {
          normal: require('../resources/images/rc.png'),
          press: require('../resources/images/rc-press.png'),
          active: require('../resources/images/rc-active.png'),
          activeDisabled: require('../resources/images/rc-activeDisabled.png')
        },
        // isDisabled: true,
        isActive: false,
        isPressing: false
      }, {
        description: PluginStrings.ion,
        icon: {
          normal: require('../resources/images/lz.png'),
          press: require('../resources/images/lz-press.png'),
          active: require('../resources/images/lz-active.png'),
          activeDisabled: require('../resources/images/lz-activeDisabled.png')
        },
        // isDisabled: true,
        isActive: false,
        isPressing: false
      }],
      modes2: [{
        description: PluginStrings.AI,
        icon: {
          normal: require('../resources/images/AI.png'),
          press: require('../resources/images/AI-press.png'),
          active: require('../resources/images/AI-active.png'),
          activeDisabled: require('../resources/images/AI-activeDisabled.png')
        },
        // isDisabled: true,
        isActive: false,
        isPressing: false
      }, {
        description: PluginStrings.sterilize,
        icon: {
          normal: require('../resources/images/kj.png'),
          press: require('../resources/images/kj-press.png'),
          active: require('../resources/images/kj-active.png'),
          activeDisabled: require('../resources/images/kj-activeDisabled.png')
        },
        // isDisabled: true,
        isActive: false,
        isPressing: false
      }, {
        description: PluginStrings.standbyMode,
        icon: {
          normal: require('../resources/images/dj.png'),
          press: require('../resources/images/dj-press.png'),
          active: require('../resources/images/dj-active.png'),
          activeDisabled: require('../resources/images/dj-activeDisabled.png')
        },
        // isDisabled: true,
        isActive: false,
        isPressing: false
      }]
    };

    // this.addListener();

  }

    /**
     * 页面内部自定义Header
     * @param navigation
     * @returns {{header: *}|{header: null}}
     */
    static navigationOptions = ({ navigation }) => {
      const { titleProps } = navigation.state.params || {};
      console.log('titleProps', titleProps);
      if (!titleProps) return { header: null };
      return {
        header: <NavigationBar {...titleProps} />
      };
    };

    componentDidMount() {

      //   this.getDevicePropsValue();
    }

    pressInDemo = (index, key) => {
      this.setState((state) => {
        let modes = state[key];
        modes[index].isPressing = true;
        return { [key]: modes };
      });
    };

    pressOutDemo = (index, key) => {
      this.setState((state) => {
        let modes = state[key];
        let theMode = modes[index];
        theMode.isPressing = false;
      });
    };

    clearAllPressing = () => {
      this.setState((state) => {
        let modes = state['modes'];
        state.modes.forEach((mode) => {
          mode.isPressing = false;
        });
        return { modes: modes };
      });


      this.setState((state) => {
        let modes = state['modes1'];
        state.modes.forEach((mode) => {
          mode.isPressing = false;
        });
        return { modes1: modes };
      });
      this.setState((state) => {

        state.modes2.forEach((mode) => {
          mode.isPressing = false;
        });
        return { modes2: state.modes2 };
      });
      this.forceUpdate();
    };

    // 手指抬起模式
    pressDemo = (index, key) => {
      this.setState((state) => {
        let modes = state[key];
        let theMode = modes[index];

        theMode.isPressing = false;

        if (theMode.isDisabled) {
          // 该模式不可点或已高亮
          return;
        }
        if (theMode.isActive) {
          theMode.isActive = false;
        } else {
          // 正常模式
          state.modes.forEach((mode) => {
            mode.isActive = false;
          });
          state.modes1.forEach((mode) => {
            mode.isActive = false;
          });
          state.modes2.forEach((mode) => {
            mode.isActive = false;
          });

          theMode.isActive = true;
        }
        let params = [];

        if (key === 'modes') {
          if (index === 0) {
            params = [
              { did: Device.deviceID, siid: 4, piid: 2, value: theMode.isActive ? 1 : 0 }
            ];
          } else if (index === 1) {
            params = [
              { did: Device.deviceID, siid: 4, piid: 2, value: theMode.isActive ? 2 : 0 }
            ];
          } else if (index === 2) {
            params = [
              { did: Device.deviceID, siid: 4, piid: 2, value: theMode.isActive ? 3 : 0 }
            ];
          }
        } else if (key === 'modes1') {
          if (index === 0) {
            params = [
              { did: Device.deviceID, siid: 4, piid: 2, value: theMode.isActive ? 8 : 0 }
            ];
            if (!theMode.isActive) {
              this.changeMode('modes2', 2);
            }
          } else if (index === 1) {
            params = [
              { did: Device.deviceID, siid: 4, piid: 2, value: theMode.isActive ? 7 : 0 }
            ];
            if (!theMode.isActive) {
              this.changeMode('modes2', 2);
            }
          } else if (index === 2) {
            params = [
              { did: Device.deviceID, siid: 4, piid: 2, value: theMode.isActive ? 4 : 0 }
            ];
          }
        } else if (key === 'modes2') {
          if (index === 0) {
            params = [
              { did: Device.deviceID, siid: 4, piid: 2, value: theMode.isActive ? 5 : 0 }
            ];
          } else if (index === 1) {
            params = [
              { did: Device.deviceID, siid: 4, piid: 2, value: theMode.isActive ? 6 : 0 }
            ];
          } else if (index === 2) {
            if (theMode.isActive) {
              params = [
                { did: Device.deviceID, siid: 4, piid: 2, value: 0 }
              ];
            } else {
              params = [
                { did: Device.deviceID, siid: 6, piid: 1, value: 1 }
              ];
              this.changeMode('modes', 1);
            }
          }
        }
        let siid = params[0].siid;
        let piid = params[0].piid;
        if (siid === 4 && piid === 2) {
          state['puMode'] = params[0].value;
        }

        this.setPropertiesValue(params);
        return { [key]: modes };
      });
    };

    initNavigationBar() {
      this.props.navigation.setParams({
        titleProps: {
          backgroundColor: 'transparent',
          title: Device.name,
          left: [
            {
              key: NavigationBar.ICON.BACK,
              onPress: () => {
                Package.exit();
              }
            }
          ],
          right: [
            {
              key: NavigationBar.ICON.MORE,
              onPress: () => {
                // 跳转到设置页
                this.props.navigation.navigate('SettingPage', { title: SdkStrings.setting });
              }
            }
          ]
        }
      });
    }

    UNSAFE_componentWillMount() {
      this.addListener();
      this.getDevicePropsValue();
    }

    addListener() {

      this.mPackageAuthorizationAgreed = PackageEvent.packageAuthorizationAgreed.addListener(() => {
        // 隐私弹窗-用户点击同意
        console.log('user agree protocol...');
      });

      /**
             * 对设备属性进行订阅
             * prop.属性名, profile 设备这样进行传参   eg: prop.power
             * prop.siid.piid， spec协议设备这样进行传参  eg: prop.2.1
             */
      Device.getDeviceWifi().subscribeMessages('prop.2.1', 'prop.2.3', 'prop.4.2', 'prop.4.9', 'prop.5.3', 'prop.6.1').then((subcription) => {
        this.mSubcription = subcription;
        // console.log('subscribeMessages this.mSubcription', this.mSubcription);
      }).catch((error) => {
        console.log('subscribeMessages error', error);
      });

      // 监听设备属性发生变化事件； 当设备属性发生改变，会发送事件到js，此处会收到监听回调
      this.mDeviceReceivedMessages = DeviceEvent.deviceReceivedMessages.addListener(
        (device, map, data) => {
          // console.log('Device.addListener', device, data);
          // console.log('map', map, 'data', data);

          clearTimeout(this.state.parseDataTimer);
          for (let i in data) {
            let item = data[i];
            let key = item.key.replace("prop.", '');
            let iData = item.value;
            let i_d = iData[0];
            this.setState((state) => {
              state.acceptData[key] = i_d;
            });
          }


          let that = this;
          let time = this.state.isSendData ? 3000 : 0;
          let timer = setTimeout(() => {
            for (let i in that.state.acceptData) {
              let key = i;
              let i_d = that.state.acceptData[key];
              switch (key) {
                case '2.1':
                  that.setState({
                    light: i_d
                  });
                  break;
                case '2.3':
                  that.setState({
                    brightness: i_d
                  });
                  break;
                case '4.2':

                  that.setState({
                    puMode: i_d
                  });
                  if (i_d === 0) {
                    that.changeMode('modes2', 2);
                  } else if (i_d === 1) {
                    that.changeMode('modes', 0);
                  } else if (i_d === 2) {
                    that.changeMode('modes', 1);
                  } else if (i_d === 3) {
                    that.changeMode('modes', 2);
                  } else if (i_d === 4) {
                    that.changeMode('modes1', 2);
                  } else if (i_d === 5) {
                    that.changeMode('modes2', 0);
                  } else if (i_d === 6) {
                    that.changeMode('modes2', 1);
                  } else if (i_d === 7) {
                    that.changeMode('modes1', 1);
                  } else if (i_d === 8) {
                    that.changeMode('modes1', 0);
                  }
                  break;
                case '4.9':
                  that.setState({
                    temp: i_d
                  });
                  break;
                case '5.3':
                  that.setState({
                    swing: i_d
                  });
                  break;
                case '6.1':
                  if (!i_d) {
                    that.changeMode('modes2', 2);
                  }
                  that.setState({
                    power: i_d
                  });
                  break;
                case '7.1':
                  that.setState({
                    defecation: i_d
                  });
                  if (i_d) {
                    that.changeMode('modes1', 1);
                  }
                  break;
                case '7.2':
                  that.setState({
                    washing: i_d
                  });
                  if (i_d) {
                    that.changeMode('modes1', 0);
                  }
                  break;
              }
            }
            that.setState((state) => {
              state.acceptData = {};
              state.isSendData = false;
            });
            that.forceUpdate();

          }, time);

          this.setState((state) => {
            state.parseDataTimer = timer;
          });

        });

      this._deviceNameChangedListener = DeviceEvent.deviceNameChanged.addListener((device) => {
        this.props.navigation.setParams({
          name: device.name
        });
        this.forceUpdate();
      });
    }

    removeListener() {
      // 取消监听 隐私权限
      this.mPackageAuthorizationAgreed && this.mPackageAuthorizationAgreed.remove();
      // 取消订阅
      this.mSubcription && this.mSubcription.remove();
      // 取消监听
      this.mDeviceReceivedMessages && this.mDeviceReceivedMessages.remove();

      this._deviceNameChangedListener && this._deviceNameChangedListener.remove();
    }

    changeMode(key, index) {
      this.setState((state) => {
        state.modes.forEach((mode) => {
          mode.isActive = false;
        });
        state.modes1.forEach((mode) => {
          mode.isActive = false;
        });
        state.modes2.forEach((mode) => {
          mode.isActive = false;
        });
        let modes = state[key];
        let theMode = modes[index];
        theMode.isActive = true;
      });
    }

    disabledModeFunc() {
      return (this.state.puMode === 0) || this.state.puMode === 4 || this.state.puMode === 5 || this.state.puMode === 6;
    }


    render() {
      let { modes, modes1, modes2 } = this.state;
      return (
        <View style={styles.container}>
          <ImageBackground style={styles.bg} resizeMode="cover"
            source={require('../resources/images/bg_icon.png')}>
            <NavigationBar
              backgroundColor={'transparent'}
              title={Device.name}
              left={[
                {
                  key: NavigationBar.ICON.BACK,
                  onPress: () => {
                    Package.exit();
                  }
                }
              ]}
              right={[
                {
                  key: NavigationBar.ICON.MORE,
                  onPress: () => {
                    // 跳转到设置页
                    this.props.navigation.navigate('SettingPage', { title: SdkStrings.setting });
                  }
                }
              ]}
            ></NavigationBar>
            <ScrollView style={{ flex: 1, marginBottom: 20 }} onMomentumScrollEnd={() => {
              this.clearAllPressing();
            }}>
              <View style={[styles.topBg, { height: 389 }]}>
                <Image
                  resizeMode="contain"
                  style={styles.puImg}
                  source={require('../resources/images/pu_icon.png')}>
                </Image>
              </View>
              <View
                style={[styles.modeContainer, { marginTop: -90, borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingBottom: -1 }]}>
                {this.state.modes.map((element, index) => (
                  <TouchableWithoutFeedback
                    onPressIn={() => {
                      this.pressInDemo(index, 'modes');
                    }}
                    onPressOut={() => {
                      this.pressOutDemo(index, 'modes');
                    }}
                    onPress={() => {
                      this.pressDemo(index, 'modes');
                    }}
                    key={index}
                  >
                    <View style={styles.modeItem}>
                      <Image resizeMode="contain" style={styles.modeItemImg}
                        source={element.isActive ? element.icon.active : element.isPressing ? element.icon.press : element.icon.normal}></Image>
                      <Text
                        style={[styles.modeItemText, element.isActive && styles.modeItemActiveText]}>{element.description}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                ))}
              </View>
              <View style={styles.modeContainer}>
                {this.state.modes1.map((element, index) => (
                  <TouchableWithoutFeedback
                    onPressIn={() => {
                      this.pressInDemo(index, 'modes1');
                    }}
                    onPressOut={() => {
                      this.pressOutDemo(index, 'modes1');
                    }}
                    onPress={() => {
                      this.pressDemo(index, 'modes1');
                    }}
                    key={index}
                  >
                    <View style={styles.modeItem}>
                      <Image resizeMode="contain" style={styles.modeItemImg}
                        source={element.isActive ? element.icon.active : element.isPressing ? element.icon.press : element.icon.normal}></Image>
                      <Text
                        style={[styles.modeItemText, element.isActive && styles.modeItemActiveText]}>{element.description}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                ))}
              </View>
              <View style={[styles.modeContainer, { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }]}>
                {this.state.modes2.map((element, index) => (
                  <TouchableWithoutFeedback
                    onPressIn={() => {
                      this.pressInDemo(index, 'modes2');
                    }}
                    onMoveShouldSetResponder={() => {
                      this.pressOutDemo(index, 'modes2');
                    }}
                    onPress={() => {
                      this.pressDemo(index, 'modes2');
                    }}
                    key={index}
                  >
                    <View style={styles.modeItem}>
                      <Image resizeMode="contain" style={styles.modeItemImg}
                        source={element.isActive ? element.icon.active : element.isPressing ? element.icon.press : element.icon.normal}></Image>
                      <Text
                        style={[styles.modeItemText, element.isActive && styles.modeItemActiveText]}>{element.description}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                ))}
              </View>
              <View style={styles.listCardContainer}>
                <ListItemWithSwitch
                  title={PluginStrings.lighting}
                  subtitle={this.state.light ? PluginStrings.switchOn : PluginStrings.switchOff}
                  onPress={(_) => console.log('do what u want to do')}
                  onValueChange={(value) => this.setLightSwitch()}
                  // separator={<Separator />}
                  value={this.state.light}
                  showSeparator={false}
                  onTintColor={'#16B7FF'}
                  containerStyle={{ width: (screenWidth - 36) / 2, borderRadius: 12 }}
                />

                <ListItemWithSwitch
                  disabled={this.disabledModeFunc()}
                  title={PluginStrings.swing}
                  subtitle={this.state.swing ? PluginStrings.switchOn : PluginStrings.switchOff}
                  onPress={(_) => console.log('do what u want to do')}
                  onValueChange={(value) => this.setSwingSwitch()}
                  // separator={<Separator />}
                  value={this.state.swing}
                  showSeparator={false}
                  onTintColor={'#16B7FF'}
                  containerStyle={[{
                    width: (screenWidth - 36) / 2,
                    borderRadius: 12,
                    marginLeft: 12
                  }, this.disabledModeFunc() && styles.disabledStyle]}
                />


              </View>
              <View style={styles.sliderContainer}>
                <ListItemWithSlider
                  disabled={this.disabledModeFunc()}
                  title={PluginStrings.temperature}
                  sliderProps={{ minimumValue: 15, maximumValue: 45, value: this.state.temp }}
                  sliderStyle={{
                    minimumTrackTintColor: "#16B7FF",
                    maximumTrackTintColor: "#F5F5F5",
                    // style: { width: width * 0.2, alignSelf: 'center' },
                    // trackStyle: { height: 24, borderRadius: 24 },
                    thumbStyle: { width: 19, height: 19, borderRadius: 19, backgroundColor: '#FFFFFF' }
                  }}
                  containerStyle={{ width: screenWidth - 24 }}
                  // titleStyle={{ fontSize: 17, color: 'red' }}
                  // valueStyle={{ fontSize: 10, color: 'yellow' }}
                  showWithPercent={false}
                  unit={'℃'}
                  onValueChange={(value) => console.log(value)}
                  onSlidingComplete={(value) => this.setTemp(value)}
                  useNewType={true}
                  separator={<Separator />}
                />
              </View>
              <View style={styles.sliderContainer}>
                <ListItemWithSlider
                  disabled={!this.state.light}
                  title={PluginStrings.dimming}
                  sliderProps={{ minimumValue: 0, maximumValue: 100, value: this.state.brightness, step: 10 }}
                  sliderStyle={{
                    minimumTrackTintColor: "#16B7FF",
                    maximumTrackTintColor: "#F5F5F5",
                    // style: { width: width * 0.5, alignSelf: 'center' },
                    trackStyle: { height: 24, borderRadius: 24, paddingRight: 24 },
                    thumbStyle: { width: 19, height: 19, borderRadius: 19, backgroundColor: '#FFFFFF' }
                  }}
                  containerStyle={{ width: screenWidth - 24 }}
                  // titleStyle={{ fontSize: 17, color: 'red' }}
                  // valueStyle={{ fontSize: 10, color: 'yellow' }}
                  showWithPercent={false}
                  unit={'%'}
                  onValueChange={(value) => console.log(value)}
                  onSlidingComplete={(value) => this.setBrightness(value)}
                  useNewType={true}
                  separator={<Separator />}
                />
              </View>

            </ScrollView>
          </ImageBackground>

          {/* <Separator/> */}

        </View>
      );
    }

    setLightSwitch() {

      /**
             * 这里的 siid 和 piid 的获取，可以通过解析 getSpecString 获取的spec信息， 也可以通过开发者平台上查询该设备对应的设备属性 siid 和 piid值;
             * value 的数据类型 也可以通过 开发者平台上查询（和查看 siid 和 piid 相同）
             */
      let state = this.state.light ? false : true;
      let params = [
        { did: Device.deviceID, siid: 2, piid: 1, value: state }
      ];
      this.setState((prev) => ({
        light: !prev.light
      }));
      this.setPropertiesValue(params);
    }

    setSwingSwitch() {
      /**
             * 这里的 siid 和 piid 的获取，可以通过解析 getSpecString 获取的spec信息， 也可以通过开发者平台上查询该设备对应的设备属性 siid 和 piid值;
             * value 的数据类型 也可以通过 开发者平台上查询（和查看 siid 和 piid 相同）
             */
      let s = this.state.swing ? false : true;
      let params = [
        { did: Device.deviceID, siid: 5, piid: 3, value: s }
      ];
      this.setState((prev) => ({
        swing: !prev.swing
      }));
      this.setPropertiesValue(params);

    }

    setBrightness(val) {
      let params = [
        { did: Device.deviceID, siid: 2, piid: 3, value: val }
      ];
      this.setState((prev) => ({
        brightness: val
      }));
      this.setPropertiesValue(params);
    }

    setTemp(val) {
      let params = [
        { did: Device.deviceID, siid: 4, piid: 9, value: val }
      ];
      this.setState((prev) => ({
        temp: val
      }));
      this.setPropertiesValue(params);
    }

    setPropertiesValue(params) {
      // console.log('setPropertiesValue', new Date().getTime())
      Service.spec.setPropertiesValue(params).then((res) => {
        // console.log('setPropertiesValue success ', res);
        this.setState((prev) => ({
          isSendData: true
        }));

      }).catch((error) => {
        console.log('setPropertiesValue error ', error);
      });
    }

    componentWillUnmount() {
      this.removeListener();
    }

    getDeviceSpecInfo() {
      Service.spec.getSpecString(Device.deviceID).then((specInfo) => {
        console.log('spec info: ', JSON.stringify(specInfo));
      }).catch((error) => {
        console.log('getSpecString error', error);
      });
    }

    getDevicePropsValue() {

      /**
             * 这里的 siid 和 piid 的获取，可以通过解析 getSpecString 获取的spec信息， 也可以通过开发者平台上查询该设备对应的设备属性 siid 和 piid值
             */
      let params = [
        { did: Device.deviceID, siid: 2, piid: 1 },
        { did: Device.deviceID, siid: 2, piid: 3 },
        { did: Device.deviceID, siid: 4, piid: 2 },
        { did: Device.deviceID, siid: 4, piid: 9 },
        { did: Device.deviceID, siid: 5, piid: 3 },
        { did: Device.deviceID, siid: 6, piid: 1 }
      ];
        //  'prop.6.1', 'prop.7.1', 'prop.7.2'
      Service.spec.getPropertiesValue(params).then((res) => {
        let d_4_2 = 0;
        let d_7_1 = false;
        let d_7_2 = false;
        for (let i in res) {
          let item = res[i];
          let key = `${ item.siid }.${ item.piid }`;
          let iData = item.value;
          console.log(key, iData);
          switch (key) {
            case '2.1':
              this.setState({
                light: iData
              });
              break;
            case '2.3':
              this.setState({
                brightness: iData
              });
              break;
            case '4.2':
              this.setState({
                puMode: iData
              });

              if (iData === 0) {
                this.changeMode('modes2', 2);
              } else if (iData === 1) {
                this.changeMode('modes', 0);
              } else if (iData === 2) {
                this.changeMode('modes', 1);
              } else if (iData === 3) {
                this.changeMode('modes', 2);
              } else if (iData === 4) {
                this.changeMode('modes1', 2);
              } else if (iData === 5) {
                this.changeMode('modes2', 0);
              } else if (iData === 6) {
                this.changeMode('modes2', 1);
              } else if (iData === 7) {
                this.changeMode('modes1', 1);
              } else if (iData === 8) {
                this.changeMode('modes1', 0);
              }
              d_4_2 = iData;
              break;
            case '4.9':
              this.setState({
                temp: iData
              });
              break;
            case '5.3':
              this.setState({
                swing: iData
              });
              break;
            case '6.1':
              // if (iData) {
              //   this.changeMode('modes', 1);
              // }
              // this.setState({
              //   power: iData
              // });
              break;
            case '7.1':
              this.setState({
                defecation: iData
              });
              d_7_1 = iData;
              if (iData) {
                this.changeMode('modes1', 1);
              }
              break;
            case '7.2':
              this.setState({
                washing: iData
              });
              d_7_2 = iData;
              if (iData) {
                this.changeMode('modes1', 0);
              }
              break;
          }
        }
        this.forceUpdate();
      }).catch((error) => {
        console.log('getPropertiesValue error ', error);
      });
      this.forceUpdate();
    }

    setDevicePropsValue() {

      /**
             * 这里的 siid 和 piid 的获取，可以通过解析 getSpecString 获取的spec信息， 也可以通过开发者平台上查询该设备对应的设备属性 siid 和 piid值;
             * value 的数据类型 也可以通过 开发者平台上查询（和查看 siid 和 piid 相同）
             */
      let params = [
        { did: Device.deviceID, siid: 1, piid: 1, value: 'xiaomi' },
        { did: Device.deviceID, siid: 2, piid: 1, value: false }
      ];

      Service.spec.setPropertiesValue(params).then((res) => {
        console.log('setPropertiesValue success ', res);
      }).catch((error) => {
        console.log('setPropertiesValue error ', error);
      });
    }

    doDeviceAction() {

      let params = { did: Device.deviceID, siid: 1, aiid: 3, in: [17, "shanghai"] };
      Service.spec.doAction(params).then((res) => {
        console.log('doAction success ', res);
      }).catch((error) => {
        console.log('doAction error ', error);
      });
    }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SdkStyles.common.backgroundColor,
    flex: 1,
    alignItems: "flex-start"
  },
  bg: {
    flex: 1,
    height: 486
  },
  topBg: {
    flex: 1,
    // height: ‘’,
    width: screenWidth,
    // justifyContent: 'center',
    alignItems: "center",
    // resizeMode: 'contain',
    // position: 'fixed',
    top: 0
  },
  puImg: {
    marginTop: 26,
    position: "absolute",
    flex: 1,
    width: screenWidth - 64,
    height: 248,
    resizeMode: 'contain'
    // height: 'auto',
    // justifyContent: 'center',
    // alignItems: 'center',

    // justifyContent: 'center'
  },

  sliderContainer: {
    marginTop: 12,
    width: screenWidth - 24,
    overflow: 'hidden',
    borderRadius: 12,
    marginLeft: 12
  },
  listCardContainer: {
    marginTop: 12,
    width: screenWidth - 24,
    overflow: 'hidden',
    borderRadius: 12,
    marginLeft: 12,
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row'
  },
  listCardItem: {
    borderRadius: 12,
    overflow: 'hidden'
  },
  modeCardStyle: {
    height: 'auto',
    flex: 1
  },

  modeContainer: {
    marginLeft: 12,
    // marginTop: -89,
    // borderRadius: 12,
    width: screenWidth - 24,
    flexWrap: "wrap",
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: "#FFFFFF",
    justifyContent: 'center',
    alignContent: 'center',
    paddingLeft: 30,
    paddingRight: 30
  },

  modeItem: {
    // width: (screenWidth - 24 - 100 - 80) / 3,
    alignContent: 'center',
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    flex: 1
  },
  modeItemImg: {
    width: 52,
    height: 52,
    flex: 1
  },
  modeItemText: {
    marginTop: 6,
    color: '#999999',
    textAlign: 'center',
    flex: 1
  },
  modeItemActiveText: {
    color: '#16B7FF'
  },
  disabledStyle: {
    opacity: 0.3
  }
});




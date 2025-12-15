import React from 'react';
import { Device, DeviceEvent, Service, DarkMode } from 'miot';
import { Dimensions, FlatList, StyleSheet, Text, View, ScrollView } from 'react-native';
import PluginStrings from '../../resources/strings';
import NavigationBar from 'miot/ui/NavigationBar';

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");
/**
 * 自定义智能自动化开发-开发自定义自动化页面
 * 该功能并非插件开发的必须功能，具体详情可参考文档：
 * https://iot.mi.com/new/doc/extension-development/topics/automation-develop
 */
export default class ScenePage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isDark: false,
      queryData: [
        // 压缩机频率
        { did: Device.deviceID, siid: 6, piid: 3 },
        // 累计电量
        { did: Device.deviceID, siid: 6, piid: 4 },
        // 本次用电量
        { did: Device.deviceID, siid: 6, piid: 5 },
        // 瞬时功率
        { did: Device.deviceID, siid: 6, piid: 6 },
        // 膨胀阀开度
        { did: Device.deviceID, siid: 6, piid: 7 },
        // 室内盘管温度
        { did: Device.deviceID, siid: 6, piid: 8 },
        // 室外盘管温度
        { did: Device.deviceID, siid: 6, piid: 9 },
        // 压缩机排气温度
        { did: Device.deviceID, siid: 6, piid: 10 },
        // 室外空气温度
        { did: Device.deviceID, siid: 6, piid: 11 },
        // 回风温度
        { did: Device.deviceID, siid: 6, piid: 12 }
      ],
      acceptData: {},
      isSendData: false,
      parseDataTimer: null,
      data_6_3: '--',
      data_6_4: '--',
      data_6_5: '--',
      data_6_6: '--',
      data_6_7: '--',
      data_6_8: '--',
      data_6_9: '--',
      data_6_10: '--',
      data_6_11: '--',
      data_6_12: '--'
    };

    this.initNavigationBar();
  }

  get parameteProps() {
    return [{
      // 膨胀阀开度
      id: '6_7',
      title: PluginStrings.expansion,
      value: this.state.data_6_7
    }, {
      // 压缩机频率
      id: '6_3',
      title: `${ PluginStrings.compressor }(Hz)`,
      value: this.state.data_6_3
    }, {
      // 室内盘管温度
      id: '6_8',
      title: `${ PluginStrings.snCoilTemp }(℃)`,
      value: this.state.data_6_8
    }, {
      // 室外盘管温度
      id: '6_9',
      title: `${ PluginStrings.swCoilTemp }(℃)`,
      value: this.state.data_6_9
    }, {
      // 压缩机排气温度
      id: '6_10',
      title: `${ PluginStrings.dischargeTemp }(℃)`,
      value: this.state.data_6_10
    }, {
      // 室外空气温度
      id: '6_11',
      title: `${ PluginStrings.swAirTemp }(℃)`,
      value: this.state.data_6_11
    }, {
      //
      id: '6_12',
      title: `${ PluginStrings.returnAirTemp }(℃)`,
      value: this.state.data_6_12
    }, {
      // 累计电量
      id: '6_4',
      title: `${ PluginStrings.addUpElec }(kwh)`,
      value: this.state.data_6_4
    }, {
      // 本次用电量
      id: '6_5',
      title: `${ PluginStrings.currentUsage }(kwh)`,
      value: this.state.data_6_5
    }, {
      // 瞬时功率
      id: '6_6',
      title: `${ PluginStrings.instantaneous }(W)`,
      value: this.state.data_6_6
    }];
  }

  componentWillUnmount() {
    this.removeListener();
  }

  UNSAFE_componentWillMount() {
    this.setState({
      isDark: DarkMode.getColorScheme() === 'dark' ? true : false
    });

    this.addListener();
    this.getDevicePropsValue();
  }

  getDevicePropsValue() {
    /**
                 * 这里的 siid 和 piid 的获取，可以通过解析 getSpecString 获取的spec信息， 也可以通过开发者平台上查询该设备对应的设备属性 siid 和 piid值
                 */
    let params = this.state.queryData;
    //  'prop.6.1', 'prop.7.1', 'prop.7.2'
    Service.spec.getPropertiesValue(params).then((res) => {
      console.log(res);
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

  addListener() {

    this.mDarkModeListener = DarkMode.addChangeListener((object) => {
      if (object.colorScheme) {
        this.setState({
          isDark: object.colorScheme === 'dark' ? true : false
        });

      }
    });

    let subscribeData = [];
    for (let i in this.state.queryData) {
      let item = this.state.queryData[i];
      subscribeData.push(`prop.${ item.siid }.${ item.piid }`);
    }

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
        for (let i in data) {
          let item = data[i];
          let key = item.key.replace("prop.", '');
          let iData = item.value;
          let i_d = iData[0];
          that.setState((state) => {
            state.acceptData[key] = i_d;
          });
        }

        let time = that.state.isSendData ? 3000 : 0;
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

    parseData = (key, iData) => {
      // if (iData) {
      console.log('``', key, iData);
      let stateKey = key.replace('.', '_');
      let d = iData ? iData : 0;
      this.setState({
        [`data_${ stateKey }`]: d
      });
      // }
    };

    initNavigationBar() {
      this.props.navigation.setParams({
        titleProps: {
          backgroundColor: '#F7F7F7',
          title: PluginStrings.parameterQuery,
          left: [
            {
              key: NavigationBar.ICON.BACK,
              onPress: () => {
                // console.log(navigation)
                this.props.navigation.goBack();
                // navigation.goBack();
              }
            }
          ]
        }
      });
    }

    render() {
      // 自定义分割线
      // const renderSeparator = () => {
      //   return <View style={ styles.separator }/>;
      // };
      return (
        <View style={styles.container}>
          <ScrollView style={{ flex: 1 }} onMomentumScrollEnd={() => {
          }}>
            <View style={styles.parameContent}>
              <FlatList
                data={this.parameteProps}
                // ItemSeparatorComponent={renderSeparator} // 设置分割线
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                renderItem={({ item, index }) => (
                  <View style={[styles.parameItem, {
                    // backgroundColor: RED
                  }]} key={`parameItem_${ index }`}>
                    <View style={styles.msg}>
                      <Text style={[styles.parameItemValue, { color: this.state.isDark ? 'xmrgba(255, 255, 255, .8)' : 'rgba(28, 34, 41, .8)' }]}>{item.value}</Text>
                      <Text style={[styles.parameItemTitle, { color: this.state.isDark ? 'xmrgba(255, 255, 255, .6)' : 'rgba(28, 34, 41, .6)' }]}>
                        {item.title}
                      </Text>
                    </View>

                    {index % 2 === 0 && <View style={styles.separator}></View>}
                    {/* <View style={styles.separator}></View> */}
                  </View>
                )}
              />
            </View>
            <View style={styles.parameteTips}>
              <Text style={styles.parameteTipsText}>{PluginStrings.eleTips1}</Text>
              <Text style={styles.parameteTipsText}>{PluginStrings.eleTips2}</Text>
            </View>

          </ScrollView>
        </View>
      );
    }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    height: screenHeight,
    flex: 1
  },
  parameContent: {
    backgroundColor: '#Fff',
    borderRadius: 12,
    width: screenWidth - 24,
    marginLeft: 12,
    marginTop: 20,
    overflow: 'hidden',
    paddingBottom: 30
  },
  parameItem: {
    flex: 1,
    width: (screenWidth - 24),
    paddingTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    position: 'relative',
    flexDirection: 'row'
    // backgroundColor: "#000"
  },
  msg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  parameItemValue: {
    fontSize: 34,
    color: 'rgba(28, 34, 41, .8)'
  },
  parameItemTitle: {
    fontSize: 12,
    color: 'rgba(28, 34, 41, .6)',
    textAlign: 'center'

  },
  separator: {
    width: 1,
    marginLeft: 'auto',
    height: 30, // 分割线高度
    backgroundColor: "#D5D5D5"
  },
  parameteTips: {
    fontSize: 21,
    color: '#999999',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20
  },
  parameteTipsText: {
    fontSize: 10,
    color: '#999999'
  }
});



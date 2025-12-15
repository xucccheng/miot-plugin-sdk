import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NavigationBar from 'miot/ui/NavigationBar';
import { navigation } from 'react-navigation';
import { Device, DeviceEvent, Service } from 'miot';
import ArcProgressBar from '../CommonModules/ArcProgressBar';
import OverlayPage from '../CommonModules/OverlayPage';
import PluginStrings from '../../resources/strings';

export default class FilterPage extends React.Component {
  constructor(props) {
    super(props);
    const { CFilterTime, setCFilterTime, GFilterTime, setGFilterTime } = props.navigation.state.params || {};
    // console.log('GFilterTime', props.navigation.state.params)
    // console.log('CFilterTime', CFilterTime)
    this.initNavigationBar();
    this.state = {
      tabIndex: 1, // 父组件中的状态
      overlayVisible: false,
      comType: 'resetTip',
      queryData: [
        { did: Device.deviceID, siid: 5, piid: 7 },
        { did: Device.deviceID, siid: 5, piid: 9 },
        { did: Device.deviceID, siid: 5, piid: 10 },
        { did: Device.deviceID, siid: 5, piid: 11 }
      ],
      acceptData: {},
      isSendData: false,
      parseDataTimer: null,
      CFilterTime: CFilterTime ?? 0,
      setCFilterTime: setCFilterTime ?? 0,
      GFilterTime: GFilterTime ?? 0,
      setGFilterTime: setGFilterTime ?? 0
    };
  }

  get CJProportion() {
    let cTime = this.state.CFilterTime ?? 0;
    let setCTime = this.state.setCFilterTime ?? 0;
    let CRatio = cTime ? Math.round(cTime * 100 / setCTime) : 0;
    CRatio = CRatio > 100 ? 100 : CRatio;
    return CRatio;
  }

  get GJProportion() {
    let gTime = this.state.GFilterTime ?? 0;
    let setGTime = this.state.setGFilterTime ?? 0;
    let GRatio = gTime ? Math.round(gTime * 100 / setGTime) : 0;
    GRatio = GRatio > 100 ? 100 : GRatio;
    return GRatio;
  }

  get filterDays() {
    let index = this.state.tabIndex;
    let time = index === 1 ? this.state.CFilterTime : this.state.GFilterTime;
    let days = parseInt(time / 24);
    return days;
  }

  componentWillUnmount() {
    this.removeListener();
  }

  UNSAFE_componentWillMount() {
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
    let subscribeData = [];
    for (let i in this.state.queryData) {
      let item = this.state.queryData[i];
      subscribeData.push(`prop.${ item.siid }.${ item.piid }`);
    }
    console.log('subscribeData', subscribeData);
    Device.getDeviceWifi().subscribeMessages(...subscribeData).then((subcription) => {
      console.log('subscribeMessages success', subcription);
      this.mSubcription = subcription;
    }).catch((error) => {
      console.log('subscribeMessages error', error);
    });

    let that = this;
    this.mDeviceReceivedMessages = DeviceEvent.deviceReceivedMessages.addListener(
      (device, map, data) => {
        console.log('deviceReceivedMessages', data);
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
        console.log('data', data);
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

    parseData = (key, iData) => {
      console.log('``', key, iData);
      // let stateKey = key.replace('.', '_')
      // let d = iData ? iData : '--';
      switch (key) {
        // 初级滤芯剩余时间
        case '5.7':
          this.setState({
            CFilterTime: iData
          });
          break;
          // 高级滤芯剩余寿命
        case '5.9':
          this.setState({
            GFilterTime: iData
          });
          break;
          // 设置高级滤芯寿命
        case '5.10':
          this.setState({
            setGFilterTime: iData
          });
          break;
          // 设置低级滤芯寿命
        case '5.11':
          this.setState({
            setCFilterTime: iData
          });
          break;
      }
    };

    removeListener() {
      // 取消监听 隐私权限
      this.mPackageAuthorizationAgreed && this.mPackageAuthorizationAgreed.remove();
      // 取消订阅
      this.mSubcription && this.mSubcription.remove();
      // 取消监听
      this.mDeviceReceivedMessages && this.mDeviceReceivedMessages.remove();

      this._deviceNameChangedListener && this._deviceNameChangedListener.remove();
    }

    initNavigationBar() {
      this.props.navigation.setParams({
        titleProps: {
          backgroundColor: '#F7F7F7',
          title: PluginStrings.setFilter,
          left: [
            {
              key: NavigationBar.ICON.BACK,
              onPress: () => {
                console.log(navigation);
                this.props.navigation.goBack();
                // navigation.goBack();
              }
            }
          ]
        }
      });
    }

    showOverlay = () => {
      this.setState({
        overlayVisible: true
      });
    };

    hideOverlayVisible = () => {
      this.setState({ overlayVisible: false });
    };

    confirmCom = () => {
      let index = this.state.tabIndex;
      let siid = 5;
      let piid = index === 1 ? 11 : 10;
      let filterTime = index === 1 ? this.state.setCFilterTime : this.state.setGFilterTime;
      let params = [
        { did: Device.deviceID, siid: siid, piid: piid, value: filterTime }
      ];
      this.setPropertiesValue(params);
      this.hideOverlayVisible();
    };

    setPropertiesValue(params) {
      console.log('setPropertiesValue', params);
      Service.spec.setPropertiesValue(params).then((res) => {
        console.log('setPropertiesValue success ', res);
        // this.setState((prev) => ({
        //     isSendData: true
        // }));

      }).catch((error) => {
        console.log('setPropertiesValue error ', error);
      });
    }

    render() {
      return (
        <View style={styles.container}>
          <View style={styles.tab}>
            <Text style={[styles.tabText, this.state.tabIndex === 1 ? styles.tabActive : '']}
              onPress={() => this.setState({ tabIndex: 1 })}>{PluginStrings.cxFilter}</Text>
            <Text style={[styles.tabText, this.state.tabIndex === 2 ? styles.tabActive : '']}
              onPress={() => this.setState({ tabIndex: 2 })}>{PluginStrings.gxFilter}</Text>
          </View>
          <View style={styles.content}>
            <ArcProgressBar
              days={this.filterDays}
              progress={`${ this.state.tabIndex === 1 ? this.CJProportion : this.GJProportion }`}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.showOverlay();
              }}
            >
              <Text style={styles.buttonText}>{PluginStrings.resetFilter}</Text>
            </TouchableOpacity>
          </View>
          {/* 弹窗 */}
          {this.state.overlayVisible && <OverlayPage comType={this.state.comType} confirm={this.confirmCom}
            close={this.hideOverlayVisible}></OverlayPage>}
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7'
  },
  tab: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabText: {
    width: 106,
    height: 24,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
    color: "#999999"
  },
  tabActive: {
    color: '#447EF2'
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center"
  },
  button: {
    position: "absolute",
    bottom: 35,
    height: 45,
    width: 306,
    backgroundColor: "#fff",
    borderRadius: 23,
    textAlign: "center",
    lineHeight: 45
  },
  buttonText: {
    height: 45,
    width: 306,
    backgroundColor: "#fff",
    color: "#447EF2",
    fontWeight: 'bold',
    borderRadius: 23,
    textAlign: "center",
    lineHeight: 45
  }
});

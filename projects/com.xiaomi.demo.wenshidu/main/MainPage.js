import React from 'react';
import { Device, Package, PackageEvent, Service ,DeviceEvent} from 'miot';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NavigationBar from 'miot/ui/NavigationBar';
import Separator from 'miot/ui/Separator';
/**
 * SDK 提供的多语言 和 插件提供的多语言
 */
import { strings as SdkStrings } from 'miot/resources';
/**
 * SDK 支持的字体
 */
import * as SdkFontStyle from 'miot/utils/fonts';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryStack } from "victory-native";
import { VictoryTheme } from "victory-core";
import value from "d3-interpolate/src/value";
import PluginStrings from "../../../bin/template/ble/resources/strings";

let msgSubscription;


export default class MainPage extends React.Component {

  /**
   * 页面内部自定义Header
   * @param navigation
   * @returns {{header: *}|{header: null}}
   */
  static navigationOptions = ({ navigation }) => {
    const { titleProps } = navigation.state.params || {};
    if (!titleProps) return { header: null };
    return {
      header: <NavigationBar { ...titleProps } />
    };
  };

  constructor(props) {
    super(props);

    this.initNavigationBar();

    this.state = {
      indoorTemperature: 0,
      humidity: 0,
      temperatureHistory: [],
      humidityHistory: [],
      hasData: false
    };
  }

  initNavigationBar() {
    this.props.navigation.setParams({
      titleProps: {
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
    this.packageAuthorizationAgreed = PackageEvent.packageAuthorizationAgreed.addListener(() => {
      // 隐私弹窗-用户点击同意
      console.log('user agree protocol...');
    });
    console.log('componentWillMount(');
    this.refreshDeviceData();

    Device.getDeviceWifi()
      .subscribeMessages(
        "prop.4100", "prop.4102"
      )
      .then((subcription) => {
        msgSubscription = subcription;
      }).catch((error) => {
      console.log('subscribeMessages error', error);
    });

    this.deviceMessagesListener = DeviceEvent.deviceReceivedMessages.addListener(
      (device, message) => {
        console.log(device + 'receive', message);
        if (message.get("prop.4100")) {
          this.setState({
            indoorTemperature:this.getRealValue(message.get("prop.4100")[0])
          });
          console.log('indoorTemperature',message.get("prop.4100") );
        }

        if (message.get("prop.4102")) {
          this.setState({
            humidity:this.getRealValue(message.get("prop.4102")[0])
          });
          console.log('humidity',message.get("prop.4102") );
        }
      }
    );
    this.loop = setInterval(this.refreshDeviceData, 30000);
  }

  render() {
    return (
      <View style={ styles.container }>
        <Separator/>
        <View style={ styles.container }>
        <Text style={ styles.commonTextStyle }>温度</Text>
        <View style={ styles.dataContainer }>
          <Text style={ styles.dataTextStyle }>
            { (this.state.indoorTemperature / 10).toFixed(1) }
          </Text>
          <Text style={ styles.unitTextStyle }>℃</Text>
        </View>
        <Text style={ [styles.commonTextStyle, { marginTop: 50 }] }>湿度</Text>
        <View style={ styles.dataContainer }>
          <Text style={ styles.dataTextStyle }>
            { (this.state.humidity / 10).toFixed(0) }
          </Text>
          <Text style={ styles.unitTextStyle }>%</Text>
        </View>

        { this.showView() }

        </View>

        <TouchableOpacity style={[styles.btnStyle , {backgroundColor : "#6a6ad5",height:50,justifyContent:"center",alignItems:"center"}]} onPress={() => {
          this.props.navigation.navigate('BleControl',{ title: '蓝牙直连控制', sc_type: 4 } );
        }}>
          <Text>
            进入BLE直连
          </Text>
        </TouchableOpacity>
      </View>
    );
  }


  componentWillUnmount() {
    // 取消监听
    this.packageAuthorizationAgreed && this.packageAuthorizationAgreed.remove();
    msgSubscription && msgSubscription.remove();
    this.deviceMessagesListener && this.deviceMessagesListener.remove();
    clearInterval(this.loop);
  }

  showView() {
    return this.state.hasData ? <View style={ styles.chartContainer }>
        <View style={ styles.chartHeadContainer }>
          <View style={ styles.temperatureBackgroundStyle }/>
          <Text style={ styles.chartTextStyle }>
            温度(℃)
          </Text>
          <View style={ styles.humidityBackgroundStyle }/>
          <Text style={ styles.chartTextStyle }>
            湿度(%)
          </Text>
        </View>
        <VictoryChart
          domainPadding={ 50 }
          theme={ VictoryTheme.material }>
          <VictoryStack>
            <VictoryLine
              interpolation="natural"
              data={
                this.state.temperatureHistory
              }
              labels={ ({ datum }) => `${ datum.y } ℃` }
              style={ {
                data: {
                  stroke: "#f12424",
                  strokeWidth: 3
                }
              } }

            />
            <VictoryLine
              interpolation="natural"
              data={
                this.state.humidityHistory
              }
              labels={ ({ datum }) => `${ datum.y } %` }
              style={ {
                data: {
                  stroke: "#e5b912",
                  strokeWidth: 3
                }
              } }
            />
            <VictoryAxis
              tickValues={[1, 2, 3, 4,5]}
              domain={[1,5]}
              tickFormat={ (value) => {
                if (this.state.humidityHistory.length > 0 && this.state.humidityHistory[parseInt(value) - 1] &&
                  this.state.temperatureHistory.length > 0 && this.state.temperatureHistory[parseInt(value) - 1]){
                  let timestamp = this.state.humidityHistory[parseInt(value) - 1]['x'] * 1000;
                  let date = new Date(timestamp);
                  let hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) ;
                  let mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) ;
                  return hh + ":" + mm;
                }else {
                  return value;
                }
              }
              }
              orientation="bottom"/>
          </VictoryStack>
        </VictoryChart>
      </View> :
      <Text style={ [styles.commonTextStyle, { textAlign: 'center', color: "#f00", marginTop: 150 }] }>暂无历史数据</Text>;
  }


  refreshDeviceData = () => {
    Service.smarthome.batchGetDeviceDatas([{ did: Device.deviceID, props: ["prop.4100", "prop.4102"] }]).then((res) => {
      let result = res[Device.deviceID];
      console.log('batchGetDeviceDatas', result);
      this.setState({
        indoorTemperature: this.getRealValue(result["prop.4100"]),
        humidity: this.getRealValue(result["prop.4102"])
      });

    }).catch((error) => {
      Service.smarthome.reportLog(Device.model, `Service.smarthome.batchGetDeviceDatas error: ${ JSON.stringify(error) }`);
    });


    let now = parseInt(Date.now() / 1000 - 3600 * 60);
    let end = parseInt(Date.now() / 1000);
    console.log('device id=' + Device.deviceID + ',' + Device.mac + ',' + Device.did);
    Service.smarthome.getDeviceData({
      did: Device.deviceID,
      key: ["4100", "4102"],
      type: 'prop',
      time_start: now,
      time_end: end,
      group: "hour",
      limit: 5
    })
      .then(res => {
        console.log('get Property :' + JSON.stringify(res));
        if (res && res.length != 0) {

          res.forEach(v => {
              v.value = this.getRealValue(v.value);
            }
          );
          console.log('get getRealValueProperty :' + JSON.stringify(res));
          let temperatureList = [];
          let humidityList = [];

          res.filter(value => {
            return value.key == "4100";
          }).sort((a, b) => {
            return a["time"] - b["time"];
          }).forEach((element,index) => {
              temperatureList.push({ x: "" + element["time"], y: element["value"] / 10 });
            });


          res.filter(value => {
            return value.key == "4102";
          }).sort((a, b) => {
            return a["time"] - b["time"];
          }).forEach((element,index) => {
              humidityList.push({ x: "" + temperatureList[index]["x"] , y: element["value"] / 10 });
            });

          console.log('get temperatureList :' + JSON.stringify(temperatureList));
          console.log('get humidityList :' + JSON.stringify(humidityList));
          this.setState({
            temperatureHistory: temperatureList,
            humidityHistory: humidityList
          });
          this.setState({
            hasData: true
          });
        } else {
          this.setState({
            hasData: false
          });
        }

      }).catch(res => {
      console.log('get Property fail:' + JSON.stringify(res));
    });

  };

  //数据大小端转换，此处为示例
  getRealValue(value) {
    let val = "0x" + value[2] + value[3] + value[0] + value[1];
    let binary = parseInt(val,16).toString(2)
    if (binary.length == 16 && binary[0] == 1){
      let num = '';
      for (let i = 1; i < binary.length;i++){
          num += binary[i] == '1' ? '0' : '1'
      }
      return -parseInt(num,2) - 1;
    }else {
      return parseInt(val);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e7883f',
    flex: 1,
  },

  commonTextStyle: {
    fontSize: 15,
    marginTop: 20,
    marginLeft: 20,
    color: '#fff'
  },

  dataContainer: {
    flexDirection: `row`,
    height: 50,
    justifyContent: "center",
    marginTop: 20,
    alignItems: `center`
  },

  chartContainer: {
    flex: 1,
    paddingLeft: 20,
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    alignItems: `center`
  },

  chartHeadContainer: {
    flexDirection: `row`,
    height: 50,
    justifyContent: "center",
    alignItems: `center`
  },

  dataTextStyle: {
    color: '#fff',
    marginBottom: 10,
    fontSize: 80,
    lineHeight: 100
  },

  chartTextStyle: {
    color: '#000',
    fontSize: 15,
    marginLeft: 10
  },

  temperatureBackgroundStyle: {
    height: 15,
    width: 15,
    backgroundColor: "#f12424"
  },
  humidityBackgroundStyle: {
    height: 15,
    width: 15,
    backgroundColor: "#e5b912",
    marginLeft: 10
  },

  unitTextStyle: {
    fontSize: 20,
    lineHeight: 22,
    color: '#fff',
    fontFamily: SdkFontStyle.FontKmedium,
    marginBottom: 20
  }
});




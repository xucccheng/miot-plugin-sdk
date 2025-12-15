import React from 'react';
import { Service, Device } from 'miot';
import { Package } from 'miot';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ListItem } from "miot/ui/ListItem";
import { Styles as SdkStyles } from "miot/resources";
import PluginStrings from '../../resources/strings';
/**
 * 自定义智能自动化开发-开发自定义自动化页面
 * 该功能并非插件开发的必须功能，具体详情可参考文档：
 * https://iot.mi.com/new/doc/extension-development/topics/automation-develop
 */
export default class ScenePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      protocol: null,
      manufacturer: null,
      model: null,
      deviceId: null,
      firmVersion: null,
      serialNumber: null
    };
  }

  UNSAFE_componentWillMount() {
    this.getDevicePropsValue();
  }

  getDevicePropsValue() {

    /**
             * 这里的 siid 和 piid 的获取，可以通过解析 getSpecString 获取的spec信息， 也可以通过开发者平台上查询该设备对应的设备属性 siid 和 piid值
             */
    let params = [
      { did: Device.deviceID, siid: 1, piid: 1 },
      { did: Device.deviceID, siid: 1, piid: 2 },
      { did: Device.deviceID, siid: 1, piid: 3 },
      { did: Device.deviceID, siid: 1, piid: 4 },
      { did: Device.deviceID, siid: 1, piid: 5 }
    ];
    //  'prop.6.1', 'prop.7.1', 'prop.7.2'
    Service.spec.getPropertiesValue(params).then((res) => {
      console.log('getPropertiesValue success ', res);
      for (let i in res) {
        let item = res[i];
        let key = `${ item.siid }.${ item.piid }`;
        let iData = item.value;
        console.log(key, iData);
        switch (key) {
          case '1.1':
            this.setState({
              manufacturer: iData
            });
            break;
          case '1.2':
            this.setState({
              model: iData
            });
            break;
          case '1.3':
            this.setState({
              deviceId: iData
            });
            break;
          case '1.4':
            this.setState({
              firmVersion: iData
            });
            break;
          case '1.5':
            this.setState({
              serialNumber: iData
            });
            break;
        }
      }
    }).catch((error) => {
      console.log('getPropertiesValue error ', error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Separator /> */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <ListItem
            title={PluginStrings.manufacturer}
            hideArrow={true}
            value={this.state.manufacturer}
          />
          <ListItem
            title={PluginStrings.model}
            hideArrow={true}
            value={this.state.model}
          />
          <ListItem
            title={PluginStrings.deviceID}
            hideArrow={true}
            value={this.state.deviceId}
          />
          <ListItem
            title={PluginStrings.FirmwareVersion}
            hideArrow={true}
            value={this.state.firmVersion}
          />
        </ScrollView>
      </View>
    );
  }

  /**
     * Package.entryInfo.payload有许多数据，只有name和value可修改，其他的均为readonly。
     * name：	string	条件/动作 名称
     * value：	object	可自定义的值，可以是json，string，number。比如：用户自定义的提示文本
     */
  saveScene() {
    Package.entryInfo.payload.value = {
      text: 'xxx',
      type: "xxx"
    };
    console.log("传回native的参数为：", JSON.stringify(Package.entryInfo));
    Package.exit(Package.entryInfo);
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: SdkStyles.common.backgroundColor,
    flex: 1
  },
  btnStyle: {
    margin: 20,
    height: 44,
    backgroundColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center'
  }
});



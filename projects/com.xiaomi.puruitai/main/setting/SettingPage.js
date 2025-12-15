import React from 'react';
import { Service, Device } from 'miot';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { CommonSetting, SETTING_KEYS } from "miot/ui/CommonSetting";
import Separator from 'miot/ui/Separator';
import Protocol from '../../resources/protocol';
import { strings as SdkStrings, Styles as SdkStyles } from "miot/resources";
import { ListItem } from "miot/ui/ListItem";
import {
  PinCodeDialog
} from 'miot/ui/Dialog';
import PluginStrings from '../../resources/strings';
import { ToastView } from "mhui-rn/dist/components/toast";

export default class SettingPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      protocol: null,
      visiblePw: false,
      visibleToast: false
    };
  }

  initCommonSettingParams() {
    this.commonSettingParams = {
      firstOptions: [
        SETTING_KEYS.first_options.SHARE,
        SETTING_KEYS.first_options.IFTTT,
        SETTING_KEYS.first_options.FIRMWARE_UPGRADE,
        SETTING_KEYS.first_options.MORE
      ],
      secondOptions: [
        // SETTING_KEYS.second_options.TIMEZONE,
        SETTING_KEYS.second_options.SECURITY
      ],
      extraOptions: {
        option: "",
        showUpgrade: true
      }
    };
  }

  UNSAFE_componentWillMount() {
    this.initCommonSettingParams();
    this.initProtocol();
  }

  initProtocol() {
    Protocol.getProtocol().then((protocol) => {
      this.setState({
        protocol: protocol
      });
    }).catch((error) => {
      // 错误信息上报， 通过米家app反馈可以上报到服务器
      Service.smarthome.reportLog(Device.model, `Service.getServerName error: ${ JSON.stringify(error) }`);
    });
  }

  openProfession() {
    this.setState({
      visiblePw: true
    });
  }

  render() {

    if (!this.state.protocol) {
      return null;
    }

    this.commonSettingParams.extraOptions.option = this.state.protocol;

    return (
      <View style={styles.container}>
        <Separator />
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >

          <View style={{ backgroundColor: '#ffffff', height: 32, justifyContent: 'center', paddingLeft: SdkStyles.common.padding }}>
            <Text style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', lineHeight: 14 }}>{SdkStrings.featureSetting}</Text>
          </View>

          <View style={{ backgroundColor: '#ffffff' }}>
            <Separator style={{ marginLeft: SdkStyles.common.padding }} />
          </View>

          <ListItem
            title={PluginStrings.parameterQuery}
            onPress={() => {
              this.props.navigation.navigate('ParamQueryPage', { title: PluginStrings.selfDefineScene });
            }}
          />
          <ListItem
            title={PluginStrings.parameterSettings}
            onPress={() => {
              this.openProfession();
              // this.props.navigation.navigate('ProfessionalPage');
            }}
          />
          <View style={{ height: 8 }} />

          <CommonSetting
            navigation={this.props.navigation}
            firstOptions={this.commonSettingParams.firstOptions}
            secondOptions={this.commonSettingParams.secondOptions}
            extraOptions={this.commonSettingParams.extraOptions}
          />
        </ScrollView>
        <PinCodeDialog
          visible={this.state.visiblePw}
          title={PluginStrings.parameterSettings}
          message={PluginStrings.passwordTips}
          digit={6}
          color="#447EF2"
          showCheckbox={false}
          checkboxData={false}

          // checkboxData={this.state.checkboxData}
          buttons={[
            {
              text: PluginStrings.sure,
              style: { color: 'rgba(68, 126, 242, 1)' },
              callback: (result) => {
                let numArr = result.numArr;
                let pw = numArr.join('');
                if (pw === '190530') {
                  this.props.navigation.navigate('ProfessionalPage');
                } else {
                  this.setState({ visibleToast: true });
                  setTimeout(() => {
                    this.setState({ visibleToast: false });
                  }, 2000);
                }
                this.setState({ visiblePw: false });
              }
            }
          ]}
          // onDismiss={_ => this.onDismiss('12')}
        />

        <ToastView
          visible={this.state.visibleToast}
          delay={0}
          keyboardAvoiding={false}
          hideOnPress={true}
          annimation={true}
          text={PluginStrings.passwordErr}
        />
      </View>
    );
  }

  openTimerSettingPageWithOptions() {
    let params = {
      onMethod: "power_on",
      onParam: "on",
      offMethod: "power_off",
      offParam: "off",
      timerTitle: "这是一个自定义标题",
      displayName: "自定义场景名称",
      identify: "identify_1",
      onTimerTips: '',
      offTimerTips: '定时列表页面、设置时间页面 关闭时间副标题（默认：关闭时间）',
      listTimerTips: '定时列表页面 定时时间段副标题（默认：开启时段）',
      bothTimerMustBeSet: false,
      showOnTimerType: true,
      showOffTimerType: false,
      showPeriodTimerType: false
    };
    Service.scene.openTimerSettingPageWithOptions(params);
  }

  openCountDownPage() {
    let params = {
      onMethod: "power_on",
      offMethod: 'power_off',
      onParam: 'on',
      offParam: 'off',
      identify: "custom",
      displayName: '自定义名称'
    };
    Service.scene.openCountDownPage(true, params);
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SdkStyles.common.backgroundColor,
    flex: 1
  }
});


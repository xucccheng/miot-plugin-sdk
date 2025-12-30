import React, { useEffect, useRef, useState } from 'react';
import NavigationBar from 'miot/ui/NavigationBar';
import LinearGradient from 'react-native-linear-gradient';
import { Service, Device, Package } from 'miot';
import { View, ScrollView, StyleSheet } from 'react-native';
import { strings as SdkStrings } from 'miot/resources';
import FaultCom from '../component/FaultCom';
export default class FaultPage extends React.Component {
  constructor(props) {
    super(props);
    // 获取传递的参数
    const { navigation } = this.props;
    this.state = {
      faultCode: (navigation && navigation.state && navigation.state.params && navigation.state.params.faultCode) || ''
    };
    this.params = navigation.state.params || {};
    console.log('FaultPage params:', this.params);
  }
    /**
     * 页面内部自定义Header
     * @param navigation
     * @returns {{header: *}|{header: null}}
     */
    static navigationOptions = ({ navigation }) => {
      const { titleProps } = navigation.state.params || {};
      if (!titleProps) return { header: null };
      return {
        header: <NavigationBar {...titleProps} />
      };
    };

    getBackgroundColor = () => {
      return ['#B5B4BC', '#F6F6F6'];
    }

    render() {

      return (
        <View style={styles.container}>
          <LinearGradient
            colors={this.getBackgroundColor()}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.6 }}
            style={styles.gradient}
          ></LinearGradient>
          <NavigationBar
            backgroundColor={'transparent'}
            title={(this.props.navigation && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.title) || Device.name}
            left={[
              {
                key: NavigationBar.ICON.BACK,
                onPress: () => {
                  //   Package.exit();
                  this.props.navigation.goBack();
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
          />
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
            <View style={styles.statusSection}>
              <FaultCom />
            </View>
          </ScrollView>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  gradient: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  scrollContentContainer: {
    paddingBottom: 20
  },

  statusSection: {
    // height: 300,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
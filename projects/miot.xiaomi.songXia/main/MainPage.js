import React from 'react';
import { API_LEVEL, Package, Host, Device, PackageEvent, DeviceEvent, Service } from 'miot';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import NavigationBar from 'miot/ui/NavigationBar';
import LinearGradient from 'react-native-linear-gradient';

/**
 * SDK 提供的多语言 和 插件提供的多语言
 */
import { strings as SdkStrings, Styles as SdkStyles } from 'miot/resources';
import PluginStrings from '../resources/strings';
/**
 * SDK 支持的字体
 */
import * as SdkFontStyle from 'miot/utils/fonts';

import PuStateCom from './component/PuStateCom';
import FuncCom from './component/FuncCom';
import TimerModal from './component/TimerModal';

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

let isDark = false;

export default class MainPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // 查询内容
            queryData: [
                // light
                { did: Device.deviceID, siid: 2, piid: 1 },
                // 开关 status
                { did: Device.deviceID, siid: 3, piid: 1 },
                // 模式 mode
                // 0: 待机
                // 1: 制热
                // 2: 换气
                // 3: 凉干燥
                // 4: 热干燥
                { did: Device.deviceID, siid: 3, piid: 2 },
                // 定时剩余时间 left-time
                { did: Device.deviceID, siid: 3, piid: 3 },
                // 故障 fault
                { did: Device.deviceID, siid: 3, piid: 4 },

                // 风向 Wind Direction
                // 0: Off
                // 1: 自动
                // 2: 固定
                // 3: 固定90°
                { did: Device.deviceID, siid: 4, piid: 1 },
                // 风量档位 Fan Level
                // 1: 强
                // 2: 弱
                { did: Device.deviceID, siid: 4, piid: 3 },
                // 定时设定 timer-mode-set
                { did: Device.deviceID, siid: 5, piid: 1 },
                // 风种类 	fan-category
                { did: Device.deviceID, siid: 5, piid: 2 },
            ],
            queryNum: 0,
            light: 0,
            status: 0,
            mode: 0,
            leftTime: 0,
            fault: 0,
            windDirection: 0,
            fanLevel: 0,
            timerModeSet: 0,
            fanCategory: 0,

            timerVisible: true,
            timerValue: 6,

            isOn: false,
            activeTab: 0, // 0: 档位, 1: 风向, 2: 风种
            lightOn: false,
            gear: 1,
            direction: 0,
            mode: 0,

            isSendData: false
        };

        // this.initNavigationBar();
        this.timerOptions = [
            { label: PluginStrings.timer3Hours, value: 3 },
            { label: PluginStrings.timer6Hours, value: 6 },
            { label: PluginStrings.timerContinuous, value: 0 }
        ];
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

    initNavigationBar() {
        this.props.navigation.setParams({
            titleProps: {
                title: PluginStrings.homeTitle,
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

        /**
         * 对设备属性进行订阅
         * prop.属性名, profile 设备这样进行传参   eg: prop.power
         * prop.siid.piid， spec协议设备这样进行传参  eg: prop.2.1
         */
        let subscribeData = [];
        for (let i in this.state.queryData) {
            let item = this.state.queryData[i];
            subscribeData.push(`prop.${item.siid}.${item.piid}`);
        }

        Device.getDeviceWifi().subscribeMessages(...subscribeData).then((subcription) => {
            console.log('subscribeMessages success', subcription);
            this.mSubcription = subcription;
        }).catch((error) => {
            console.log('subscribeMessages error', error);
        });
        // console.log('add')
        let that = this;
        // 监听设备属性发生变化事件； 当设备属性发生改变，会发送事件到js，此处会收到监听回调
        this.mDeviceReceivedMessages = DeviceEvent.deviceReceivedMessages.addListener(
            (device, map, data) => {
                // clearTimeout(that.state.parseDataTimer);
                for (let i in data) {
                    let item = data[i];
                    let key = item.key.replace("prop.", '');
                    let iData = item.value;
                    let i_d = iData[0];
                    this.setState((state) => {
                        this.parseData(key, i_d);
                    });
                }
            });

        this.getDevicePropsValue();

    }

    addListeners() {
        this.mDarkModeListener = DarkMode.addChangeListener((object) => {
            if (object.colorScheme) {
                isDark = object.colorScheme === 'dark' ? true : false;
            }
        });

        this.mPackageAuthorizationAgreed = PackageEvent.packageAuthorizationAgreed.addListener(() => {
            // 隐私弹窗-用户点击同意
            console.log('user agree protocol...');
        });

        /**
         * 对设备属性进行订阅
         * prop.属性名, profile 设备这样进行传参   eg: prop.power
         * prop.siid.piid， spec协议设备这样进行传参  eg: prop.2.1
         */
        let subscribeData = [];
        for (let i in this.state.queryData) {
            let item = this.state.queryData[i];
            subscribeData.push(`prop.${item.siid}.${item.piid}`);
        }

        Device.getDeviceWifi().subscribeMessages(...subscribeData).then((subcription) => {
            console.log('subscribeMessages success', subcription);
            this.mSubcription = subcription;
        }).catch((error) => {
            console.log('subscribeMessages error', error);
        });
        // console.log('add')
        let that = this;
        // 监听设备属性发生变化事件； 当设备属性发生改变，会发送事件到js，此处会收到监听回调
        this.mDeviceReceivedMessages = DeviceEvent.deviceReceivedMessages.addListener(
            (device, map, data) => {
                // clearTimeout(that.state.parseDataTimer);
                for (let i in data) {
                    let item = data[i];
                    let key = item.key.replace("prop.", '');
                    let iData = item.value;
                    let i_d = iData[0];
                    this.setState((state) => {
                        this.parseData(key, i_d);
                    });
                }
            });

        this.getDevicePropsValue();
    }

    removeListener() {
        // 取消监听 隐私权限
        this.mPackageAuthorizationAgreed && this.mPackageAuthorizationAgreed.remove();
        // 取消订阅
        this.mSubcription && this.mSubcription.remove();
        // 取消监听
        this.mDeviceReceivedMessages && this.mDeviceReceivedMessages.remove();

        this.mDarkModeListener && DarkMode.removeChangeListener(this.mDarkModeListener);
    }


    componentWillUnmount = () => {
        // 取消监听
        this.removeListener();
    }

    getDevicePropsValue() {
        /**
               * 这里的 siid 和 piid 的获取，可以通过解析 getSpecString 获取的spec信息， 也可以通过开发者平台上查询该设备对应的设备属性 siid 和 piid值
               * ``
        xx       */
        // let params = this.state.queryData;
        //  'prop.6.1', 'prop.7.1', 'prop.7.2'
        Service.spec.getPropertiesValue(this.state.queryData).then((res) => {
            console.log('getPropertiesValue success ', res);
            for (let i in res) {
                let item = res[i];
                let key = `${item.siid}.${item.piid}`;
                if (item ?? {}.hasOwnProperty('value')) {
                    let iData = item.value;
                    this.parseData(key, iData);
                }
            }
            let currentNum = this.state.queryNum;
            // console.log('currentNum', this.state.queryArr[currentNum], currentNum);
            currentNum--;

            if (currentNum >= 0) {
                this.getDevicePropsValue(this.state.queryArr[currentNum]);
            }
            this.setState({
                queryNum: currentNum
            });
            this.setState({ isConfig: true });
        }).catch((error) => {
            console.log('getPropertiesValue error ', error);
        });
    }

    parseData = (key, iData) => {
        console.log('parseData', key, iData);

        switch (key) {
            case '2.1':
                this.setState({ light: iData });
                break;
            case '3.1':
                this.setState({ status: iData });
                break;
            case '3.2':
                this.setState({ mode: iData });
                break;
            case '3.3':
                this.setState({ leftTime: iData });
                break;
            case '3.4':
                this.setState({ fault: iData });
                break;
            case '4.1':
                this.setState({ windDirection: iData });
                break;
            case '4.3':
                this.setState({ fanLevel: iData });
                break;
            case '5.1':
                this.setState({ timerModeSet: iData });
                break;
            case '5.2':
                this.setState({ fanCategory: iData });
                break;
            default:
                console.log('default');
                break;
        }
    };

    // 发送数据
    setPropertiesValue(params) {
        console.log('setPropertiesValue', params);
        Service.spec.setPropertiesValue(params).then(() => {
            this.setState(() => ({
                isSendData: true
            }));

        }).catch((error) => {
            console.log('setPropertiesValue error ', error);
        });
    }

    handleTimerConfirm = (value) => {
        this.setState({ timerValue: value, timerVisible: false });
    }

    // FuncCom 组建的点击事件
    handleFuncComPress = (key, value) => {
        console.log('handleFuncComPress', key, value);
        // 判断key 是否包含 '-'
        let keyParts = key.split('-');

        let idx = keyParts[0].split('.');
        if (idx.length === 2) {
            let siid = idx[1];
            let piid = idx[0];

            let sendValue = 0;

            if (keyParts.length !== 2) {
                // 如果没有， 则按照0，1 处理
                sendValue = value ? 1 : 0;
            } else {
                // 如果有， 则按照具体的值处理
                sendValue = parseInt(keyParts[1]);
            }
            let params = [
                { did: Device.deviceID, siid: siid, piid: piid, value: sendValue }
            ];
            this.setPropertiesValue(params);
        } else {
            return;
        }


    }

    getBackgroundColor = () => {
        const { mode } = this.state;
        switch (mode) {
            case 0: // 换气 - 橙色
                return ['#FD723F', '#F6F6F6']
            case 1: // 凉干燥 - 蓝色
                return ['#00BFFF', '#F6F6F6'];
            default:
                return ['#00CED1', '#F6F6F6'];
        }
    }

    openTimerModal = () => {
        this.setState({ timerVisible: true });
    }

    closeTimerModal = () => {
        this.setState({ timerVisible: false });
    }


    // 第一个功能区参数
    get funcFirstParams() {
        return {
            modeList: [
                {
                    key: '3.1',
                    title: PluginStrings.standby,
                    value: true,
                    img: {
                        on: require('../resources/images/power_on.png'),
                        off: require('../resources/images/power_off.png')
                    }
                },
                {
                    key: '2.1',
                    title: PluginStrings.coolLight,
                    value: false,
                    img: {
                        on: require('../resources/images/l_light_on.png'),
                        off: require('../resources/images/l_light_off.png')
                    }
                }
            ]
        };
    }

    // 第二个功能区参数
    get funcSecondParams() {
        return {
            title: PluginStrings.modeTitle,
            modeList: [
                {
                    key: '3.2-2',
                    title: PluginStrings.ventilation,
                    value: true,
                    img: {
                        on: require('../resources/images/huanQi_on.png'),
                        off: require('../resources/images/huanQi_off.png')
                    }
                },
                {
                    key: '3.2-3',
                    title: PluginStrings.coolDry,
                    value: false,
                    img: {
                        on: require('../resources/images/lgz_on.png'),
                        off: require('../resources/images/lgz_off.png')
                    }
                }
            ]
        };
    }

    // 第三个功能区参数
    get funcThirdParams() {
        return {
            title: PluginStrings.gear,
            modeList: [
                {
                    key: '4.3-1',
                    title: PluginStrings.strong,
                    value: true,
                    img: {
                        on: require('../resources/images/qiang_on.png'),
                        off: require('../resources/images/qiang_off.png')
                    }
                },
                {
                    key: '4.3-2',
                    title: PluginStrings.weak,
                    value: false,
                    img: {
                        on: require('../resources/images/ruo_on.png'),
                        off: require('../resources/images/ruo_off.png')
                    }
                },
            ]
        }
    };

    // 第四个功能区参数
    get funcFourthParams() {
        return {
            title: PluginStrings.windDirection,
            modeList: [
                {
                    key: '4.1-1',
                    title: PluginStrings.auto,
                    value: true,
                    img: {
                        on: require('../resources/images/auto_on.png'),
                        off: require('../resources/images/auto_off.png')
                    }
                },
                {
                    key: '4.1-2',
                    title: PluginStrings.fixed,
                    value: false,
                    img: {
                        on: require('../resources/images/fixed_on.png'),
                        off: require('../resources/images/fixed_off.png')
                    }
                },
            ]
        }
    };

    // 第五个功能区参数
    get funcFifthParams() {
        return {
            title: PluginStrings.windType,
            modeList: [
                {
                    key: '5.2-2',
                    title: PluginStrings.diffuse,
                    value: true,
                    img: {
                        on: require('../resources/images/kuoSan_on.png'),
                        off: require('../resources/images/kuoSan_off.png')
                    }
                },
                {
                    key: '5.2-1',
                    title: PluginStrings.focus,
                    value: false,
                    img: {
                        on: require('../resources/images/jiZhong_on.png'),
                        off: require('../resources/images/jiZhong_off.png')
                    }
                },

            ]
        };
    }

    get PuModeText() {
        let mode = this.state.mode;
        console.log('mode', mode);
        switch (mode) {
            case 0:
                return PluginStrings.standby;
            case 1:
                return PluginStrings.heating;
            case 2:
                return PluginStrings.ventilation;
            case 3:
                return PluginStrings.coolDry;
            case 4:
                return PluginStrings.hotDry;
            default:
                return '--';
        }
    }

    get PuGearText() {
        let gear = this.state.fanLevel;
        switch (gear) {
            case 1:
                return PluginStrings.strong;
            case 2:
                return PluginStrings.weak;
            default:
                return '--';
        }
    }

    get PuWindDirectionText() {
        let direction = this.state.windDirection;
        switch (direction) {
            case 1:
                return PluginStrings.auto;
            case 2:
                return PluginStrings.fixed;
            case 3:
                return PluginStrings.fixed90;
            default:
                return '--';
        }
    }

    get PuWindTypeText() {
        let type = this.state.fanCategory;
        switch (type) {
            case 1:
                return PluginStrings.focus;
            case 2:
                return PluginStrings.diffuse;
            default:
                return '--';
        }
    }

    get PuStateProps() {
        return {
            mode: this.getPuModeText,
            gear: this.getPuGearText,
            windDirection: this.getPuWindDirectionText,
            windType: this.getPuWindTypeText,
        }
    }



    render() {

        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={this.getBackgroundColor()}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 0.6 }}
                    style={styles.gradient}
                >

                </LinearGradient>
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
                />
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    <View style={styles.statusSection}>
                        <PuStateCom PuState={this.PuStateProps} ParticleColor={this.getBackgroundColor()[0]} />
                    </View>

                    <FuncCom params={this.funcFirstParams} onControlPress={this.handleFuncComPress} />

                    <FuncCom params={this.funcSecondParams} onControlPress={this.handleFuncComPress} />

                    <FuncCom params={this.funcThirdParams} onControlPress={this.handleFuncComPress} />

                    <FuncCom params={this.funcFourthParams} onControlPress={this.handleFuncComPress} />

                    <View style={styles.timeContainer}>
                        <TouchableOpacity style={styles.timeItem} onPress={this.openTimerModal}>
                            <Image resizeMode="contain"
                                source={require('../resources/images/timer_icon.png')} style={styles.timerIcon} />
                            <Text style={styles.timerLabel}>{PluginStrings.timer}</Text>
                            <Image resizeMode="contain"
                                source={require('../resources/images/arrow_right.png')}
                                style={styles.arrowIcon} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <TimerModal
                    visible={this.state.timerVisible}
                    options={this.timerOptions}
                    selectedValue={this.state.timerValue}
                    onClose={this.closeTimerModal}
                    onConfirm={this.handleTimerConfirm}
                />
            </View>
        );
    }

}


const styles = StyleSheet.create({
    gradient: {
        // flex: 1,
        // zIndex: -1,
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    container: {
        flex: 1,
        // paddingBottom: 20,
        // backgroundColor: '#F6F6F6'
    },

    statusSection: {
        alignItems: 'center',
        height: 300,
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusText: {
        fontSize: 100,
        fontWeight: 'bold',
        color: "#1F2022",
    },
    contentContainer: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff'
    },
    mb12: {
        marginBottom: 12
    },
    timeContainer: {
        backgroundColor: '#fff',
        marginLeft: 12,
        marginRight: 12,
        borderRadius: 12,
        height: 83,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    timeItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    timerIcon: {
        width: 60,
        height: 60,
        marginLeft: 20,
    },
    timerLabel: {
        fontSize: 18,
        color: '#1F2022',
        marginLeft: 8,
        // flex: 1,
    },
    timerValue: {
        marginTop: 2,
        fontSize: 20,
        color: '#1F2022',
        fontWeight: 'bold',
    },
    arrowIcon: {
        marginLeft: screenWidth - 180,
        width: 10,
        height: 18,
        marginRight: 23,
    }
});

import React from 'react';
import { Device, DeviceEvent, Package, PackageEvent, Service, DarkMode } from 'miot';
import {
    Dimensions,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import NavigationBar from 'miot/ui/NavigationBar';
import TempControl from './CommonModules/TempControl';
import MHCard from 'miot/ui/Card/MHCard';
import Separator from 'miot/ui/Separator';

/**
 * SDK 提供的多语言 和 插件提供的多语言
 */
import { strings as SdkStrings } from 'miot/resources';
import PluginStrings from '../resources/strings';
/**
 * SDK 支持的字体
 */
import OverlayPage from './CommonModules/OverlayPage';

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

let isDark = false;

export default class MainPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            modes: [
                {
                    icon: {
                        normal: require('../resources/images/ziD.png'),
                        press: require('../resources/images/ziD-press.png'),
                        active: require('../resources/images/ziD-active.png'),
                        activeDisabled: require('../resources/images/ziD-activeDisabled.png')
                    },
                    // isDisabled: true,
                    isActive: false,
                    isPressing: false
                }, {
                    icon: {
                        normal: require('../resources/images/zhiL.png'),
                        press: require('../resources/images/zhiL-press.png'),
                        active: require('../resources/images/zhiL-active.png'),
                        activeDisabled: require('../resources/images/zhiL-activeDisabled.png')
                    },
                    // isDisabled: true,
                    isActive: false,
                    isPressing: false
                }, {
                    icon: {
                        normal: require('../resources/images/chuS.png'),
                        press: require('../resources/images/chuS-press.png'),
                        active: require('../resources/images/chuS-active.png'),
                        activeDisabled: require('../resources/images/chuS-activeDisabled.png')
                    },
                    // isDisabled: true,
                    isActive: false,
                    isPressing: false
                }, {
                    icon: {
                        normal: require('../resources/images/zhiR.png'),
                        press: require('../resources/images/zhiR-press.png'),
                        active: require('../resources/images/zhiR-active.png'),
                        activeDisabled: require('../resources/images/zhiR-activeDisabled.png')
                    },
                    // isDisabled: true,
                    isActive: false,
                    isPressing: false
                }, {
                    icon: {
                        normal: require('../resources/images/tongf.png'),
                        press: require('../resources/images/tongf-press.png'),
                        active: require('../resources/images/tongf-active.png'),
                        activeDisabled: require('../resources/images/tongf-activeDisabled.png')
                    },
                    // isDisabled: true,
                    isActive: false,
                    isPressing: false
                }],
            speedList: [
                {
                    description: PluginStrings.auto,
                    icon: {
                        normal: require('../resources/images/ziD.png'),
                        press: require('../resources/images/ziD-press.png'),
                        active: require('../resources/images/ziD-active.png'),
                        activeDisabled: require('../resources/images/ziD-activeDisabled.png')
                    },
                    // isDisabled: true,
                    isActive: false,
                    isPressing: false
                },
                {
                    description: PluginStrings.lowWind,
                    icon: {
                        normal: require('../resources/images/diF.png'),
                        press: require('../resources/images/diF-press.png'),
                        active: require('../resources/images/diF-active.png'),
                        activeDisabled: require('../resources/images/diF-activeDisabled.png')
                    },
                    // isDisabled: true,
                    isActive: false,
                    isPressing: false
                }, {
                    description: PluginStrings.middlingWind,
                    icon: {
                        normal: require('../resources/images/zhongF.png'),
                        press: require('../resources/images/zhongF-press.png'),
                        active: require('../resources/images/zhongF-active.png'),
                        activeDisabled: require('../resources/images/zhongF-activeDisabled.png')
                    },
                    // isDisabled: true,
                    isActive: false,
                    isPressing: false
                }, {
                    description: PluginStrings.highWind,
                    icon: {
                        normal: require('../resources/images/gaoF.png'),
                        press: require('../resources/images/gaoF-press.png'),
                        active: require('../resources/images/gaoF-active.png'),
                        activeDisabled: require('../resources/images/gaoF-activeDisabled.png')
                    },
                    // isDisabled: true,
                    isActive: false,
                    isPressing: false
                }
            ],
            cardItemImg: {
                co2: {
                    online: require('../resources/images/co2_icon.png'),
                    offline: require('../resources/images/co2_offline_icon.png')
                },
                shiDu: {
                    online: require('../resources/images/shidu_icon.png'),
                    offline: require('../resources/images/shidu_offline_icon.png')
                },
                reShui: {
                    online: require('../resources/images/reshui_icon.png'),
                    offline: require('../resources/images/reshui_offline_icon.png')
                },
                time: {
                    online: require('../resources/images/time_icon.png'),
                    offline: require('../resources/images/time_offline_icon.png')
                },
                lx: {
                    online: require('../resources/images/lx_icon.png'),
                    offline: require('../resources/images/lx_offline_icon.png')
                },
                chart: {
                    online: require('../resources/images/chart_icon.png'),
                    offline: require('../resources/images/chart_offline_icon.png')
                },
                elec: {
                    online: require('../resources/images/elec_icon.png'),
                    offline: require('../resources/images/elec_offline_icon.png')
                }
            },
            isSendData: false,
            parseDataTimer: null,
            acceptData: {},
            queryData: [
                { did: Device.deviceID, siid: 1, piid: 3 },
                { did: Device.deviceID, siid: 2, piid: 1 },
                { did: Device.deviceID, siid: 2, piid: 2 },
                { did: Device.deviceID, siid: 2, piid: 3 },
                { did: Device.deviceID, siid: 2, piid: 4 },
                { did: Device.deviceID, siid: 2, piid: 5 },
                { did: Device.deviceID, siid: 2, piid: 6 },
                { did: Device.deviceID, siid: 2, piid: 7 },
                { did: Device.deviceID, siid: 2, piid: 8 },
                { did: Device.deviceID, siid: 3, piid: 1 },
                { did: Device.deviceID, siid: 4, piid: 1 },
                { did: Device.deviceID, siid: 4, piid: 2 },
                { did: Device.deviceID, siid: 4, piid: 3 },
                { did: Device.deviceID, siid: 4, piid: 4 },
                { did: Device.deviceID, siid: 4, piid: 5 },
                { did: Device.deviceID, siid: 5, piid: 7 },
                { did: Device.deviceID, siid: 5, piid: 9 },
                { did: Device.deviceID, siid: 5, piid: 10 },
                { did: Device.deviceID, siid: 5, piid: 11 },
                { did: Device.deviceID, siid: 6, piid: 1 },
                { did: Device.deviceID, siid: 6, piid: 2 },
                { did: Device.deviceID, siid: 6, piid: 3 },
                { did: Device.deviceID, siid: 6, piid: 4 },
                { did: Device.deviceID, siid: 6, piid: 5 },
                { did: Device.deviceID, siid: 6, piid: 6 },
                { did: Device.deviceID, siid: 6, piid: 7 },
                { did: Device.deviceID, siid: 6, piid: 8 },
                { did: Device.deviceID, siid: 6, piid: 9 },
                { did: Device.deviceID, siid: 6, piid: 10 },
                { did: Device.deviceID, siid: 6, piid: 12 },
                { did: Device.deviceID, siid: 6, piid: 13 },
                { did: Device.deviceID, siid: 6, piid: 14 },
                { did: Device.deviceID, siid: 6, piid: 15 },
                { did: Device.deviceID, siid: 6, piid: 16 }
            ],
            comType: 'error',
            comData: {},
            options: [1, 2, 3],
            progress: 100,
            overlayVisible: false,
            power: false,
            mode: 0,
            fault102: 0,
            fault103: 0,
            tempNum: 16,
            humiNum: 10,
            fault104: 0,
            fault105: 0,
            // fault106: 0,
            fanNum: 0,
            snTemp: 0,
            snHumi: 0,
            snCO2: 0,
            snPM25: 0,
            snTVOC: 0,
            setHotWater: 0,
            setCo2: 0,
            CFilterTime: 30, // 初级滤芯剩余时间
            setCFilterTime: 100, // 设置低级滤芯寿命
            GFilterTime: 0, // 高级滤芯剩余寿命
            setGFilterTime: 0, // 设置高级滤芯寿命
            hotWater: 0,
            tempCalibration: 0,
            humiCalibration: 0,
            hotWaterState: false,
            queryNum: 0,
            queryArr: [],
            isDark: false,
            sendTempTimer: 0
        };
    }

    // 优：低于600ppm  良：600-800  轻度：800-1000  中度：1000-1500  严重：超过1500
    get co2Grade() {
        let num = this.state.setCo2;
        if (!num) {
            return '';
        }
        if (num <= 600) {
            return PluginStrings.rate1;
        } else if (num > 600 && num <= 800) {
            return PluginStrings.rate2;
        } else if (num > 800 && num <= 1000) {
            return PluginStrings.rate3;
        } else if (num > 1000 && num <= 1200) {
            return PluginStrings.rate4;
        } else if (num > 1200 && num <= 1500) {
            return PluginStrings.rate5;
        } else if (num >= 1500) {
            return PluginStrings.rate6;
        } else {
            return '';
        }
    }

    get modeText() {
        let mode = this.state.mode;
        if (mode === 0) {
            return PluginStrings.auto;
        } else if (mode === 1) {
            return PluginStrings.cool;
        } else if (mode === 2) {
            return PluginStrings.dry;
        } else if (mode === 3) {
            return PluginStrings.heat;
        } else if (mode === 4) {
            return PluginStrings.ventilation;
        } else {
            return '';
        }
    }

    get SpeedText() {
        let speed = this.state.fanNum;
        if (speed === 0) {
            return PluginStrings.auto;
        } else if (speed === 1) {
            return PluginStrings.lowWind;
        } else if (speed === 2) {
            return PluginStrings.middlingWind;
        } else if (speed === 3) {
            return PluginStrings.highWind;
        } else {
            return '';
        }
    }

    get getBgImg() {
        let power = this.state.power;
        if (power) {
            return require('../resources/images/online_bg.png');
        } else {
            return require('../resources/images/offline_bg.png');
        }
    }

    get offlineClass() {
        return this.state.power ? '' : styles.disabledStyle;
    }

    get CardListImg() {
        return {};
    }

    // 开关的图片
    get powerText() {
        return this.state.power ? PluginStrings.powerOff : PluginStrings.powerOn;
    }

    // 开关的图片
    get powerImg() {
        return this.state.power ? require('../resources/images/power_on.png') : require('../resources/images/power_off.png');
    }

    get filterTips() {
        let cTime = this.state.CFilterTime ?? 0;
        let setCTime = this.state.setCFilterTime ?? 0;
        let gTime = this.state.GFilterTime ?? 0;
        let setGTime = this.state.setGFilterTime ?? 0;
        let CRatio = cTime ? Math.round(cTime * 100 / setCTime) : 0;
        let GRatio = gTime ? Math.round(gTime * 100 / setGTime) : 0;
        CRatio = CRatio > 100 ? 100 : CRatio;
        GRatio = GRatio > 100 ? 100 : GRatio;
        return PluginStrings.filterTips.replace('XX', CRatio).replace('YY', GRatio);
    }

    get ErrorMsg() {
        let fault102 = this.state.fault102;
        let fault103 = this.state.fault103;
        let fault104 = this.state.fault104;
        // let fault105 = this.state.fault105;
        let msg = [];

        // 102
        if (fault102) {
            let fault_102_2 = parseInt(fault102).toString(2).padStart(16, '0').split('').reverse().join('');
            for (let i in fault_102_2) {
                if (fault_102_2[i] === '1') {
                    msg.push(PluginStrings[`error1.${i}`]);
                }
                i++;
            }
        }
        // 103
        if (fault103) {
            let fault_103_2 = parseInt(fault103).toString(2).padStart(16, '0').split('').reverse().join('');
            for (let i in fault_103_2) {
                if (fault_103_2[i] === '1') {
                    if (msg.includes(PluginStrings[`error2.${i}`])) {
                        continue;
                    } else {
                        msg.push(PluginStrings[`error2.${i}`]);
                    }
                }
                i++;
            }
        }
        // 104
        if (fault104) {
            let fault_104_2 = parseInt(fault104).toString(2).padStart(16, '0').split('').reverse().join('');
            for (let i in fault_104_2) {
                if (fault_104_2[i] === '1') {
                    if (i === '1' || i === '3') {
                        continue;
                    } else if (i === '0' || i === '2' || i === '15') {
                        // 只需要初效, 高效故障提示
                        msg.push(PluginStrings[`error3.${i}`]);
                    }
                }
                i++;
            }
        }
        // 105 分屏故障
        // if (fault105) {
        //   let fault_105_2 = parseInt(fault105).toString(2).padStart(16, '0').split('').reverse().join('');
        //   for (let i in fault_105_2) {
        //     if (fault_105_2[i] === '1') {
        //       msg.push(PluginStrings[`error4.${ i }`]);
        //     }
        //     i++;
        //   }
        // }
        return msg;
    }

    get hotWaterRightTxt() {
        let hotWaterState = this.state.hotWaterState;
        if (hotWaterState) {
            return `${this.state.setHotWater}°C`;
        } else {
            return PluginStrings.hotWaterOff;
        }
    }

    parseByteToValue(byte) {
        // 获取符号位 (bit7)
        let signBit = (byte & 0x80) >> 7; // 最高位 (bit7)

        // 获取数值部分 (bit6-0)
        let value = byte & 0x7F; // 低7位 (bit6-0)

        // 根据符号位判断是负数还是正数
        if (signBit === 1) {
            value = -value; // 如果符号位为1，则是负数
        }

        return value / 10;
    }

    get getSnTemp() {
        let snTemp = this.state.snTemp ?? 0;
        let tempCalibration = this.state.tempCalibration ?? 0;
        // tempCalibration = this.convertToBytes(tempCalibration);
        return this.formatNumber(parseFloat(snTemp) + parseFloat(tempCalibration));
    }

    get getSnHumi() {
        let snHumi = this.state.snHumi ?? 0;
        let humiCalibration = this.state.humiCalibration ?? 0;
        // humiCalibration = this.convertToBytes(humiCalibration);
        let h = this.formatNumber(parseFloat(snHumi) + parseFloat(humiCalibration));
        return h > 0 ? h : 0;
    }

    formatNumber(value) {
        const num = parseFloat(value); // 转换为数字
        if (!num || isNaN(num)) {
            return "--";
        }
        return Number.isInteger(num) ? num : num.toFixed(1);
        // return Number.isInteger(num) ? num : num.toFixed(1);
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

    componentWillUnmount() {
        // 取消监听
        this.packageAuthorizationAgreed && this.packageAuthorizationAgreed.remove();

        this.removeListener();
    }

    UNSAFE_componentWillMount() {
        this.packageAuthorizationAgreed = PackageEvent.packageAuthorizationAgreed.addListener(() => {
            // 隐私弹窗-用户点击同意
            console.log('user agree protocol...');
        });

        isDark = DarkMode.getColorScheme() === 'dark' ? true : false;

        console.log('isDark====componentWillMount', isDark, DarkMode.getColorScheme());

        console.log('isDark====UNSAFE_componentWillMount', isDark, DarkMode.getColorScheme());

        console.log('DarkMode.getColorScheme', DarkMode.getColorScheme());

        this.addListener();

        let queryArr = this.state.queryData;
        let arr_10 = this.splitArray(queryArr, 10);
        let arr_num = arr_10.length;

        this.setState({
            queryArr: arr_10,
            queryNum: arr_num - 1
        });

        // console.log('=========', arr_10[arr_10.length -1], arr_10.length);

        this.getDevicePropsValue(arr_10[arr_10.length - 1]);
    }

    // 拆分数组
    splitArray(arr, chunkSize) {
        return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (v, i) =>
            arr.slice(i * chunkSize, i * chunkSize + chunkSize)
        );
    }


    getDevicePropsValue(arr) {
        //   console.log('getDevicePropsValue', arr);
        /**
                                                             * 这里的 siid 和 piid 的获取，可以通过解析 getSpecString 获取的spec信息， 也可以通过开发者平台上查询该设备对应的设备属性 siid 和 piid值
                                                             */
        // let params = this.state.queryData;
        //  'prop.6.1', 'prop.7.1', 'prop.7.2'
        const datasource = 1;
        Service.spec.getPropertiesValue(arr, datasource).then((res) => {
            // console.log('getPropertiesValue', res)
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

            this.forceUpdate();
        }).catch((error) => {
            console.log('getPropertiesValue error ', error);
        });
        this.forceUpdate();
    }

    addListener() {

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

        // let subscribeDataStr = subscribeData.join(',');
        // console.log(subscribeDataStr)
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
                console.log('=====deviceReceivedMessages', data, that.state.isSendData, new Date());
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

        this._deviceNameChangedListener = DeviceEvent.deviceNameChanged.addListener((device) => {
            this.props.navigation.setParams({
                name: device.name
            });
            this.forceUpdate();
        });
    }
    //   取消监听
    removeListener() {
        // 取消监听 隐私权限
        this.mPackageAuthorizationAgreed && this.mPackageAuthorizationAgreed.remove();
        // 取消订阅
        this.mSubcription && this.mSubcription.remove();
        // 取消监听
        this.mDeviceReceivedMessages && this.mDeviceReceivedMessages.remove();

        this.mDarkModeListener && DarkMode.removeChangeListener(this.mDarkModeListener);

        this._deviceNameChangedListener && this._deviceNameChangedListener.remove();
    }

    parseData = (key, iData) => {
        console.log('parseData', key, iData);
        // if (iData) {

        switch (key) {
            // 开关
            case '2.1':
                this.setState({
                    power: iData
                });
                break;
            // 模式
            case '2.2':
                // 0: 自动
                // 1: 制冷
                // 2: 除湿
                // 3: 制热
                // 4: 通风
                this.setState({
                    mode: iData
                });
                this.changeMode('modes', iData);
                break;
            // 故障102
            case '2.3':
                this.setState({
                    fault102: iData
                });
                break;
            // 设定温度
            case '2.4':
                this.setState({
                    tempNum: iData ?? 0
                });
                break;
            // 设定湿度
            case '2.5':
                this.setState({
                    humiNum: iData
                });
                break;
            // 故障103
            case '2.6':
                this.setState({
                    fault103: iData
                });
                break;
            // 故障104
            case '2.7':
                this.setState({
                    fault104: iData
                });
                break;
            // 故障105
            case '2.8':
                this.setState({
                    fault105: iData
                });
                break;
            // 风机档位
            case '3.1':
                // 0: 自动
                // 1: 低风
                // 2: 中风
                // 3: 高风
                this.setState({
                    fanNum: iData
                });
                this.changeMode('speedList', iData);
                break;
            // 室内温度
            case '4.1':
                this.setState({
                    snTemp: iData ?? 0
                });
                break;
            // 室内湿度
            case '4.2':
                this.setState({
                    snHumi: iData
                });
                break;
            // 室内CO2浓度
            case '4.3':
                this.setState({
                    snCO2: iData
                });
                break;
            // 室内PM2.5浓度
            case '4.4':
                this.setState({
                    snPM25: iData
                });
                break;
            // 室内TVOC浓度
            case '4.5':
                this.setState({
                    snTVOC: iData
                });
                break;
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
            // 设定CO2浓度
            case '6.1':
                this.setState({
                    setCo2: iData ?? 0
                });
                break;
            // 设定热水温度值
            case '6.2':
                this.setState({
                    setHotWater: iData ?? 0
                });
                break;
            // 热水水温
            case '6.13':
                this.setState({
                    hotWater: iData
                });
                break;
            // 温度校准
            case '6.14':
                // console.log('iData', iData, this.parseByteToValue(iData));

                this.setState({
                    tempCalibration: this.parseByteToValue(iData)
                });
                break;
            // 湿度校准
            case '6.15':
                this.setState({
                    humiCalibration: this.parseByteToValue(iData) * 10
                });
                break;
            // 热水开关
            case '6.16':
                this.setState({
                    hotWaterState: iData
                });
                break;
        }

        // }
    };

    pressInDemo = (index, key) => {
        // 判断是否关机
        if (!this.state.power) {
            return;
        }
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

    pressDemo = (index, key) => {
        // 判断是否关机
        if (!this.state.power) {
            return;
        }
        this.setState((state) => {
            let modes = state[key];
            let theMode = modes[index];
            theMode.isPressing = false;

            let siid = 2;
            let piid = 2;
            if (theMode.isDisabled) {
                // 该模式不可点或已高亮
                return;
            }
            if (key === 'modes') {
                // 正常模式
                state.modes.forEach((mode) => {
                    mode.isActive = false;
                });
                state.mode = index;
                siid = 2;
                piid = 2;
            } else if (key === 'speedList') {
                // 风速模式
                state.speedList.forEach((mode) => {
                    mode.isActive = false;
                });
                state.fanNum = index;
                siid = 3;
                piid = 1;
            }
            let params = [
                { did: Device.deviceID, siid: siid, piid: piid, value: index }
            ];
            this.setPropertiesValue(params);
            theMode.isActive = true;
        });
    };

    // 删除所有按钮的上iPressing
    clearAllPressing = () => {
        this.setState((state) => {
            let modes = state['modes'];
            state.modes.forEach((mode) => {
                mode.isPressing = false;
            });
            return { modes: modes };
        });


        this.setState((state) => {
            let speedList = state['speedList'];
            state.speedList.forEach((item) => {
                item.isPressing = false;
            });
            return { speedList: speedList };
        });
        //   this.forceUpdate();
    };

    // 定时设置
    openTimer = () => {
        const SET_PROPERTIES = "set_properties";
        // 用户选择定时开机的参数
        const SET_PROPERTIES_ON = [{ did: Device.deviceID, siid: 2, piid: 1, value: true }];
        // 用户选择定时关机的参数
        const SET_PROPERTIES_OFF = [{ did: Device.deviceID, siid: 2, piid: 1, value: false }];
        const params = {
            onMethod: SET_PROPERTIES,
            onParam: SET_PROPERTIES_ON,
            offMethod: SET_PROPERTIES,
            offParam: SET_PROPERTIES_OFF
        };

        Service.scene.openTimerSettingPageWithOptions(params);
    };

    setTemp = (val) => {
        let params = [
            { did: Device.deviceID, siid: 2, piid: 4, value: parseFloat(val) }
        ];
        this.setState({
            tempNum: val
        });
        clearTimeout(this.state.sendTempTimer);
        clearTimeout(this.state.sendTempTimer);
        let that = this;
        this.setState({
            sendTempTimer: setTimeout(() => {
                that.setPropertiesValue(params);
            }, 300)
        });

    };

    setPropertiesValue(params) {
        console.log('setPropertiesValue', params);

        Service.spec.setPropertiesValue(params).then(() => {
            // console.log('setPropertiesValue success ', res);
            this.setState(() => ({
                isSendData: true
            }));

        }).catch((error) => {
            console.log('setPropertiesValue error ', error);
        });
    }

    hideOverlayVisible = () => {
        this.setState({ overlayVisible: false });
    };

    showCardCom = (type) => {
        if (!this.state.power && type === 'co2') {
            return;
        }
        this.setState({
            overlayVisible: true,
            comType: type
        });
    };

    get comData() {
        let type = this.state.comType;
        if (type === 'humi') {
            return {
                humi: this.state.humiNum
            };
        } else if (type === 'hotWater') {
            return {
                setHotWater: this.state.setHotWater,
                hotWater: this.state.hotWater,
                hotWaterState: this.state.hotWaterState,
                isFeature: true
            };
        } else if (type === 'co2') {
            return {
                co2: this.state.setCo2
            };
        } else if (type === 'error') {
            return {
                errorMsg: this.ErrorMsg
            };
        } else {
            return {};
        }
    }

    confirmCom = (value) => {
        let params = [];
        if (this.state.comType === 'humi') {
            params = [
                { did: Device.deviceID, siid: 2, piid: 5, value: value }
            ];
            this.setState({
                humiNum: value
            });
        } else if (this.state.comType === 'hotWater') {
            params = [
                //   { did: Device.deviceID, siid: 6, piid: 2, value: value },
                { did: Device.deviceID, siid: 6, piid: 16, value: true }
            ];
            this.setState({
                setHotWater: value
            });
        } else if (this.state.comType === 'co2') {
            params = [
                { did: Device.deviceID, siid: 6, piid: 1, value: value }
            ];
            this.setState({
                setCo2: value
            });
        }
        this.setPropertiesValue(params);
        this.hideOverlayVisible();
    };

    cancelCom = () => {
        this.hideOverlayVisible();
    };

    jumpFilter = () => {
        this.props.navigation.navigate('FilterPage', {
            CFilterTime: this.state.CFilterTime, // 初级滤芯剩余时间
            setCFilterTime: this.state.setCFilterTime, // 设置低级滤芯寿命
            GFilterTime: this.state.GFilterTime, // 高级滤芯剩余寿命
            setGFilterTime: this.state.setCFilterTime // 设置高级滤芯寿命
        });
    };

    jumpChart = () => {
        this.props.navigation.navigate('ChartPage');
    };

    jumpElec = () => {
        this.props.navigation.navigate('ElecPage');
    };

    getCardImg = (key) => {
        let status = this.state.power ? 'online' : 'offline';
        if (key === 'co2') {
            return this.state.cardItemImg[key]?.[status] || null;
        } else {
            return this.state.cardItemImg[key]?.['online'] || null;
        }
    };

    // 修改图片样式
    changeMode(key, index) {
        console.log('key', key, index);

        if (index >= 0) {
            this.setState((state) => {
                if (Array.isArray(state[key])) {
                    if (state[key]) {
                        console.log('state[key]', state[key]);
                        state[key].forEach((mode) => {
                            mode.isActive = false;
                        });
                        let modes = state[key];
                        let theMode = modes[index];
                        theMode.isActive = true;
                    }

                }

            });
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground style={styles.bg} resizeMode="cover"
                    source={this.getBgImg}>
                    {/* 头部 */}
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

                    <ScrollView style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={() => {
                            this.clearAllPressing();
                        }}>
                        <View style={[styles.puMsg, this.offlineClass]}>
                            <View style={styles.tempContainer}>
                                <Text style={styles.tempInfo}>
                                    {this.state.tempNum}
                                </Text>
                                <Text style={styles.tempUnit}>℃</Text>
                            </View>
                            <View style={styles.modeContainer}>
                                <Text style={styles.modeText}>
                                    {this.modeText}
                                </Text>
                                <View style={styles.modeDivider}></View>
                                <Text style={styles.speedText}>
                                    {this.SpeedText}
                                </Text>
                            </View>
                            <View style={[styles.puParam]}>
                                <View style={styles.puParamRow}>
                                    <View style={styles.puParamItem}>
                                        <Text style={[styles.puParamValue, { color: isDark ? 'xmrgba(255, 255, 255, .8)' : 'rgba(28, 34, 41, .8)' }]}>
                                            {this.getSnTemp}
                                        </Text>
                                        <Text style={[styles.puParamName, { color: isDark ? 'xmrgba(255, 255, 255, .6)' : 'rgba(28, 34, 41, .6)' }]}>
                                            {PluginStrings.snTemp}(℃)
                                        </Text>
                                    </View>
                                    <View style={styles.puParamDivider}></View>
                                    <View style={styles.puParamItem}>
                                        <Text style={[styles.puParamValue, { color: isDark ? 'xmrgba(255, 255, 255, .8)' : 'rgba(28, 34, 41, .8)' }]}>
                                            {this.getSnHumi}
                                        </Text>
                                        <Text style={[styles.puParamName, { color: isDark ? 'xmrgba(255, 255, 255, .6)' : 'rgba(28, 34, 41, .6)' }]}>
                                            {PluginStrings.snHumi}(%)
                                        </Text>
                                    </View>
                                </View>
                                <View style={[styles.puParamRow, styles.mt12]}>
                                    <View style={styles.puParamItem}>
                                        <Text style={[styles.puParamValue, { color: isDark ? 'xmrgba(255, 255, 255, .8)' : 'rgba(28, 34, 41, .8)' }]}>
                                            {this.state.snCO2}
                                        </Text>
                                        <View>
                                            <Text style={[styles.puParamName, { color: isDark ? 'xmrgba(255, 255, 255, .6)' : 'rgba(28, 34, 41, .6)' }]}>
                                                {PluginStrings.snCo2}</Text>
                                            <Text style={[styles.puParamName, { color: isDark ? 'xmrgba(255, 255, 255, .6)' : 'rgba(28, 34, 41, .6)' }]}>(ppm)
                                            </Text>
                                        </View>

                                    </View>
                                    <View style={styles.puParamDivider}></View>
                                    <View style={styles.puParamItem}>
                                        <Text style={[styles.puParamValue, { color: isDark ? 'xmrgba(255, 255, 255, .8)' : 'rgba(28, 34, 41, .8)' }]}>
                                            {this.state.snPM25}
                                        </Text>
                                        <View>
                                            <Text style={[styles.puParamName, { color: isDark ? 'xmrgba(255, 255, 255, .6)' : 'rgba(28, 34, 41, .6)' }]}>
                                                {PluginStrings.snPm25}</Text>
                                            <Text style={[styles.puParamName, { color: isDark ? 'xmrgba(255, 255, 255, .6)' : 'rgba(28, 34, 41, .6)' }]}>(μg/m³)
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.puParamDivider}></View>
                                    <View style={styles.puParamItem}>
                                        <Text style={[styles.puParamValue, { color: isDark ? 'xmrgba(255, 255, 255, .8)' : 'rgba(28, 34, 41, .8)' }]}>
                                            {this.state.snTVOC}
                                        </Text>
                                        <View>
                                            <Text style={[styles.puParamName, { color: isDark ? 'xmrgba(255, 255, 255, .6)' : 'rgba(28, 34, 41, .6)' }]}>
                                                {PluginStrings.snTvoc}</Text>
                                            <Text style={[styles.puParamName, { color: isDark ? 'xmrgba(255, 255, 255, .6)' : 'rgba(28, 34, 41, .6)' }]}>(mg/m³)
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* 故障 */}
                        {this.ErrorMsg.length > 0 &&
                            <View style={[styles.errorCom, this.offlineClass]}>
                                <MHCard
                                    title={this.ErrorMsg.join('、')}
                                    icon={require('../resources/images/error_icon.png')}
                                    iconStyle={styles.errorIcon}
                                    style={[{
                                        width: '100%', height: 60, paddingTop: 0, paddingBottom: 0, overflow: 'hidden'
                                    }, styles.errorComItem]}
                                    iconContainerStyle={styles.errorIcon}
                                    cardType={MHCard.CARD_TYPE.NONE}
                                    cardRadiusType={MHCard.CARD_RADIUS_TYPE.ALL}
                                    onPress={() => this.showCardCom('error')}
                                />
                            </View>
                        }
                        {/* 开关机 */}

                        <View style={[styles.cardContainer, styles.powerCom, styles.mt12]}>
                            <TouchableOpacity style={[]} onPress={() => {
                                this.setPropertiesValue([{ did: Device.deviceID, siid: 2, piid: 1, value: !this.state.power }]);
                            }}>
                                <Image
                                    style={styles.powerIcon}
                                    source={this.powerImg}
                                    onPress={() => {
                                        // this.setPropertiesValue([{ did: Device.deviceID, siid: 2, piid: 1, value: true }])
                                    }}
                                    resizeMode="cover" />
                            </TouchableOpacity>
                            <Text style={styles.powerText}>{this.powerText}</Text>
                        </View>

                        {/* 模式 */}
                        <View style={[styles.cardContainer, styles.mt12, this.offlineClass]}>
                            <View style={styles.cardTop}>
                                <Text style={styles.cardTopTitle}>{PluginStrings.mode}</Text>
                                <View style={styles.cardTopDivider}></View>
                                <Text style={styles.cardTopSubTitle}>{this.modeText
                                }</Text>
                            </View>
                            <View
                                style={styles.cardIconList}>
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
                                            <Image resizeMode="contain" style={styles.cardModeItem}
                                                source={element.isActive ? element.icon.active : element.isPressing ? element.icon.press : element.icon.normal}></Image>
                                        </View>
                                    </TouchableWithoutFeedback>
                                ))}
                            </View>
                        </View>
                        {/* 温度调节 */}
                        <View style={[styles.cardContainer, styles.mt12, this.offlineClass]}>
                            <View style={styles.cardTop}>
                                <Text style={styles.cardTopTitle}>{PluginStrings.tempTitle}</Text>
                                <View style={styles.cardTopDivider}></View>
                                <Text style={styles.cardTopSubTitle}>{this.state.tempNum}℃</Text>
                            </View>
                            {/* 通风，除湿模式下不能控制温度 */}
                            <TempControl style={styles.humidityCom} tempNum={this.state.tempNum} isDisabled={!this.state.power || this.state.mode === 4 || this.state.mode === 2}
                                setValue={this.setTemp}></TempControl>
                        </View>

                        {/* 风速 */}
                        <View style={[styles.cardContainer, styles.mt12, this.offlineClass]}>
                            <View style={styles.cardTop}>
                                <Text style={styles.cardTopTitle}>{PluginStrings.fanSpeedAdjustment}</Text>
                                <View style={styles.cardTopDivider}></View>
                                <Text style={styles.cardTopSubTitle}>{this.SpeedText}</Text>
                            </View>
                            <View
                                style={styles.cardIconList}>
                                {this.state.speedList.map((element, index) => (
                                    <TouchableWithoutFeedback
                                        onPressIn={() => {
                                            this.pressInDemo(index, 'speedList');
                                        }}
                                        onPressOut={() => {
                                            this.pressOutDemo(index, 'speedList');
                                        }}
                                        onPress={() => {
                                            this.pressDemo(index, 'speedList');
                                        }}
                                        key={index}
                                    >
                                        <View style={styles.modeItem}>
                                            <Image resizeMode="contain" style={styles.cardModeItem}
                                                source={element.isActive ? element.icon.active : element.isPressing ? element.icon.press : element.icon.normal}></Image>
                                            <Text
                                                style={[styles.modeItemText, element.isActive && styles.modeItemActiveText]}>{element.description}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                ))}
                            </View>
                        </View>
                        {/* 功能列 */}
                        <View style={[styles.MHCardList, styles.mt12]}>
                            <MHCard
                                style={[{ width: '100%' }, this.offlineClass]}
                                title={PluginStrings.setCo2}
                                rightText={this.co2Grade}
                                rightTextStyle={styles.MHCardItemRightText}
                                icon={this.getCardImg('co2')}
                                cardType={MHCard.CARD_TYPE.NORMAL}
                                cardRadiusType={MHCard.CARD_RADIUS_TYPE.TOP}
                                onPress={() => this.showCardCom('co2')}
                            />
                            <Separator style={styles.MHCardSeparator} />
                            <MHCard
                                style={{ wdith: '100%' }}
                                title={PluginStrings.setHumi}
                                rightText={`${this.state.humiNum}%`}
                                rightTextStyle={styles.MHCardItemRightText}
                                icon={this.getCardImg('shiDu')}
                                cardType={MHCard.CARD_TYPE.NORMAL}
                                cardRadiusType={MHCard.CARD_RADIUS_TYPE.NONE}
                                onPress={() => this.showCardCom('humi')}
                            />
                            <Separator style={styles.MHCardSeparator} />
                            <MHCard
                                style={{ wdith: '100%' }}
                                title={PluginStrings.setHotWater}
                                rightText={`${this.hotWaterRightTxt}`}
                                rightTextStyle={styles.MHCardItemRightText}
                                icon={this.getCardImg('reShui')}
                                cardType={MHCard.CARD_TYPE.NORMAL}
                                cardRadiusType={MHCard.CARD_RADIUS_TYPE.NONE}
                                onPress={() => this.showCardCom('hotWater')}
                            />
                            <Separator style={styles.MHCardSeparator} />
                            <MHCard
                                style={{ wdith: '100%' }}
                                title={PluginStrings.setTime}
                                rightText={PluginStrings.goToSettings}
                                rightTextStyle={styles.MHCardItemRightText}
                                icon={this.getCardImg('time')}
                                cardType={MHCard.CARD_TYPE.NORMAL}
                                cardRadiusType={MHCard.CARD_RADIUS_TYPE.NONE}
                                onPress={() => this.openTimer()}
                            />
                            <Separator style={styles.MHCardSeparator} />
                            <MHCard
                                style={{ wdith: '100%' }}
                                title={PluginStrings.setFilter}
                                subtitle={this.filterTips}
                                subtitleStyle={styles.MHCardItemSubTitle}
                                rightText=""
                                rightTextStyle={styles.MHCardItemRightText}
                                icon={this.getCardImg('lx')}
                                cardType={MHCard.CARD_TYPE.NORMAL}
                                cardRadiusType={MHCard.CARD_RADIUS_TYPE.NONE}
                                onPress={() => this.jumpFilter()}
                            />
                            <Separator style={styles.MHCardSeparator} />
                            <MHCard
                                style={{ wdith: '100%' }}
                                title={PluginStrings.snChart}
                                rightText={PluginStrings.goToView}
                                rightTextStyle={styles.MHCardItemRightText}
                                icon={this.getCardImg('chart')}
                                cardType={MHCard.CARD_TYPE.NORMAL}
                                cardRadiusType={MHCard.CARD_RADIUS_TYPE.NONE}
                                onPress={() => this.jumpChart()}
                            />
                            {/* 
                                <Separator style={styles.MHCardSeparator} />
                                <MHCard
                                style={{ wdith: '100%' }}
                                title={PluginStrings.powerUsage}
                                rightText={PluginStrings.goToView}
                                rightTextStyle={styles.MHCardItemRightText}
                                icon={this.getCardImg('elec')}
                                cardType={MHCard.CARD_TYPE.NORMAL}
                                cardRadiusType={MHCard.CARD_RADIUS_TYPE.BOTTOM}
                                onPress={() => this.jumpElec()}
                            />
                             */}
                        </View>
                    </ScrollView>
                </ImageBackground>

                {/* 弹窗 */}
                {this.state.overlayVisible &&
                    <OverlayPage comData={this.comData} comType={this.state.comType} confirm={this.confirmCom}
                        close={this.cancelCom} hide={this.hideOverlayVisible}></OverlayPage>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: SdkStyles.common.backgroundColor,
        flex: 1,
        // height: screenHeight,
        backgroundColor: '#F7F7F7'
    },
    bg: {
        flex: 1,
        height: 486
    },
    puMsg: {
        // flex: 1
    },
    errorCom: {
        marginTop: 20,
        marginLeft: 12,
        width: screenWidth - 24,
        overflow: 'hidden',
        // backgroundColor: '#fff',
        borderRadius: 12
        // backgroundColor: '#000',
        // borderRadius: 12
    },
    errorComItem: {
        overflow: 'hidden',
        paddingTop: 0,
        paddingBottom: 0
    },
    errorIcon: {
        width: 40,
        height: 40,
        borderRadius: 0
        // backgroundColor: '#FF0000'
    },
    errText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000000',
        marginLeft: 13
    },
    rightArrow: {
        width: 6.95,
        height: 12
    },
    powerCom: {
        marginTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    powerIcon: {
        width: 40,
        height: 40
    },
    powerText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000000',
        marginLeft: 13
    },
    tempContainer: {
        justifyContent: 'center',
        // alignItems: 'center',
        marginTop: 56,
        flexDirection: 'row'
    },
    tempInfo: {
        fontSize: 86,
        textAlign: 'center',
        marginLeft: 16,
        position: 'relative'
    },
    tempUnit: {
        fontSize: 16,
        color: '#000',
        marginTop: 20

    },
    modeContainer: {
        alignContent: 'center',
        justifyContent: 'center',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        marginTop: -10
    },
    modeDivider: {
        width: 1,
        height: '100%',
        backgroundColor: '#000',
        marginLeft: 15,
        marginRight: 15
    },
    modeText: {
        width: 100,
        textAlign: 'right',
        fontSize: 16
    },
    speedText: {
        width: 100,
        textAlign: 'left',
        fontSize: 16
    },
    puParam: {
        marginTop: 120
    },
    puParamRow: {
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%'
    },
    puParamItem: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    puParamValue: {
        fontSize: 34,
        color: 'rgba(28, 34, 41, .8)'
    },
    puParamName: {
        fontSize: 12,
        color: 'rgba(28, 34, 41, .6)',
        textAlign: 'center'
    },
    puParamDivider: {
        width: 1,
        height: 43,
        backgroundColor: "#D5D5D5",
        marginLeft: 20,
        marginRight: 20
    },
    mt12: {
        marginTop: 12
    },
    cardContainer: {
        marginLeft: 12,
        width: screenWidth - 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        overflow: 'hidden'
    },
    cardTop: {
        paddingTop: 17,
        paddingLeft: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    cardTopTitle: {
        fontWeight: 'bold',
        fontSize: 14
    },
    cardTopDivider: {
        width: 1,
        height: 14,
        backgroundColor: '#ccc',
        marginLeft: 10,
        marginRight: 10
    },
    cardTopSubTitle: {
        fontSize: 14
        // color: '#999999'
    },
    cardIconList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 24,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 28
    },
    cardModeItem: {
        width: 50,
        height: 50
    },
    modeItemText: {
        color: '#999999',
        textAlign: 'center',
        marginTop: 8,
        fontSize: 13
    },
    modeItemActiveText: {
        color: '#447EF2'
    },
    humidityCom: {},
    MHCardList: {
        marginLeft: 12,
        width: screenWidth - 24,
        overflow: 'hidden',
        marginBottom: 20,
        // backgroundColor: '#fff',
        borderRadius: 12
    },
    MHCardSeparator: {
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#E5E5E5'
    },
    MHCardItemRightText: {
        color: 'rgba(0, 0, 0, 0.4)',
        fontSize: 13
    },
    MHCardItemSubTitle: {
        fontSize: 13,
        color: 'rgba(0, 0, 0, 0.4)'
    },
    disabledStyle: {
        opacity: 0.6
    },
    darkMode: {
        color: 'xm#FFFFFF'
    }
});

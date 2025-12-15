import React from 'react';
import { Package, Host, Device, PackageEvent, Service, DeviceEvent, DarkMode } from 'miot';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Dimensions } from 'react-native';
import NavigationBar from 'miot/ui/NavigationBar';
import Separator from 'miot/ui/Separator';
import { AbstractDialog, ListItemWithSlider, ListItemWithSwitch, SlideGear } from 'mhui-rn';

/**
 * SDK 提供的多语言 和 插件提供的多语言
 */
import { strings as SdkStrings, Styles as SdkStyles } from 'miot/resources';
import PluginStrings from '../resources/strings';
/**
 * SDK 支持的字体
 */

import SliderCom from './component/SliderCom';
import ModeCom from './component/ModeCom';
import FuncCom from './component/FuncCom';
import BottomCom from './component/BottomCom';
import DialogCom from './component/DialogCom';
import PuDataCom from './component/PuDataCom';

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

/**
 * wifi 类型设备通用模板， 提供了设备属性获取及订阅相关功能， 开发者在进行实现设备属性订阅相关功能时，需要修改相关参数
 */

const images = [{
    you: require('../resources/images/you_icon.png'),
    liang: require('../resources/images/liang_icon.png'),
    zhong: require('../resources/images/zhong_icon.png'),
    cha: require('../resources/images/cha_icon.png')
}];

let isDark = false;

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
            header: <NavigationBar {...titleProps} />
        };
    };

    constructor(props) {
        super(props);

        this.initNavigationBar();

        this.state = {
            puDataList: [{
                title: 'VOC',
                value: 0,
                unit: 'ppm'
            }, {
                title: 'CO2',
                value: 0,
                unit: 'ppm'
            }, {
                title: 'PM2.5',
                value: 0,
                unit: 'μg/m³'
            }, {
                title: 'CHO2',
                value: 0,
                unit: 'mg/m³'
            }],
            puDataTempHumiList: [{
                title: PluginStrings.swTemp,
                key: 'swTemp',
                value: 0,
                unit: '℃'
            }, {
                title: PluginStrings.snTemp,
                key: 'snTemp',
                value: 0,
                unit: '℃'
            }, {
                title: PluginStrings.snHumi,
                key: 'snHumi',
                value: 0,
                unit: '%'
            }, {
                title: PluginStrings.swHumi,
                key: 'swHumi',
                value: 0,
                unit: '%'
            }],

            selectIndex: 0,
            showDialog: false,
            dialogKey: '',
            dialogType: 'text',
            dialogContent: [],

            isSendData: false,
            parseDataTimer: null,
            acceptData: {},
            isConfig: false,

            // 设备属性数据
            // 开关机
            power: false,
            // 故障
            fault: 0,
            // 工作模式
            mode: 0,
            // 功能运行模式
            action: 0,
            // 室内温度
            indoorTemp: 0,
            // 室外温度
            outdoorTemp: 0,
            // PM2.5
            pm25: 0,
            // CO2
            co2: 0,
            // voc
            voc: 0,
            // 甲醛浓度
            cho2: 0,
            // 室内湿度
            indoorHumi: 0,
            // 室外湿度
            outdoorHumi: 0,
            // 空气质量指数
            airQuality: 0,
            // 童锁
            lock: 0,
            // 滤网总使用时间
            filterTime: 0,
            // 滤网已使用时间
            filterUsageTime: 0,
            // 特殊功能1
            specialFunction1: 0,
            // 特殊功能2
            specialFunction2: 0,
            // 特殊功能1类型
            specialFunction1Type: 0,
            // 特殊功能2类型
            specialFunction2Type: 0,
            // 送风档位最大值
            fanLevelMax: 0,
            // 排风档位最大值
            exhaustLevelMax: 0,
            // 传感器类型
            sensorType: 0,
            // 送风机档位
            fanLevel: 0,
            // 排风机档位
            exhaustLevel: 0,
            // 特殊功能3类型
            specialFunction3Type: 0,

            // 查询内容
            queryData: [
                // air-fresh
                { did: Device.deviceID, siid: 2, piid: 1 },
                { did: Device.deviceID, siid: 2, piid: 2 },
                { did: Device.deviceID, siid: 2, piid: 3 },
                { did: Device.deviceID, siid: 2, piid: 4 },
                //   { did: Device.deviceID, siid: 2, piid: 4 },
                // environment
                { did: Device.deviceID, siid: 3, piid: 1 },
                { did: Device.deviceID, siid: 3, piid: 2 },
                { did: Device.deviceID, siid: 3, piid: 4 },
                { did: Device.deviceID, siid: 3, piid: 5 },
                { did: Device.deviceID, siid: 3, piid: 6 },
                { did: Device.deviceID, siid: 3, piid: 7 },
                { did: Device.deviceID, siid: 3, piid: 8 },
                // { did: Device.deviceID, siid: 3, piid: 9 },
                { did: Device.deviceID, siid: 3, piid: 10 },
                // lock
                { did: Device.deviceID, siid: 4, piid: 1 },
                // unique-features
                { did: Device.deviceID, siid: 5, piid: 1 },
                { did: Device.deviceID, siid: 5, piid: 2 },
                { did: Device.deviceID, siid: 5, piid: 3 },
                { did: Device.deviceID, siid: 5, piid: 4 },
                { did: Device.deviceID, siid: 5, piid: 5 },
                { did: Device.deviceID, siid: 5, piid: 6 },
                { did: Device.deviceID, siid: 5, piid: 7 },
                { did: Device.deviceID, siid: 5, piid: 8 },
                { did: Device.deviceID, siid: 5, piid: 9 },
                { did: Device.deviceID, siid: 5, piid: 10 },
                { did: Device.deviceID, siid: 5, piid: 11 },
                { did: Device.deviceID, siid: 5, piid: 12 },
                { did: Device.deviceID, siid: 5, piid: 13 },
                { did: Device.deviceID, siid: 5, piid: 15 }
            ],
            queryNum: 0,
            queryArr: [],
            // 弹出窗口的内容
            dialogTitle: '',
            activeIndex: 0,
            dialogList: [],
            isDark: false
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
        isDark = DarkMode.getColorScheme() === 'dark' ? true : false;

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

                // let time = that.state.isSendData ? 1000 : 0;
                // let timer = setTimeout(() => {
                //     for (let i in that.state.acceptData) {
                //         let key = i;
                //         let i_d = that.state.acceptData[key];
                //         that.parseData(key, i_d);
                //     }
                //     that.setState((state) => {
                //         state.acceptData = {};
                //         state.isSendData = false;
                //     });
                //     // that.forceUpdate();

                // }, time);

                // that.setState((state) => {
                //     state.parseDataTimer = timer;
                // });

            });

        this.getDevicePropsValue();

        // // 监听设备属性发生变化事件； 当设备属性发生改变，会发送事件到js，此处会收到监听回调
        // this.mDeviceReceivedMessages = DeviceEvent.deviceReceivedMessages.addListener(
        //     (device, map, data) => {
        //         console.log('Device.addListener', device, map, data);
        //     });
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

    componentWillUnmount() {
        this.removeListener();
    }

    // 拆分数组
    splitArray(arr, chunkSize) {
        return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (v, i) =>
            arr.slice(i * chunkSize, i * chunkSize + chunkSize)
        );
    }

    getDeviceSpecInfo() {
        Service.spec.getSpecString(Device.deviceID).then((specInfo) => {
            console.log('spec info: ', specInfo);
        }).catch((error) => {
            console.log('getSpecString error', error);
        });
    }

    // setDevicePropsValue() {

    //     /**
    //      * 这里的 siid 和 piid 的获取，可以通过解析 getSpecString 获取的spec信息， 也可以通过开发者平台上查询该设备对应的设备属性 siid 和 piid值;
    //      * value 的数据类型 也可以通过 开发者平台上查询（和查看 siid 和 piid 相同）
    //      */
    //     let params = [
    //         { did: Device.deviceID, siid: 1, piid: 1, value: 'xiaomi' },
    //         { did: Device.deviceID, siid: 2, piid: 1, value: false }
    //     ];

    //     Service.spec.setPropertiesValue(params).then((res) => {
    //         console.log('setPropertiesValue success ', res);
    //     }).catch((error) => {
    //         console.log('setPropertiesValue error ', error);
    //     });
    // }

    doDeviceAction() {

        let params = { did: Device.deviceID, siid: 1, aiid: 3, in: [17, "shanghai"] };
        Service.spec.doAction(params).then((res) => {
            console.log('doAction success ', res);
        }).catch((error) => {
            console.log('doAction error ', error);
        });
    }

    clearAllPressing = () => {
        // this.forceUpdate();
    };

    powerOnOff = () => {
        console.log('powerOff', this.state.power);
        let power = this.state.power;
        let params = [
            { did: Device.deviceID, siid: 2, piid: 1, value: power ? false : true }
        ];
        this.setPropertiesValue(params);
    }

    lockOnOff = () => {
        let lock = this.state.lock;
        let params = [
            { did: Device.deviceID, siid: 4, piid: 1, value: lock ? false : true }
        ];
        this.setPropertiesValue(params);
    }

    funcClick = (props) => {
        console.log('funcClick', props);
        let index = props.index;
        console.log(index);
        let piid = 0;
        let siid = 5;
        let v = 0;
        if (index === '0') {
            piid = 3;
            v = this.state.specialFunction1;
        } else if (index === '1') {
            piid = 4;
            v = this.state.specialFunction2;
        }
        let value = v ? false : true;

        let params = [
            { did: Device.deviceID, siid: siid, piid: piid, value: value }
        ];

        if (this.state.specialFunction1Type && this.state.specialFunction2Type) {
            params = [
                { did: Device.deviceID, siid: 5, piid: 3, value: value },
                { did: Device.deviceID, siid: 5, piid: 4, value: value }
            ];
            this.setState({
                specialFunction1: value,
                specialFunction2: value
            });
        } else {
            // 
            this.setState({
                [index === '0' ? 'specialFunction1' : 'specialFunction2']: v ? false : true
            });
        }



        this.setPropertiesValue(params);
    }

    jumpChart = () => {
        console.log('....', this.sensorTypeProps);
        this.props.navigation.navigate('ChartPage', {
            // 是否有室内外温度，室内湿度，co2, voc, pm25, cho2
            hasIndoorTemp: this.sensorTypeProps.snTemp,
            hasOutdoorTemp: this.sensorTypeProps.swTemp,
            hasIndoorHumi: this.sensorTypeProps.snHumi,
            hasOutdoorHumi: this.sensorTypeProps.swHumi,

            hasCo2: this.sensorTypeProps.co2,
            hasPm25: this.sensorTypeProps.pm25,
            hasVoc: this.sensorTypeProps.voc,
            hasCho2: this.sensorTypeProps.cho2
        });
    };

    pressMode = (key) => {
        let list = [];
        let title = '';

        let activeIndex = this.state.selectIndex;
        if (key === 'mode') {

            title = PluginStrings.workMode;
            activeIndex = this.state.mode;
            list = [PluginStrings.auto, PluginStrings.shouD, PluginStrings.timer];
            if (this.hasSleepMode) {
                list.push(PluginStrings.sleep);
            }
            // , PluginStrings.sleep
        } else if (key === 'action') {
            title = PluginStrings.operatingMode;
            activeIndex = this.state.action - 1;
            list = this.actionList;
        } else {
            let max = key === 'fanLevel' ? this.state.fanLevelMax : this.state.exhaustLevelMax;
            for (let i = 0; i <= max; i++) {
                list.push(`${i} ${PluginStrings.dang}`);
            }
            activeIndex = key === 'fanLevel' ? this.state.fanLevel : this.state.exhaustLevel;
            title = key === 'fanLevel' ? PluginStrings.songFJ : PluginStrings.paiFJ;
        }
        this.setState({
            dialogKey: key,
            showDialog: true,
            dialogTitle: title,
            dialogList: list,
            activeIndex: activeIndex,
            dialogType: 'swiper'
        });
    }

    padEnd(str, targetLength, padChar = ' ') {
        const padLength = targetLength - str.length;
        if (padLength <= 0) return str;
        return str + padChar.repeat(padLength);
    }

    // 运行模式解析
    get actionList() {
        let type3 = this.state.specialFunction3Type;
        // console.log('type3', type3, parseInt(type3, 10).toString(2));
        // return []
        //         bit1：加湿
        // bit2：内循环除湿
        // bit3：通风
        // bit4：自动
        // bit5：新风
        // bit6：新风除湿
        let type3_2 = parseInt(type3, 10).toString(2).padStart(8, '0').split('').reverse();
        console.log('type3_2', type3_2);
        let list = [];
        type3_2.forEach((item, i) => {
            if (item === '1') {
                if (i === 0) {
                    list.push(PluginStrings.nxh);
                } else if (i === 1) {
                    list.push(PluginStrings.jiaShi);
                } else if (i === 2) {
                    list.push(PluginStrings.chuShi);
                } else if (i === 3) {
                    list.push(PluginStrings.tongFeng);
                } else if (i === 4) {
                    list.push(PluginStrings.auto);
                } else if (i === 5) {
                    list.push(PluginStrings.xinFeng);
                } else if (i === 6) {
                    list.push(PluginStrings.xinFengCS);
                }
            }
        });
        console.log('list', list);
        return list;
    }

    get DialogProps() {

        return {
            list: this.state.dialogList
        };
    }


    DialogClose = () => {
        this.setState({
            showDialog: false
        });
    }

    openSet = () => {
        console.log('openSet');
        console.log('openSet', this.state.filterTime, this.state.filterUsageTime, [PluginStrings.filterTip1.replace('xx', this.state.filterTime), PluginStrings.filterTip2.replace('xx', this.state.filterUsageTime)]);
        this.setState({
            dialogKey: 'filter',
            showDialog: true,
            dialogTitle: PluginStrings.filterTipTitle,
            dialogContent: [PluginStrings.filterTip1.replace('xx', this.state.filterTime), PluginStrings.filterTip2.replace('xx', this.state.filterUsageTime)],
            // dialogList: list,
            dialogType: 'text'
        });
    }

    DialogConfirm = (v) => {
        console.log(v);
        // return;
        const key = this.state.dialogKey;
        //     let params = [
        //         { did: Device.deviceID, siid: 1, piid: 1, value: 'xiaomi' },
        //         { did: Device.deviceID, siid: 2, piid: 1, value: false }
        //     ];
        let value = v;
        let siid = 0;
        let piid = 0;
        if (key === 'mode') {
            siid = 2;
            piid = 3;
            switch (v) {
                case PluginStrings.auto:
                    value = 0;
                    break;
                case PluginStrings.shouD:
                    value = 1;
                    break;
                case PluginStrings.timer:
                    value = 2;
                    break;
                case PluginStrings.sleep:
                    value = 3;
                    break;
                default:
                    value = 0;
                    break;
            }
        } else if (key === 'action') {
            siid = 5;
            piid = 13;
            switch (v) {
                case PluginStrings.nxh:
                    value = 1;
                    break;
                case PluginStrings.jiaShi:
                    value = 2;
                    break;
                case PluginStrings.chuShi:
                    value = 3;
                    break;
                case PluginStrings.tongFeng:
                    value = 4;
                    break;
                case PluginStrings.auto:
                    value = 5;
                    break;
                case PluginStrings.xinFeng:
                    value = 6;
                    break;
                case PluginStrings.xinFengCS:
                    value = 7;
                    break;
                default:
                    value = 1;
                    break;
            }
        } else if (key === 'fanLevel') {
            siid = 5;
            piid = 10;
            v = this.extractNumbers(v);
            value = parseInt(v);
        } else if (key === 'exhaustLevel') {
            siid = 5;
            piid = 11;
            v = this.extractNumbers(v);
            value = parseInt(v);
        } else if (key === 'filter') {
            siid = 5;
            piid = 1;
            v = this.state.filterTime;
        }

        let params = [
            { did: Device.deviceID, siid: siid, piid: piid, value: value }
        ];

        console.log('DialogConfirm', params);
        this.setPropertiesValue(params);
        this.DialogClose();
    }

    extractNumbers(str, { toFloat = false } = {}) {
        // 正则：匹配整数、浮点数（含千分位逗号）
        const regex = /-?\d{1,3}(?:,\d{3})*\.\d+|-?\d+|-\.\d+/g;

        const matches = str.match(regex) || [];

        return matches.map((val) => {
            // 清理千分位逗号，转换类型
            const cleanVal = val.replace(/,/g, '');
            return toFloat ? parseFloat(cleanVal) : parseInt(cleanVal, 10);
        }).filter((num) => !isNaN(num)); // 过滤无效值
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
                // 已有正确更新（保留）
                this.setState({ power: iData });
                break;

            case '2.2':
                // 错误：直接修改 state（无更新）
                // 修复：使用 setState（对象式更新）
                this.setState({ fault: iData });
                break;

            case '2.3':
                // 修复：独立状态更新
                this.setState({ mode: iData });
                break;

            case '5.13':
                this.setState({ action: iData });
                break;

            case '3.1':
                this.setState({ indoorTemp: iData });
                break;

            case '3.2':
                this.setState({ outdoorTemp: iData });
                break;

            case '3.4':
                this.setState({ pm25: iData });
                break;

            case '3.5':
                this.setState({ co2: iData });
                break;

            case '3.6':
                this.setState({ voc: iData });
                break;

            case '3.7':
                this.setState({ cho2: iData });
                break;

            case '3.8':
                this.setState({ indoorHumi: iData });
                break;

            case '5.15':
                this.setState({ outdoorHumi: iData });
                break;

            case '3.10':
                this.setState({ airQuality: iData });
                break;

            case '4.1':
                this.setState({ lock: iData });
                break;

            case '5.1':
                this.setState({ filterTime: iData || 0 });
                break;

            case '5.2':
                // 推荐：如果 filterUsageTime 依赖 filterTime（如累计），使用函数式更新
                this.setState((prevState) => ({
                    filterUsageTime: iData || 0 // 独立更新无需依赖
                }));
                break;

            case '5.3':
                this.setState({ specialFunction1: iData });
                break;

            case '5.4':
                this.setState({ specialFunction2: iData });
                break;

            case '5.5':
                console.log('this.state.isConfig', this.state.isConfig);
                if (!this.state.isConfig) {
                    this.setState({ specialFunction1Type: iData });
                }
                break;

            case '5.6':
                if (!this.state.isConfig) {
                    this.setState({ specialFunction2Type: iData });
                }
                break;

            case '5.7':
                this.setState({ fanLevelMax: iData });
                break;

            case '5.8':
                this.setState({ exhaustLevelMax: iData });
                break;

            case '5.9':
                this.setState({ sensorType: iData });
                break;

            case '5.10':
                this.setState({ fanLevel: iData });
                break;

            case '5.11':
                this.setState({ exhaustLevel: iData });
                break;

            case '5.12':
                this.setState({ specialFunction3Type: iData });
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

    // 设备数据计算
    get puDataTempHumiList() {
        let list = this.state.puDataTempHumiList;
        list[0].value = this.state.outdoorTemp;
        list[1].value = this.state.indoorTemp;
        list[2].value = this.state.indoorHumi;
        list[3].value = this.state.outdoorHumi;
        return list;
    }

    // 环境参数
    get airProps() {
        return {
            co2: this.state.co2,
            pm25: this.state.pm25,
            voc: this.state.voc,
            cho2: this.state.cho2
        };
    }

    // 功能
    get modeProps() {
        return {
            mode: this.state.mode,
            action: this.state.action,
            fanLevel: this.state.fanLevel,
            exhaustLevel: this.state.exhaustLevel,
            fanLevelMax: this.state.fanLevelMax,
            exhaustLevelMax: this.state.exhaustLevelMax,
            specialFunction3Type: this.state.specialFunction3Type
        };
    }

    // 滤芯剩余
    get filterProps() {
        let usageTime = this.state.filterUsageTime;
        let totalTime = this.state.filterTime;

        let bfb = 100 - parseInt(usageTime / totalTime * 100);
        return {
            bfb: bfb
        };
    }

    get BottomComProps() {
        return {
            power: this.state.power,
            lock: this.state.lock
        };
    }

    get airQualityProps() {
        let airQuality = this.state.airQuality;
        let img = images.you;
        let action = this.state.action;
        if (airQuality === 1) {
            img = require('../resources/images/you_icon.png');
        } else if (airQuality === 2) {
            img = require('../resources/images/liang_icon.png');
        } else if (airQuality === 3) {
            img = require('../resources/images/zhong_icon.png');
        } else if (airQuality === 4) {
            img = require('../resources/images/cha_icon.png');
        }

        let homeImg = require('../resources/images/home_icon.png');
        if (action === 1) {
            // 内循环
            homeImg = require('../resources/images/home_nxh_icon.png');
        } else if (action === 4) {
            // 通风
            homeImg = require('../resources/images/home_nwxh_icon.png');
        } else if (action === 5) {
            // 内外循环
            homeImg = require('../resources/images/home_nwxh_icon.png');
        } else if (action === 6) {
            // 新风
            homeImg = require('../resources/images/home_wxh_icon.png');
        } else if (action === 7) {
            //  新风除湿
            homeImg = require('../resources/images/home_wxh_icon.png');
        } else {
            homeImg = require('../resources/images/home_icon.png');
        }

        return {
            airImg: img,
            homeImg: homeImg
        };
    }

    // 是否有睡眠模式
    get hasSleepMode() {

        let sensorType = this.state.sensorType;
        if (!sensorType) {
            return false;
        }
        let sensorType_2 = sensorType.toString(2).replace(/0b/g, '');
        sensorType_2 = sensorType_2.padStart(9, '0');
        let sensorType_2_list = sensorType_2.split('').reverse();
        return sensorType_2_list[8] === '1';
    }

    get sensorTypeProps() {
        let sensorType = this.state.sensorType;
        if (!sensorType) {
            return false;
        }
        let sensorType_2 = sensorType.toString(2).replace(/0b/g, '');
        sensorType_2 = sensorType_2.padStart(9, '0');
        let sensorType_2_list = sensorType_2.split('').reverse();
        let s_auth_config = ['snTemp', 'swTemp', 'snHumi', 'swHumi', 'pm25', 'co2', 'voc', 'cho2'];
        let data = {};
        let len = 0;
        let onlyAQILen = 0;
        let onlyAQI = {};
        for (let i = 0; i < sensorType_2_list.length; i++) {
            let state = false;
            if (sensorType_2_list[i] === '1') {
                state = true;

                let s_auth_config_i = s_auth_config[i];
                if (s_auth_config_i === 'pm25' || s_auth_config_i === 'co2' || s_auth_config_i === 'voc' || s_auth_config_i === 'cho2') {
                    onlyAQILen++;
                    onlyAQI = {
                        key: s_auth_config_i.toUpperCase(),
                        value: this.state[s_auth_config_i],
                        unit: s_auth_config_i === 'pm25' || s_auth_config_i === 'cho2' ? 'ug/㎡' : 'ppm'
                    };
                }
                len++;
            }
            data[s_auth_config[i]] = state;
        }
        data['len'] = len;
        data['onlyAQI'] = onlyAQILen === 1 ? onlyAQI : false;
        // console.log('sensorTypeProps', data);
        return data;
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={{ flex: 1 }} onMomentumScrollEnd={() => {
                    this.clearAllPressing();
                }}>
                    {/* 房间状态 */}
                    <View style={[styles.homeContainer]}>
                        <Image style={[styles.homeIcon]} source={this.airQualityProps.homeImg} resizeMode="contain"></Image>
                        {!this.state.power && <Text style={[styles.homeState]}>
                            {PluginStrings.closed}
                        </Text>}
                        {this.state.power &&
                            <Image style={[styles.homeRank]} source={this.airQualityProps.airImg} resizeMode="contain"></Image>}
                        {this.state.power &&
                            <View style={[styles.homePM25]}>
                                <Text style={[styles.homeAQITitle]}>{PluginStrings.aqi}</Text>
                                {/* {this.sensorTypeProps.onlyAQI && <View style={styles.homeCO2Container}> */}
                                {/* <View style={styles.homeCO2Split}></View> */}
                                {/* <Text style={[styles.homeCO2Title]}>{this.sensorTypeProps.onlyAQI.key}</Text> */}
                                {/* <Text style={[styles.homePM25Num]}>{this.sensorTypeProps.onlyAQI.value}{this.sensorTypeProps.onlyAQI.unit}</Text> */}
                                {/* </View>} */}

                            </View>}
                        <View style={[styles.homeTempHumi, !this.state.power && styles.disabledStyle]}>
                            {this.puDataTempHumiList.map((item, index) => {
                                return (
                                    <View style={[styles.homeTempHumiItem]} key={`tempHumi_${index}`}>
                                        {this.sensorTypeProps[item.key] && <Text style={[styles.homeTempHumiItemNum]}>{item.value}{item.unit}</Text>}
                                        {this.sensorTypeProps[item.key] && <Text style={[styles.homeTempHumiItemTitle]}>{item.title}</Text>}
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                    {/* 房间参数 */}
                    <PuDataCom params={this.airProps} sensor={this.sensorTypeProps} style={[!this.state.power && styles.disabledStyle]} />
                    {/* 模式 */}
                    <ModeCom params={this.modeProps} pressMode={this.pressMode} style={[!this.state.power && styles.disabledStyle]} ></ModeCom>
                    {/* 功能 */}
                    <FuncCom
                        style={[{ marginTop: 11 }, !this.state.power && styles.disabledStyle]}
                        spec1={this.state.specialFunction1Type}
                        spec2={this.state.specialFunction2Type}
                        spec1Value={this.state.specialFunction1}
                        spec2Value={this.state.specialFunction2}
                        funcClick={this.funcClick}
                    ></FuncCom>
                    {/* 滤网剩余 */}
                    <SliderCom openSet={this.openSet} params={this.filterProps} style={[{ marginTop: 11, marginBottom: 11 }, !this.state.power && styles.disabledStyle]}></SliderCom>

                </ScrollView>
                {/* 底部开关组件 */}
                <BottomCom lockOnOff={this.lockOnOff} powerOnOff={this.powerOnOff} params={this.BottomComProps} linkChart={this.jumpChart}></BottomCom>

                <DialogCom
                    visible={this.state.showDialog}
                    activeIndex={this.state.activeIndex}
                    dialogList={this.DialogProps.list}
                    title={this.state.dialogTitle}
                    content={this.state.dialogContent}
                    close={this.DialogClose}
                    confirm={this.DialogConfirm}
                    type={this.state.dialogType}
                ></DialogCom>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(33, 35, 48, 1)",
        flex: 1
    },
    bg: {
        height: 429,
        flex: 1,
        position: 'absolute',
        width: screenWidth
    },
    homeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        height: 200
    },
    homeIcon: {
        height: 200,
        position: 'absolute',
        transform: [{ translateX: -13 }] // 向左移动 10dp
    },
    homeRank: {
        width: 75,
        height: 65,
        marginTop: 35
    },
    homeState: {
        color: '#fff',
        fontSize: 28,
        marginTop: 72,
        marginBottom: 20
    },
    homePM25: {
        marginTop: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    homeAQITitle: {
        fontSize: 14,
        color: '#fff'
    },
    homeCO2Container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    homeCO2Split: {
        width: 1,
        height: 13,
        marginLeft: 7,
        marginRight: 7,
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
    },
    homeCO2Title: {
        fontSize: 13,
        color: '#fff'
    },
    homePM25Num: {
        fontSize: 15,
        color: '#fff',
        marginLeft: 7
    },
    homeTempHumi: {
        marginTop: 18,
        flexDirection: 'row'
    },
    homeTempHumiItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    homeTempHumiItemNum: {
        fontSize: 14,
        color: '#fff'
    },
    homeTempHumiItemTitle: {
        fontSize: 11,
        color: '#fff'
    },

    mtf100: {
        marginTop: -100
    },
    listCardContainer: {
        marginTop: 12,
        width: screenWidth - 22,
        overflow: 'hidden',
        borderRadius: 12,
        marginLeft: 12,
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    listItem: {
        flex: 1,
        width: (screenWidth - 36) / 2,
        height: 84,
        borderRadius: 17,
        paddingLeft: 19,
        paddingRight: 19
    },
    listItemTitle: {
        fontSize: 17,
        fontWeight: 'bold'
    },
    baseContainer: {
        marginLeft: 11,
        marginRight: 11,
        flex: 1,
        padding: 16,
        borderRadius: 17,
        backgroundColor: "#2F3045"
    },

    ml12: {
        marginLeft: 12
    },
    mt11: {
        marginTop: 11
    },
    disabledStyle: {
        opacity: 0.6
    }
});




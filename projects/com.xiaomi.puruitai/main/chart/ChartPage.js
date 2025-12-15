import React from 'react';
import { Device, Service } from 'miot';
import { ScrollView, StyleSheet, View } from 'react-native';
import NavigationBar from 'miot/ui/NavigationBar';
import { navigation } from 'react-navigation';
import ChartCom from './ChartCom';
import OverlayPage from '../CommonModules/OverlayPage';
import PluginStrings from '../../resources/strings';

// const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");
export default class ChartPage extends React.Component {
  constructor(props) {
    super(props);
    this.initNavigationBar();
    this.state = {
      tabIndex: 1, // 父组件中的状态
      overlayVisible: false,
      comType: 'datePicker',
      comData: {},
      timeData1: '',
      timeData2: '',

      xData1: [],
      xData2: [],
      yData1: [],
      yData2: [],

      dataType1: 'temp',
      dataType2: 'co2',
      dataTimeType1: 'day',
      dataTimeType2: 'day',

      isUpdate1: false,
      isUpdate2: false
    };
  }

  get humitureProps() {
    let time = this.state.timeData1;
    return {
      title: PluginStrings.snHumiture,
      time: time,
      id: 'humiture',
      xData: this.state.xData1,
      yData: this.state.yData1,
      tabList: [{
        key: 'TEMP',
        value: PluginStrings.temp,
        unit: '℃',
        subTitle: PluginStrings.snTemp
      }, {
        key: 'HUMI',
        value: PluginStrings.humi,
        unit: '%',
        subTitle: PluginStrings.snHumi
      }]
    };
  }

  get airQualityProps() {
    let time = this.state.timeData2;
    return {
      title: PluginStrings.snAirQuality,
      xData: this.state.xData2,
      yData: this.state.yData2,
      id: 'airQuality',
      time: time,
      tabList: [{
        key: 'CO2',
        value: 'CO2',
        unit: 'ppm',
        subTitle: PluginStrings.snCo2
      }, {
        key: 'PM25',
        value: 'PM2.5',
        unit: 'ppm',
        subTitle: PluginStrings.snPm25
      }, {
        key: 'TVOC',
        value: 'TVOC',
        unit: 'ppm',
        subTitle: PluginStrings.snTvoc
      }]
    };
  }

  UNSAFE_componentWillMount() {
    const today = new Date();

    this.setState({
      timeData1: {
        txt: this.formattedDate(today),
        time: today
      },
      timeData2: {
        txt: this.formattedDate(today),
        time: today
      }
    });

    let dTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    // dTime.setHours(0, 0, 0, 0);
    let startTime = Math.floor(dTime.getTime() / 1000);
    let eTime = new Date(dTime);
    eTime.setDate(eTime.getDate() + 1);
    let endTime = Math.floor(eTime.getTime() / 1000);

    this.statistics('4.1', 'stat_hour_v3', startTime, 1).then((res) => {
      this.parseChartData('TEMP', 'day', startTime, endTime, res);
    });

    this.statistics('4.3', 'stat_hour_v3', startTime, 1).then((res) => {
      this.parseChartData('CO2', 'day', startTime, endTime, res);
    });
  }

    formattedDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要 +1
      const day = String(date.getDate()).padStart(2, '0');
      return `${ year }/${ month }/${ day }`;
    };

    initNavigationBar() {
      this.props.navigation.setParams({
        titleProps: {
          backgroundColor: '#F7F7F7',
          title: PluginStrings.snChart,
          left: [
            {
              key: NavigationBar.ICON.BACK,
              onPress: () => {
                this.props.navigation.goBack();
                // navigation.goBack();
              }
            }
          ]
        }
      });
    }

    showOverlay = (data) => {
      this.setState({
        overlayVisible: true,
        comData: data
      });
      console.log('====data', data);
    };

    hideOverlayVisible = () => {
      this.setState({ overlayVisible: false });
    };

    sureOverlay = (value) => {
      // let type = this.state.comData.type;
      let id = this.state.comData.id;

      console.log('sureOverlay', value);
      //   let v = value;

      //   let t = new Date(value.time);

      //   v.time = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()));

      if (id === 'humiture') {
        this.setState({
          timeData1: value
        });
      } else {
        this.setState({
          timeData2: value
        });
      }
      this.hideOverlayVisible();
    };

    /**
     * 获取设备上报数据的统计，返回服务端处理后的数据。
     *
     * 下面函数里面的 limit 为查询返回的数据条数，0 < limit < 300，不在此区间内默认 300。
     *
     * @param {string} key 属性的 siid 与 piid，用点号连接，如 20.1；若属性是由上报事件携带的参数时，需要加上前缀 prop，如 prop.20.1。
     * @param {'stat_hour_v3' | 'stat_day_v3' | 'stat_week_v3' | 'stat_month_v3'} data_type 数据类型
     * @param {number} time_start 查询开始时间。Unix 时间戳，单位秒，注意不是毫秒。
     *                            默认值：30 天前
     * @param {number} time_end   查询结束时间。Unix 时间戳，单位秒，注意不是毫秒。
     *                            默认值：现在 -> Math.floor(Date.now() / 1000)
     *
     * @returns {Promise<Object>} 返回服务端返回的数据
     */
    statistics = (key, data_type, time_start, nums) => {
      const currentTime = Math.floor(Date.now() / 1000);
      // 如果参数 time 未填写，默认查看 30 天前的数据
      const _time_start = time_start || currentTime;
      const _time_end = _time_start + nums * 24 * 60 * 60;

      console.log('_time_end', _time_end);
      const param = {
        did: Device.deviceID,
        data_type: data_type,
        key: key,
        time_start: _time_start,
        time_end: _time_end,
        limit: 300
      };

      return Service.smarthome.getUserStatistics(param);
    };

    // 计算选择月份的天数
    getDaysInMonth(year, month) {
      // 注意：月份从 0 开始，所以传入的 month 需要减 1

      console.log('year', year, month);
      const date = new Date(year, month, 0); // 0 表示上一个月的最后一天
      return date.getDate(); // 获取该月的天数
    }

    parseDplicateItem = (data) => {
      const dailyData = {};

      data.forEach(({ time, value }) => {
        const date = new Date(time * 1000); // 转换为 YYYY-MM-DD
        const numValue = parseFloat(value.replace(/\[|\]/g, "")); // 去除方括号并转换为数字

        if (!dailyData[date]) {
          dailyData[date] = [];
        }
        dailyData[date].push(numValue);
      });

      // 2️⃣ 计算每日平均值
      const averagedData = Object.entries(dailyData).map(([date, values]) => {
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;
        return { date, average };
      });

      return averagedData;
    };

    // 
    getChartData = (key, dateType, selectTime) => {
      let dTime = new Date(selectTime.getFullYear(), selectTime.getMonth(), selectTime.getDate());
      console.log('dTime', dTime);
      let dt = dateType;
      let api_date_type = 'stat_hour_v3';
      let api_prop = '';
      let dayNums = 1;

      console.log(dTime.getTime());
      let startTime = Math.floor(dTime.getTime() / 1000);
      if (dt === 'day') {
        dayNums = 1;
        api_date_type = 'stat_hour_v3';
      } else if (dt === 'week') {
        dayNums = 7;
        api_date_type = 'stat_day_v3';
      } else if (dt === 'month') {
        dayNums = 30;
        api_date_type = 'stat_day_v3';
        let n_date = new Date(dTime);

        dayNums = this.getDaysInMonth(n_date.getFullYear(), n_date.getMonth() + 1);
      }

      if (key === 'TEMP') {
        api_prop = '4.1';
      } else if (key === 'HUMI') {
        api_prop = '4.2';
      } else if (key === 'CO2') {
        api_prop = '4.3';
      } else if (key === 'PM25') {
        api_prop = '4.4';
      } else if (key === 'TVOC') {
        api_prop = '4.5';
      }

      let that = this;
      const et = new Date(dTime);

      et.setDate(et.getDate() + dayNums);
      console.log('et', et);
      let endTime = Math.floor(et.getTime() / 1000);
      // console.log('======', api_date_type, dTime, et, endTime);
      console.log('...', api_prop, api_date_type, startTime, endTime);
      this.statistics(api_prop, api_date_type, startTime, dayNums).then((res) => {
        console.log('res', res);
        that.parseChartData(key, dt, startTime, endTime, res);
      });
    }

    parseChartData = (key, dt, startTime, endTime, res) => {
      let that = this;
      let xData = [];
      let yData = [];
      let result = res.result;

      if (result.length === 0) {

      } else {
        // result.reverse();

        result = result.filter((item) => {
          return item.time <= endTime && item.time >= startTime;
        });
        result.sort((a, b) => a.time - b.time);

        if (dt !== 'day') {
          let cData = this.parseDplicateItem(result);
          for (let i = 0; i < cData.length; i++) {
            let item = cData[i];

            if (item) {
              xData.push(that.conversionTime(dt, item.date));
              yData.push(this.formatNumber(item.average));
            }

          }
          console.log('cData', xData, yData);
        } else {
          for (let i = 0; i < result.length; i++) {
            let item = result[i];
            // {"__api_info": {"duration": 67, "start": 1740642163457}, "code": 0, "message": "ok", "result": [{"time": 1740639600, "value": "[25]"}, {"time": 1740632400, "value": "[25]"}, {"time": 1740625200, "value": "[25]"}, {"time": 1740621600, "value": "[25]"}, {"time": 1740618000, "value": "[25]"}]}
            let value = JSON.parse(item.value)[0];
            if (value) {
              let time = that.conversionTime(dt, item.time * 1000);
              xData.push(time);
              yData.push(this.formatNumber(value));
            }

          }
        }
      }
      if (key === 'TEMP' || key === 'HUMI') {
        this.setState({
          xData1: xData,
          yData1: yData
        });
      } else {
        this.setState({
          xData2: xData,
          yData2: yData
        });
      }
    }

    formatNumber(value) {
      const num = parseFloat(value); // 转换为数字
      if (!num || isNaN(num)) {
        return 0;
      }
      return Number.isInteger(num) ? num : num.toFixed(1);
      // return Number.isInteger(num) ? num : num.toFixed(1);
    }

    conversionTime = (type, time) => {
      const date = new Date(time);
      console.log('conversionTime', date);
      if (type === 'day') {
        return `${ date.getHours().toString().padStart(2, '0') }:${ date.getMinutes().toString().padStart(2, '0') }`;
      } else {
        return `${ (date.getMonth() + 1).toString().padStart(2, '0') }/${ date.getDate().toString().padStart(2, '0') }`;
      }
    }

    render() {
      return (
        <View style={styles.chartPage}>

          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1, marginBottom: 20, backgroundColor: '#f7f7f7' }} >
            <View style={styles.container}>
              <View style={styles.mt12}>
                <ChartCom

                  id={this.humitureProps.id}
                  title={this.humitureProps.title}
                  xData={this.humitureProps.xData}
                  yData={this.humitureProps.yData}
                  tabList={this.humitureProps.tabList}
                  time={this.humitureProps.time}
                  currentType={this.state.dataType1}
                  currentTimeType={this.state.dataTimeType1}
                  getChartData={this.getChartData}
                  isUpdate={this.state.isUpdate1}
                  showOverlay={this.showOverlay}></ChartCom>
              </View>

              <View style={styles.mt12}>
                <ChartCom
                  id={this.airQualityProps.id}
                  title={this.airQualityProps.title}
                  xData={this.airQualityProps.xData}
                  yData={this.airQualityProps.yData}
                  tabList={this.airQualityProps.tabList}
                  time={this.airQualityProps.time}
                  currentType={this.state.dataType2}
                  currentTimeType={this.state.dataTimeType2}
                  getChartData={this.getChartData}
                  isUpdate={this.state.isUpdate2}
                  showOverlay={this.showOverlay}
                ></ChartCom>
              </View>
            </View>
          </ScrollView>
          {this.state.overlayVisible &&
                    <OverlayPage confirm={this.sureOverlay} comData={this.state.comData} comType={this.state.comType}
                      close={this.hideOverlayVisible} ></OverlayPage>}
        </View>
      );
    }
}

const styles = StyleSheet.create({
  chartPage: {
    width: '100%',
    flex: 1,
    backgroundColor: '#F7F7F7'
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7'
    // paddingBottom: 200
  },
  chartItem: {
    // marginLeft: 12,
    // marginRight: 12
  },
  mt12: {
    marginTop: 12
  }
});

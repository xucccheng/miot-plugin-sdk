import React from 'react';
import { Device, Service } from 'miot';
import { ScrollView, StyleSheet, View } from 'react-native';
import NavigationBar from 'miot/ui/NavigationBar';
import { navigation } from 'react-navigation';
import ChartCom from './ChartCom';
import PluginStrings from '../../resources/strings';
import OverlayPage from '../CommonModules/OverlayPage';


export default class ElecPage extends React.Component {
  constructor(props) {
    super(props);
    this.initNavigationBar();
    this.state = {
      tabIndex: 1, // 父组件中的状态
      overlayVisible: false,
      comType: 'datePicker',

      comData: {},
      timeData: {},
      xData: [],
      yData: [],
      dataType: 'ELEC',
      dataTimeType: 'week'
    };
  }

  UNSAFE_componentWillMount() {
    const today = new Date();
    let dTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(dTime.setDate(dTime.getDate() - dTime.getDay() + 1));

    let startTime = Math.floor(startOfWeek.getTime() / 1000);
    let endOfWeek = new Date(dTime);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    endOfWeek = endOfWeek > new Date() ? new Date() : endOfWeek;

    this.setState({
      timeData: {
        txt: [this.formattedDayDate(startOfWeek), this.formattedDayDate(endOfWeek)].join("-"),
        time: startOfWeek
      }
    });

    let endTime = Math.floor(endOfWeek.getTime() / 1000);
    console.log('startTime', startTime, endTime);
    this.statistics('6.4', 'stat_day_v3', startTime, 7).then((res) => {
      console.log('res', res);
      this.parseChartData('ELEC', 'week', startTime, endTime, res);
    });
  }

  initNavigationBar() {
    this.props.navigation.setParams({
      titleProps: {
        backgroundColor: '#F7F7F7',
        title: PluginStrings.powerUsage,
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

    formattedDayDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要 +1
      const day = String(date.getDate()).padStart(2, '0');
      return `${ year }/${ month }/${ day }`;
    };

    showOverlay = (data) => {
      this.setState({
        overlayVisible: true,
        comData: data
      });
    };

    hideOverlayVisible = () => {
      this.setState({ overlayVisible: false });
    };

    sureOverlay = (value) => {
      this.setState({
        timeData: value
      });

      this.hideOverlayVisible();
    };

    statistics = (key, data_type, time_start, nums) => {
      const currentTime = Math.floor(Date.now() / 1000);
      // 如果参数 time 未填写，默认查看 30 天前的数据
      const _time_start = time_start || currentTime;
      const _time_end = _time_start + nums * 24 * 60 * 60;

      const param = {
        did: Device.deviceID,
        data_type: data_type,
        key: key,
        time_start: _time_start,
        time_end: _time_end,
        limit: 300
      };

      console.log('param', param);

      return Service.smarthome.getUserStatistics(param);
    };

    // 计算选择月份的天数
    getDaysInMonth(year, month) {
      // 注意：月份从 0 开始，所以传入的 month 需要减 1

      console.log('year', year, month);
      const date = new Date(year, month, 0); // 0 表示上一个月的最后一天
      return date.getDate(); // 获取该月的天数
    }

    getDaysInYear(year) {
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0) ? 366 : 365;
    }

    parseDplicateItem = (data) => {
      const dailyData = {};

      data.forEach(({ time, value }) => {
        const date = new Date(time * 1000).toISOString().split("T")[0]; // 转换为 YYYY-MM-DD
        const numValue = parseFloat(value.replace(/\[|\]/g, "")); // 去除方括号并转换为数字

        if (!dailyData[date]) {
          dailyData[date] = [];
        }
        dailyData[date].push(numValue);
      });

      // 2️⃣ 计算每日平均值
      const difference = Object.entries(dailyData).map(([date, values]) => {
        const max = Math.max(...values);
        const min = Math.min(...values);
        console.log('max', max, min);
        const difference = max - min;
        return { date, difference };
      });

      return difference;
    };

    // 
    getChartData = (key, dateType, selectTime) => {
      console.log('getChartData', key, dateType, selectTime);
      let dTime = new Date(selectTime.getFullYear(), selectTime.getMonth(), selectTime.getDate());

      let dt = dateType;
      let api_date_type = 'stat_hour_v3';
      let api_prop = '';
      let dayNums = 1;

      let startTime = Math.floor(dTime.getTime() / 1000);
      console.log('startTime', startTime);
      if (dt === 'day') {
        dayNums = 1;
        api_date_type = 'stat_hour_v3';
      } else if (dt === 'week') {
        dayNums = 7;
        api_date_type = 'stat_day_v3';
      } else if (dt === 'month') {
        dayNums = 30;
        api_date_type = 'stat_day_v3';
        dTime = new Date(dTime.getFullYear(), dTime.getMonth(), 1);
        let n_date = new Date(dTime);
        startTime = Math.floor(dTime.getTime() / 1000);
        dayNums = this.getDaysInMonth(n_date.getFullYear(), n_date.getMonth() + 1);
      } else if (dt === 'year') {
        dTime = new Date(dTime.getFullYear(), 0, 1);
        startTime = Math.floor(dTime.getTime() / 1000);
        api_date_type = 'stat_month_v3';
        dayNums = this.getDaysInYear(dTime.getFullYear());
      }

      api_prop = '6.4';

      let that = this;
      const et = new Date(dTime);

      et.setDate(et.getDate() + dayNums);

      let endTime = Math.floor(et.getTime() / 1000);

      this.statistics(api_prop, api_date_type, startTime, dayNums).then((res) => {
        that.parseChartData(key, dt, startTime, endTime, res);
      });
    }

    calculateMonthlyDifference = (data) => {
      const monthlyData = {};

      data.forEach(({ time, value }) => {
        const date = new Date(time * 1000);
        const month = `${ String(date.getMonth() + 1) }${ PluginStrings.month }`;
        const [minValue, maxValue] = JSON.parse(value);

        if (!monthlyData[month]) {
          monthlyData[month] = { min: minValue, max: maxValue };
        } else {
          monthlyData[month].min = Math.min(monthlyData[month].min, minValue);
          monthlyData[month].max = Math.max(monthlyData[month].max, maxValue);
        }
      });

      const monthlyDifferences = Object.entries(monthlyData).map(([month, { min, max }]) => ({
        month,
        difference: max - min
      }));

      return monthlyDifferences;
    };

    formatNumber(value) {
      const num = parseFloat(value); // 转换为数字
      if (!num || isNaN(num)) {
        return 0;
      }
      return Number.isInteger(num) ? num : parseFloat(num.toFixed(1));
      // return Number.isInteger(num) ? num : num.toFixed(1);
    }

    parseChartData = (key, dt, startTime, endTime, res) => {
      console.log('parseChartData', res);
      let that = this;
      let xData = [];
      let yData = [];
      let result = res.result;

      if (result.length === 0) {

      } else {
        // result.reverse();
        result.sort((a, b) => a.time - b.time);

        if (dt === 'year') {
          const monthlyDifferences = this.calculateMonthlyDifference(result);
          for (let i = 0; i < monthlyDifferences.length; i++) {
            let item = monthlyDifferences[i];
            xData.push(item.month);
            yData.push(this.formatNumber(item.difference));
          }
        } else {
          for (let i = 0; i < result.length; i++) {
            let item = result[i];
            // {"__api_info": {"duration": 67, "start": 1740642163457}, "code": 0, "message": "ok", "result": [{"time": 1740639600, "value": "[25]"}, {"time": 1740632400, "value": "[25]"}, {"time": 1740625200, "value": "[25]"}, {"time": 1740621600, "value": "[25]"}, {"time": 1740618000, "value": "[25]"}]}
            let value = JSON.parse(item.value);
            if (value) {
              let min = value[0] ? value[0] : 0;
              let max = value[1] ? value[1] : 0;
              let time = that.conversionTime(dt, item.time * 1000);
              xData.push(time);
              console.log(max, min, '====');
              yData.push(this.formatNumber(max - min));
            }
          }
        }
      }

      this.setState({
        xData: xData,
        yData: yData
      });
    }

    conversionTime = (type, time) => {
      const date = new Date(time);
      if (type === 'day') {
        return `${ date.getHours().toString().padStart(2, '0') }:${ date.getMinutes().toString().padStart(2, '0') }`;
      } else {
        return `${ (date.getMonth() + 1).toString().padStart(2, '0') }/${ date.getDate().toString().padStart(2, '0') }`;
      }
    };

    render() {
      return (
        <View style={styles.chartPage}>
          <ScrollView removeClippedSubviews={false} style={{ flex: 1, marginBottom: 20, backgroundColor: '#f7f7f7' }} onMomentumScrollEnd={() => {
          }}>
            <View style={styles.container}>
              <View style={styles.mt12}>
                <ChartCom
                  time={this.state.timeData}
                  xData={this.state.xData}
                  yData={this.state.yData}
                  currentType={this.state.dataType}
                  currentTimeType={this.state.dataTimeType}
                  getChartData={this.getChartData}
                  showOverlay={this.showOverlay}
                />
              </View>
            </View>
          </ScrollView>
          {this.state.overlayVisible &&
                    <OverlayPage confirm={this.sureOverlay} comData={this.state.comData} comType={this.state.comType}
                      close={this.hideOverlayVisible} hide={this.hideOverlayVisible}></OverlayPage>}
        </View>
      );
    }
}

const styles = StyleSheet.create({
  chartPage: {
    // width: '100%',
    flex: 1,
    backgroundColor: '#F7F7F7'
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7'
  },
  chartItem: {
    // marginLeft: 12,
    // marginRight: 12
  },
  mt12: {
    marginTop: 12
  }
});

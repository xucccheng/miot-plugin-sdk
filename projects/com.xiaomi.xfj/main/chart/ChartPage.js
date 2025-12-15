import React from 'react';
import { Device, Service } from 'miot';
import { ScrollView, StyleSheet, View } from 'react-native';
import NavigationBar from 'miot/ui/NavigationBar';
import { navigation } from 'react-navigation';
import ChartCom from './ChartCom';
import PluginStrings from '../../resources/strings';
import { snHumi, snTemp, swHumi, swTemp } from '../../resources/strings/zh';

// const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");
export default class ChartPage extends React.Component {
  constructor(props) {
    super(props);
    console.log('ChartPage', JSON.stringify(props.navigation.state.params));

    // 获取父组件传递的参数


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
      xData3: [],
      xData4: [],
      xData5: [],
      xData6: [],

      snTemp: [],
      swTemp: [],

      snHumi: [],
      swHumi: [],
      co2: [],
      pm25: [],
      voc: [],
      ch2o: [],

      // 父组件传递过来
      hasIndoorTemp: props.navigation.state.params.hasIndoorTemp || false,
      hasIndoorHumi: props.navigation.state.params.hasIndoorHumi || false,
      hasOutdoorTemp: props.navigation.state.params.hasOutdoorTemp || false,
      hasOutdoorHumi: props.navigation.state.params.hasOutdoorHumi || false,
      hasCo2: props.navigation.state.params.hasCo2 || false,
      hasPm25: props.navigation.state.params.hasPm25 || false,
      hasVoc: props.navigation.state.params.hasVoc || false,
      hasCho2: props.navigation.state.params.hasCho2 || false,

      // 室内外的xData,最后的时候合并
      snTempXData: [],
      swTempXData: [],

      snHumiXData: [],
      swHumiXData: [],

      dataType1: 'temp',
      dataType2: 'co2',
      dataTimeType1: 'day',
      dataTimeType2: 'day',

      isUpdate1: false,
      isUpdate2: false
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

    if (this.state.hasIndoorTemp) {
      this.getChartData('SNTEMP', 'week');
    }

    if (this.state.hasOutdoorTemp) {
      this.getChartData('SWTEMP', 'week');
    }
    if (this.state.hasIndoorHumi) {
      this.getChartData('SNHUMI', 'week');
    }
    if (this.state.hasOutdoorHumi) {
      this.getChartData('SWHUMI', 'week');
    }
    if (this.state.hasCo2) {
      this.getChartData('CO2', 'week');
    }
    // //  如果有pm25，则获取pm25数据
    if (this.state.hasPm25) {
      console.log("-======hasPm25", this.state.hasPm25);
      this.getChartData('PM25', 'week');
    }

    if (this.state.hasCho2) {
      this.getChartData('CHO2', 'week');
    }

    // // 如果有voc，则获取voc数据
    if (this.state.hasVoc) {
      this.getChartData('VOC', 'week');
    }
    // this.statistics('3.1', 'stat_day_v3', startTime, 7).then((res) => {
    //     this.parseChartData('SNTEMP', 'week', res);
    // });

    // this.statistics('3.2', 'stat_day_v3', startTime, 7).then((res) => {
    //     this.parseChartData('SWTEMP', 'week', res);
    // });

    // this.statistics('3.8', 'stat_hour_v3', startTime, 7).then((res) => {
    //     this.parseChartData('SNHUMI', 'day', res);
    // });

    // this.statistics('3.9', 'stat_hour_v3', startTime, 7).then((res) => {
    //     this.parseChartData('SWHUMI', 'day', res);
    // });

    // this.statistics('4.3', 'stat_hour_v3', startTime, 1).then((res) => {
    //   this.parseChartData('CO2', 'day', startTime, endTime, res);
    // });
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
          //   backgroundColor: '#F7F7F7',
          title: PluginStrings.historyData,
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

    hideOverlayVisible = () => {
      this.setState({ overlayVisible: false });
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
      const _time_end = _time_start + (nums + 1) * 24 * 60 * 60;


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

    parseChartData = (key, dt, res) => {
      console.log('parseChartData', key, dt, res);
      let that = this;
      let xData = [];
      let yData = [];
      let result = res.result;

      if (result.length === 0) {
        this.setChartData(key, xData, yData);
        return;
      } else {

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
        } else {
          for (let i = 0; i < result.length; i++) {
            let item = result[i];
            let value = JSON.parse(item.value)[0];
            if (value) {
              let time = that.conversionTime(dt, item.time * 1000);
              xData.push(time);
              yData.push(this.formatNumber(value));
            }

          }
        }
      }
      // console.log('parseChartData', key, dt, xData, yData);
      this.setChartData(key, xData, yData);
    }

    setChartData = (key, xData, yData) => {
      if (key === 'SNTEMP') {
        this.setState({
          snTempXData: xData,
          snTemp: yData
        });
      } else if (key === 'SWTEMP') {
        this.setState({
          swTempXData: xData,
          swTemp: yData
        });
      } else if (key === 'SNHUMI') {
        this.setState({
          snHumiXData: xData,
          snHumi: yData
        });
      } else if (key === 'SWHUMI') {
        this.setState({
          swHumiXData: xData,
          swHumi: yData
        });
      } else if (key === 'CO2') {
        //   yData 数据为整数
        yData = yData.map((item) => {
          return Math.round(item);
        });
        this.setState({
          xData3: xData,
          co2: yData
        });
      } else if (key === 'PM25') {
        //   yData 数据为整数
        yData = yData.map((item) => {
          return Math.round(item);
        });
        this.setState({
          xData4: xData,
          pm25: yData
        });
      } else if (key === 'VOC') {
        // yData 数据进行四舍五入
        yData = yData.map((item) => {
          return Math.round(item);
        });
        this.setState({
          xData5: xData,
          voc: yData
        });
      } else if (key === 'CHO2') {
        this.setState({
          xData6: xData,
          ch2o: yData
        });
      }
    }
    mergeAndFill(obj1, obj2, fillValue = 0) {
      // Step 1: 合并并去重 xData
      const allX = Array.from(new Set([...obj1.xData, ...obj2.xData])).sort((a, b) => a - b);

      // Step 2: 创建 x 到 y 的映射
      const map1 = new Map(obj1.xData.map((x, i) => [x, obj1.yData[i]]));
      const map2 = new Map(obj2.xData.map((x, i) => [x, obj2.yData[i]]));

      // Step 3: 构建完整的 xData 和 yData
      const filled1 = {
        xData: allX,
        yData: allX.map((x) => map1.has(x) ? map1.get(x) : fillValue)
      };
      const filled2 = {
        xData: allX,
        yData: allX.map((x) => map2.has(x) ? map2.get(x) : fillValue)
      };

      return [filled1, filled2];
    }


    formatNumber(value) {
      const num = parseFloat(value); // 转换为数字
      if (!num || isNaN(num)) {
        return 0;
      }
      console.log('formatNumber', num, Number.isInteger(num));
      return Number.isInteger(num) ? num : num.toFixed(1);
      // return Number.isInteger(num) ? num : num.toFixed(1);
    }

    conversionTime = (type, time) => {
      const date = new Date(time);
      if (type === 'day') {
        return `${ date.getHours().toString().padStart(2, '0') }:${ date.getMinutes().toString().padStart(2, '0') }`;
      } else {
        return `${ (date.getMonth() + 1).toString().padStart(2, '0') }/${ date.getDate().toString().padStart(2, '0') }`;
      }
    }

    get tempProps() {
      let xData = this.state.snTempXData.length > 0 ? this.state.snTempXData : this.state.swTempXData;
      let title = PluginStrings.chart1Title;
      console.log('tempProps', title, xData, [this.state.snTemp, this.state.swTemp]);
      // 如果只有hasIndoorTemp = true has
      if (this.state.hasIndoorTemp && !this.state.hasOutdoorTemp) {
        title = PluginStrings.chart1Title1;
      } else if (!this.state.hasIndoorTemp && this.state.hasOutdoorTemp) {
        title = PluginStrings.chart1Title2;
      }

      return {
        title: title,
        itemName: [PluginStrings.snTemp, PluginStrings.swTemp],
        xData: xData,
        yData: [this.state.snTemp, this.state.swTemp],
        key: 'temp',
        unit: '°C'
      };
    }

    get humiProps() {
      // console.log('humiProps', this.state.xData2, [this.state.snHumi, this.state.swHumi]);
      let xData = this.state.snHumiXData.length > 0 ? this.state.snHumiXData : this.state.swHumiXData;
      let title = PluginStrings.chart2Title;
      // 如果只有hasIndoorHumi = true
      if (this.state.hasIndoorHumi && !this.state.hasOutdoorHumi) {
        title = PluginStrings.chart2Title1;
      } else if (!this.state.hasIndoorHumi && this.state.hasOutdoorHumi) {
        title = PluginStrings.chart2Title2;
      }
      return {
        title: title,
        itemName: [PluginStrings.snHumi, PluginStrings.swHumi],
        xData: xData,
        yData: [this.state.snHumi, this.state.swHumi],
        key: 'humi',
        unit: '%'
      };
    }

    get co2Props() {
      // console.log('co2Props', this.state.xData1, [this.state.snTemp, this.state.swTemp]);
      return {
        title: PluginStrings.chart3Title,
        itemName: ['CO₂'],
        xData: this.state.xData3,
        yData: [this.state.co2],
        key: 'co2',
        unit: 'ppm'
      };
    }

    get pm25Props() {
      console.log('pm25Props', this.state.xData4, [this.state.pm25]);
      return {
        title: PluginStrings.chart4Title,
        itemName: ['PM2.5'],
        xData: this.state.xData4,
        yData: [this.state.pm25],
        key: 'pm25',
        unit: 'μg/m³'
      };
    }

    get vocProps() {
      console.log('co2Props', this.state.xData1, [this.state.snTemp, this.state.swTemp]);
      return {
        title: PluginStrings.chart5Title,
        itemName: ['VOC'],
        xData: this.state.xData5,
        yData: [this.state.voc],
        key: 'voc',
        unit: ''
      };
    }

    get cho2Props() {
      // console.log('co2Props', this.state.xData1, [this.state.snTemp, this.state.swTemp]);
      let yData = this.state.ch2o;
      yData = yData.map((item) => {
        // / 100 保留 2 位小数
        item = parseFloat(item);
        if (isNaN(item)) {
          return 0; // 如果不是数字，则返回 0
        }
        item = Math.round(item) / 100; // 保留两位小数
        return item; // 转换为 mg/m³
      });
      return {
        title: PluginStrings.chart6Title,
        itemName: ['CH₂O'],
        xData: this.state.xData6,
        yData: [yData],
        key: 'cho2',
        unit: 'mg/m³'
      };
    }


    getChartData = (key, dateType) => {
      console.log('getChartData', key, dateType);
      let nowTime = new Date();
      let dTime = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate());
      let dt = dateType;
      let api_date_type = 'stat_hour_v3';
      let api_prop = '';
      let dayNums = 1;

      console.log('getChartData', key, dt);
      let startTime = Math.floor(dTime.getTime() / 1000);
      if (dt === 'day') {
        dayNums = 1;
        api_date_type = 'stat_hour_v3';
      } else if (dt === 'week') {
        dayNums = nowTime.getDay() - 1;
        startTime = startTime - dayNums * 24 * 60 * 60;
        api_date_type = 'stat_day_v3';
      }

      if (key === 'SNTEMP') {
        api_prop = '3.1';
      } else if (key === 'SWTEMP') {
        api_prop = '3.2';
      } else if (key === 'PM25') {
        api_prop = '3.4';
      } else if (key === 'CO2') {
        api_prop = '3.5';
      } else if (key === 'SNHUMI') {
        api_prop = '3.8';
      } else if (key === 'SWHUMI') {
        api_prop = '5.15';
      } else if (key === 'VOC') {
        api_prop = '3.6';
      } else if (key === 'CHO2') {
        api_prop = '3.7';
      }

      let that = this;

      this.statistics(api_prop, api_date_type, startTime, dayNums).then((res) => {
        that.parseChartData(key, dt, res);
      }).catch((err) => {
        console.log('key = ', err, key);
      });
    };

    changeDate = (dt, type) => {
      console.log('changeDate', dt, type);
      if (type === 'temp') {
        if (this.state.hasIndoorTemp) {
          this.getChartData('SNTEMP', dt);
        }
        if (this.state.hasOutdoorTemp) {
          this.getChartData('SWTEMP', dt);
        }
      } else if (type === 'humi') {
        if (this.state.hasIndoorHumi) {
          this.getChartData('SNHUMI', dt);
        }
        if (this.state.hasOutdoorHumi) {
          this.getChartData('SWHUMI', dt);
        }
      } else if (type === 'co2') {
        if (this.state.hasCo2) {
          this.getChartData('CO2', dt);
        }
      } else if (type === 'pm25') {
        if (this.state.hasPm25) {
          this.getChartData('PM25', dt);
        }
      } else if (type === 'voc') {
        if (this.state.hasVoc) {
          this.getChartData('VOC', dt);
        }
      } else if (type === 'cho2') {
        if (this.state.hasCho2) {
          this.getChartData('CHO2', dt);
        }
      }
    }

    render() {
      return (
        <View style={styles.chartPage}>

          <ScrollView removeClippedSubviews={false} style={{ flex: 1, marginBottom: 20, backgroundColor: '#212330' }} onMomentumScrollEnd={() => {

          }}>
            <View style={styles.container}>
              {/* 如果室内外温度都没有则不显示 */}
              {this.state.hasIndoorTemp || this.state.hasOutdoorTemp ? (
                <View style={styles.mt12}>
                  <ChartCom params={this.tempProps} changeDate={this.changeDate}></ChartCom>
                </View>
              ) : null}
              {this.state.hasIndoorHumi || this.state.hasOutdoorHumi ? (
                <View style={styles.mt12}>
                  <ChartCom params={this.humiProps} changeDate={this.changeDate}></ChartCom>
                </View>
              ) : null}
              {this.state.hasCo2 ? (
                <View style={styles.mt12}>
                  <ChartCom params={this.co2Props} changeDate={this.changeDate}></ChartCom>
                </View>
              ) : null}
              {this.state.hasPm25 ? (
                <View style={styles.mt12}>
                  <ChartCom params={this.pm25Props} changeDate={this.changeDate}></ChartCom>
                </View>
              ) : null}
              {this.state.hasVoc ? (
                <View style={styles.mt12}>
                  <ChartCom params={this.vocProps} changeDate={this.changeDate}></ChartCom>
                </View>
              ) : null}
              {this.state.hasCho2 ? (
                <View style={styles.mt12}>
                  <ChartCom params={this.cho2Props} changeDate={this.changeDate}></ChartCom>
                </View>
              ) : null}
            </View>
          </ScrollView>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  chartPage: {
    // width: '100%',
    flex: 1,
    backgroundColor: '#212330'
  },
  container: {
    flex: 1,
    backgroundColor: '#212330'
  },
  chartItem: {
    // marginLeft: 12,
    // marginRight: 12
  },
  mt12: {
    marginTop: 12
  }
});

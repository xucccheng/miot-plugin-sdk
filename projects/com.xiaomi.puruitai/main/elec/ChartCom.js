import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNEChartsPro from 'react-native-echarts-pro';
import PluginStrings from '../../resources/strings';
import { DarkMode } from 'miot';

let isDark = DarkMode.getColorScheme() === 'dark' ? true : false;

const chartCom = (props) => {
  const echartsRef = new useRef(null);
  const [id, setId] = useState(props.id);
  const [selectedData, setSelectedData] = useState('--');
  const [dateType, setDateType] = useState('week');
  const [chartType, setChartType] = useState(null);
  const [title, setTitle] = useState(props.title || '');
  const [subTitle, setSubTitle] = useState('');
  const [tabList, setTabList] = useState(props.tabList || []);
  const [unit, setUnit] = useState('℃');
  const [time, setTime] = useState(props.time || '');
  const [selectLastTime, setSelectLastTime] = useState('');
  const [selectLastWeek, setSelectLastWeek] = useState('');
  const [selectLastMonth, setSelectLastMonth] = useState('');
  const [selectLastYear, setSelectLastYear] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [options, setOptions] = useState({
    grid: {
      left: '5%',
      right: '5%',
      bottom: '3%',
      top: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line', // 设置辅助线类型为线
        lineStyle: {
          color: 'transparent', // 设置辅助线颜色为绿色
          width: 1, // 设置辅助线宽度
          type: 'dashed' // 设置辅助线样式为虚线
        },
        label: {
          backgroundColor: '#000' // 修改提示点的背景颜色
        }
      },
      formatter: '{c}kwh'
    },
    xAxis: {
      type: 'category',
      data: [], // x 轴数据,
      boundaryGap: true,
      axisTick: {
        show: false // 隐藏刻度线
      },
      splitLine: {
        show: false // 显示网格线
      },
      axisLine: {
        show: false, // 显示主轴线
        lineStyle: {
          color: '#B2B2B2', // 设置颜色
          width: 1 // 设置线条宽度
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#B2B2B2', // Y 轴轴线颜色
          width: 0 // 可调整轴线宽度
        }
      },
      axisTick: {
        show: false // 隐藏刻度线
      },
      splitLine: {
        show: true, // 显示网格线
        lineStyle: {
          color: 'rgba(204, 204, 204, .4)' // 网格线颜色
        }
      }
    },
    series: [
      {
        data: [], // y 轴数据
        type: 'bar',
        smooth: true, // 平滑曲线
        barWidth: 30,
        lineStyle: {
          normal: {
            color: 'rgba(68, 126, 242, .3)'// 提示的颜色
          }
        },
        itemStyle: {
          normal: {
            color: 'rgba(68, 126, 242, .3)', // 折线的颜色
            lineStyle: {
              color: '#447EF2'// 折线的颜色
            }
          },
          emphasis: {
            color: '#447EF2' // 选中柱子的颜色
          }
        }
      }
    ]
  });

  const selectDate = () => {
    props.showOverlay({
      type: dateType,
      time: time.time,
      id: id
    });
  };

  // 初始化
  useEffect(() => {
    const mDarkModeListener = DarkMode.addChangeListener((object) => {
      if (object.colorScheme) {
        setIsDarkMode(object.colorScheme === 'dark');
      }
    });

    setChartType(tabList[0]?.key);
    setSubTitle(tabList[0]?.subTitle);
    setUnit(tabList[0]?.unit);
    return () => {
      DarkMode.removeChangeListener(mDarkModeListener);
    };
  }, []);

  // 监听time
  useEffect(() => {
    setTime(props.time);
    props.getChartData(chartType, dateType, props.time.time);
  }, [props.time]);

  // 监听 x，y的数据
  useEffect(() => {
    // setOptions((prevOptions) => ({
    //   ...prevOptions,
    //   xAxis: {
    //     ...prevOptions.xAxis,
    //     data: props.xData // 更新 x 轴的数据
    //   },
    //   series: [{
    //     ...prevOptions.series[0],
    //     data: props.yData // 更新 y 轴的数据
    //   }]
    // }));

    let option = {
      ...options,
      // tooltip: {
      //     ...options.tooltip,
      //     formatter: toolTipFormatter
      // },
      xAxis: {
        ...options.xAxis,
        data: props.xData // 更新 x 轴的数据
      },
      series: [{
        ...options.series[0],
        data: props.yData // 更新 y 轴的数据
      }]
    };
    setTimeout(() => {
      if (!echartsRef.current) return;

      echartsRef.current.setNewOption(option, { notMerge: true });
    }, 600);
    console.log(option);


  }, [props.xData, props.yData]);

  const getWeekDates = (date = new Date()) => {
    const firstDayOfWeek = 1; // Monday
    const lastDayOfWeek = 7; // Sunday

    const firstJan = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstJan) / 86400000 + 1;

    const weekNumber = Math.ceil((pastDaysOfYear - (7 - firstJan.getDay() + firstDayOfWeek)) / 7) + 1;

    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay() + firstDayOfWeek));
    let endOfWeek = new Date(date.setDate(startOfWeek.getDate() + lastDayOfWeek - firstDayOfWeek));
    endOfWeek = endOfWeek > new Date() ? new Date() : endOfWeek;
    return {
      weekNumber: weekNumber,
      startOfWeek: startOfWeek.getTime() > endOfWeek.getTime() ? endOfWeek : startOfWeek,
      endOfWeek: endOfWeek
    };
  };

  // 日-时间格式化
  const formattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要 +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${ year }/${ month }/${ day }`;
  };

  // 选择日期类型
  const selectDateType = (dt) => {
    let lastTime = {};
    // 缓存之前的数据
    if (dateType === 'day') {
      setSelectLastTime(time);
    } else if (dateType === 'week') {
      setSelectLastWeek(time);
    } else if (dateType === 'month') {
      setSelectLastMonth(time);
    }
    const today = new Date();

    if (dt === 'day') {
      lastTime = selectLastTime;
      if (!lastTime) {
        lastTime = {
          txt: formattedDate(today),
          time: today
        };
      }
      setTime(lastTime);
    } else if (dt === 'week') {
      lastTime = selectLastWeek;
      if (!lastTime) {
        let d = getWeekDates();
        let txt = `${ formattedDate(d.startOfWeek) }-${ formattedDate(d.endOfWeek) }`;
        lastTime = {
          txt: txt,
          time: d.startOfWeek
        };
      }
      setTime(lastTime);
    } else if (dt === 'month') {
      lastTime = selectLastMonth;
      if (!lastTime) {
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        today.setDate(1);
        lastTime = {
          txt: `${ year }/${ month.toString().padStart(2, '0') }`,
          time: today
        };
      }
      setTime(lastTime);
    } else if (dt === 'year') {
      lastTime = selectLastYear;
      if (!lastTime) {
        let year = today.getFullYear();
        lastTime = {
          txt: `${ year }${ PluginStrings.year }`,
          time: today
        };
      }
      setTime(lastTime);
    }
    props.getChartData(chartType, dt, lastTime.time);
    setDateType(dt);
  };

  // 选择折线图的类型
  const selectChartType = (type, index) => {
    setChartType(tabList[index]?.key);
    setSubTitle(tabList[index]?.subTitle);
    setUnit(tabList[index]?.unit);
    props.getChartData(type, dateType, time.time);
  };

  // 点击折线图事件
  const handleChartClick = (params) => {
    // setSelectedData(params.data); // 更新选中数据到状态
  };

  return (
    <View style={styles.chartContainer}>
      <View style={styles.header}>
        <View style={styles.dateCom}>
          <Text style={[styles.dateItem, dateType === 'week' ? styles.active : '']}
            onPress={() => selectDateType('week')}>{PluginStrings.week}</Text>
          <Text style={[styles.dateItem, dateType === 'month' ? styles.active : '']}
            onPress={() => selectDateType('month')}>{PluginStrings.month}</Text>
          <Text style={[styles.dateItem, dateType === 'year' ? styles.active : '']}
            onPress={() => selectDateType('year')}>{PluginStrings.year}</Text>
        </View>
      </View>
      <View style={styles.selectDate}>
        <Text style={[styles.selectDateTxt]} onPress={selectDate}>{time.txt}</Text>
        <View style={[styles.triangle, { borderTopColor: isDark ? 'xmrgba(255, 255, 255, .8)' : '#1C2229' }]}></View>
      </View>
      <View style={styles.numsRow}>
        <Text style={styles.grade}>{PluginStrings.addUpElec}</Text>
        {/* <Text style={styles.nums}>{this.state.selectedData}
                        <Text style={styles.unit}>w</Text>
                    </Text> */}
      </View>
      {/* 监听事件回调 */}
      <RNEChartsPro ref={echartsRef} style={styles.charts} option={options} height={199}
        onPress={handleChartClick} />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    borderRadius: 12,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: '#fff'
  },
  header: {
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {},
  titleText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold'
  },
  subTitleText: {
    fontSize: 12,
    color: '#999'
  },
  dateCom: {
    backgroundColor: "#f2f2f2",
    flex: 1,
    height: 30,
    borderRadius: 6,
    padding: 3,
    alignItems: 'center',
    flexDirection: 'row'
  },
  dateItem: {
    flex: 1,
    height: 22,
    textAlign: 'center',
    lineHeight: 22,
    color: '#999999'
  },
  active: {
    // margin: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    color: '#000'
  },
  selectDate: {
    paddingTop: 5,
    fontSize: 12,
    color: '#999',
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectDateTxt: {
    color: '#999',
    fontSize: 12,
    paddingVertical: 10
  },
  triangle: {
    marginLeft: 6,
    width: 0,
    height: 0,
    borderLeftWidth: 4, // 左边框宽度
    borderRightWidth: 4, // 右边框宽度
    borderTopWidth: 6, // 上边框宽度
    borderLeftColor: 'transparent', // 左边透明
    borderRightColor: 'transparent', // 右边透明
    borderTopColor: '#1C2229' // 顶边黑色
  },
  numsRow: {
    flexDirection: 'column',
    // marginTop: 12,
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  grade: {
    color: "#000",
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2
  },
  nums: {
    marginTop: 5,
    color: "#447EF2",
    fontSize: 26,
    fontWeight: 'bold'
  },
  unit: {
    fontSize: 12,
    fontWeight: 'normal'
  },
  charts: {

    marginLeft: 12
  },
  chartType: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
    height: 30,
    backgroundColor: '#f2f2f2',
    borderRadius: 6,
    flexDirection: 'row'
  },
  chartItem: {
    flex: 1,
    textAlign: 'center',
    lineHeight: 26,
    color: '#999',
    margin: 3,
    borderRadius: 4
  },
  chartActive: {
    backgroundColor: '#FFFFFF',
    color: '#000'
  }
});


export default chartCom;
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNEChartsPro from 'react-native-echarts-pro';
import PluginStrings from '../../resources/strings';
import { DarkMode } from 'miot';

let isDark = DarkMode.getColorScheme() === 'dark' ? true : false;

const IndoorHumiCom = (props) => {
  const echartsRef = new useRef(null);
  const [id, setId] = useState(props.id);
  const [selectedData, setSelectedData] = useState('--');
  const [dateType, setDateType] = useState('day');
  const [chartType, setChartType] = useState(null);
  const [title, setTitle] = useState(props.title || '');
  const [subTitle, setSubTitle] = useState('');
  const [tabList, setTabList] = useState(props.tabList || []);
  const [unit, setUnit] = useState('℃');
  const [time, setTime] = useState(props.time || '');
  const [selectLastTime, setSelectLastTime] = useState('');
  const [selectLastWeek, setSelectLastWeek] = useState('');
  const [selectLastMonth, setSelectLastMonth] = useState('');
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
      formatter: '{c} '
    },
    xAxis: {
      type: 'category',
      data: [],
      boundaryGap: false,
      splitLine: {
        show: false // 显示网格线
      },
      axisTick: {
        show: false // 隐藏刻度线
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
        show: false,
        lineStyle: {
          color: '#B2B2B2', // Y 轴轴线颜色
          width: 1 // 可调整轴线宽度
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
        data: [],
        type: 'line',
        smooth: true, // 平滑曲线
        showSymbol: false, // 不显示数据点
        lineStyle: {
          normal: {
            color: '#447EF2'// 提示的颜色
          },
          color: '#447EF2'
        },
        areaStyle: {
          normal: {
            color: {
              type: 'linear', // 必须是 "linear"
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(68,126,242,0.25)' }, // 渐变开始颜色
                { offset: 0.8, color: 'rgba(255,255,255,0)' }, // 渿变结束颜色
                { offset: 1, color: 'transparent' } // 渿变结束颜色
              ],
              global: false // 局部渐变
            }
          }
        },
        itemStyle: {
          normal: {
            color: '#447EF2', // 折线的颜色
            lineStyle: {
              color: '#447EF2'// 折线的颜色
            }
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
    if (!chartType) return;
    props.getChartData(chartType, dateType, props.time.time);
  }, [props.time]);

  // 监听 x，y的数据
  useEffect(() => {
    // setOptions((prevOptions) => ({
    //     ...prevOptions,
    //     xAxis: {
    //         ...prevOptions.xAxis,
    //         data: props.xData // 更新 x 轴的数据
    //     },
    //     series: [{
    //         ...prevOptions.series[0],
    //         data: props.yData // 更新 y 轴的数据
    //     }]
    // }));
    console.log('=====useEffect', props.xData, props.yData);
    setTimeout(() => {
      refreshChart();
    }, 600);

  }, [props.xData, props.yData]);

  const refreshChart = () => {
    console.log('refreshChart', props.xData, props.yData);
    let option = {
      ...options,
      xAxis: {
        ...options.xAxis,
        data: props.xData // 更新 x 轴的数据
      },
      series: [{
        ...options.series[0],
        data: props.yData // 更新 y 轴的数据
      }]
    };
    if (!echartsRef.current) return;

    // console.log('option', option);
    echartsRef.current.setNewOption(option, { notMerge: true });
  };

  // 获取周一到周日
  const getWeekDates = (date = new Date()) => {
    console.log('getWeekDates', date);
    // 获取当前日期的年份和月份
    const firstDayOfWeek = 1; // Monday
    const lastDayOfWeek = 7; // Sunday
    // 如果是周日，则获取上一周的周一到周日
    // console.log('firstJan.getDay()', firstJan.getDay());
    const isWeekStart = date.getDay() === 0; // 判断是否是周日
    if (isWeekStart) {
      startOfWeek = new Date(date.setDate(date.getDate() - date.getDay() - 6));
    } else {
      startOfWeek = new Date(date.setDate(date.getDate() - date.getDay() + firstDayOfWeek));
    }

    let endOfWeek = new Date(date.setDate(startOfWeek.getDate() + lastDayOfWeek - firstDayOfWeek));

    endOfWeek = endOfWeek > new Date() ? new Date() : endOfWeek;
    const weekNumber = endOfWeek;
    return {
      weekNumber: weekNumber,
      startOfWeek: startOfWeek,
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
    }
    console.log(lastTime.time);
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
    // console.log('params', params)
    // setSelectedData(params.data); // 更新选中数据到状态
  };

  return (
    <View style={styles.chartContainer}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.subTitleText}>{subTitle}</Text>
        </View>
        <View style={styles.dateCom}>
          <Text style={[styles.dateItem, dateType === 'day' ? styles.active : '']}
            onPress={() => selectDateType('day')}>{PluginStrings.day}</Text>
          <Text style={[styles.dateItem, dateType === 'week' ? styles.active : '']}
            onPress={() => selectDateType('week')}>{PluginStrings.week}</Text>
          <Text style={[styles.dateItem, dateType === 'month' ? styles.active : '']}
            onPress={() => selectDateType('month')}>{PluginStrings.month}</Text>
        </View>
      </View>

      <View style={styles.selectDate}>
        <Text style={[styles.selectDateTxt]} onPress={selectDate}>{time.txt}</Text>
        <View style={[styles.triangle, { borderTopColor: isDarkMode ? 'xmrgba(255,255,255,.8)' : '#1C2229' }]}></View>
      </View>

      {/* <View style={styles.numsRow}>
            <Text style={styles.nums}>{selectedData}
                <Text style={styles.unit}>{unit}</Text>
            </Text>
        </View> */}

      <RNEChartsPro ref={echartsRef} style={styles.charts} option={options} height={199}
        // webViewSettings={{
        //     nestedScrollEnabled: true, // <=== This line
        // }}
        // enableParseStringFunction={true}
        onPress={(res) => handleChartClick(res)} />

      <View style={styles.chartType}>
        {tabList.map((item, index) => (
          <Text style={[styles.chartItem, chartType === item.key ? styles.chartActive : '']}
            key={item.key}
            onPress={() => selectChartType(item.key, index)}>{item.value}</Text>
        ))}
      </View>
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
    width: 138,
    height: 28,
    borderRadius: 6,
    padding: 3,
    alignItems: 'center',
    flexDirection: 'row'
  },
  dateItem: {
    width: 44,
    height: 22,
    textAlign: 'center',
    lineHeight: 22,
    color: '#999999'
  },
  active: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    color: '#000'
  },
  selectDate: {
    fontSize: 12,
    color: '#999',
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  selectDateTxt: {
    color: '#999',
    fontSize: 12,
    paddingVertical: 15
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
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 15,
    paddingLeft: 20,
    paddingRight: 20
  },
  nums: {
    color: "#447EF2",
    fontSize: 26,
    fontWeight: 'bold'
  },
  unit: {
    fontSize: 12,
    fontWeight: 'normal'
  },
  grade: {
    color: "#447EF2",
    fontSize: 15,
    marginTop: 11,
    marginLeft: 10
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

export default IndoorHumiCom;
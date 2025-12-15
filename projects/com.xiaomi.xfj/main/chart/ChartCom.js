import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNEChartsPro from 'react-native-echarts-pro';
import PluginStrings from '../../resources/strings';
import { DarkMode } from 'miot';
import { set } from '../../resources/strings/zh';

let isDark = DarkMode.getColorScheme() === 'dark' ? true : false;

const colorList = ['#FFD700', '#00D7FF'];

const IndoorHumiCom = ({ params, changeDate }) => {
    const echartsRef = new useRef(null);

    const [dateType, setDateType] = useState('week');
    const [unit, setUnit] = useState('℃');
    const [timer, setTimer] = useState(0);

    const [toolTipFormatter, setToolTipFormatter] = useState();
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
            backgroundColor: '#2F3045',
            borderColor: 'rgba(255, 255, 255, .2)',
            textStyle: { color: '#fff' },
            axisPointer: {
                lineStyle: {
                    color: "#999" // 更新线条颜色为绿色
                }
            },
            formatter: `{b0}<br />{a0} <span style="margin-left: 20px; color: #1cbcb4">{c0} ${unit}</span><br />`
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
                    color: 'rgba(255, 255, 255, .5)', // 设置颜色
                    width: 1 // 设置线条宽度
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                show: false,
                lineStyle: {
                    color: 'rgba(255, 255, 255, .5)', // Y 轴轴线颜色
                    width: 1 // 可调整轴线宽度
                }
            },
            axisTick: {
                show: false // 隐藏刻度线
            },
            splitLine: {
                show: true, // 显示网格线
                lineStyle: {
                    color: 'rgba(255, 255, 255, .2)' // 网格线颜色
                }
            }
        },

        series: [
            // {
            //     name: '室内温度',
            //     type: 'line',
            //     data: [],
            //     // smooth: true,
            //     lineStyle: { color: '#FFD700' },
            //     itemStyle: { color: '#FFD700' }
            // },
            // {
            //     name: '室外温度',
            //     type: 'line',
            //     data: [],
            //     // smooth: true,
            //     lineStyle: { color: '#00D7FF' },
            //     itemStyle: { color: '#00D7FF' }
            // }
        ]
    });

    // 初始化
    useEffect(() => {
        clearTimeout(timer);
        setTimer(setTimeout(() => {
            setToolTipFormatter(`{b0}<br />{a0} <span style="margin-left: 20px; color: #1cbcb4">{c0} ${unit}</span><br />{a1} <span style="margin-left: 20px; color: #1cbcb4">{c1} ${unit}</span>`);
        }, 700));
    }, []);

    useEffect(() => {
        let option = {
            ...options,
            tooltip: {
                ...options.tooltip,
                formatter: toolTipFormatter
            }
        };

        if (!echartsRef.current) return;
        echartsRef.current.setNewOption(option, { notMerge: true });
    }, [toolTipFormatter]);

    // 监听 x，y的数据
    useEffect(() => {
        clearTimeout(timer);
        setTimer(setTimeout(() => {
            refreshChart();
        }, 700));

    }, [params.xData, params.yData]);

    const refreshChart = () => {

        const serData = [];

        for (let i = 0; i < params.yData.length; i++) {
            if (!params.yData[i] || params.yData[i].length === 0) {
                continue;
            }
            let d = {
                name: params.itemName[i],
                type: 'line',
                data: params.yData[i], // 更新 y 轴的数据,
                // smooth: true,
                lineStyle: { color: colorList[i] },
                itemStyle: { color: colorList[i] }
            };
            serData.push(d);
        }

        let toolFormatterTxt = '';
        if (serData.length === 0) {
            return;
        } else {
            let tooltipList = [`{b${0}}`];
            for (let i = 0; i < serData.length; i++) {
                tooltipList.push(`{a${i}} <span style="margin-left: 20px; color: #1cbcb4">{c${i}} ${params.unit}</span>`);
            }
            toolFormatterTxt = tooltipList.join('<br />');
        }
        let option = {
            ...options,
            tooltip: {
                ...options.tooltip,
                formatter: toolFormatterTxt
            },
            xAxis: {
                ...options.xAxis,
                data: params.xData // 更新 x 轴的数据
            },
            series: serData
        };
        if (!echartsRef.current) return;
        echartsRef.current.setNewOption(option, { notMerge: true });
    };

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
            startOfWeek: startOfWeek,
            endOfWeek: endOfWeek
        };
    };

    // 日-时间格式化
    const formattedDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要 +1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    // 选择日期类型
    const selectDateType = (dt) => {
        setDateType(dt);
        changeDate(dt, params.key);
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
                    <Text style={styles.titleText}>{params.title}</Text>
                </View>
                <View style={styles.dateCom}>
                    <Text style={[styles.dateItem, dateType === 'week' ? styles.active : '']}
                        onPress={() => selectDateType('week')}>{PluginStrings.week}</Text>
                    <Text style={[styles.dateItem, dateType === 'day' ? styles.active : '']}
                        onPress={() => selectDateType('day')}>{PluginStrings.day}</Text>
                </View>
            </View>

            <RNEChartsPro ref={echartsRef} style={styles.charts} option={options} height={199}
                onPress={(res) => handleChartClick(res)} />
        </View>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        flex: 1,
        marginLeft: 14,
        marginRight: 14,
        borderRadius: 17,
        paddingTop: 18,
        paddingBottom: 18,
        backgroundColor: '#2F3045'
    },
    header: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {},
    titleText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold'
    },
    subTitleText: {
        fontSize: 12,
        color: '#999'
    },
    dateCom: {
        backgroundColor: "xmrgba(255, 255, 255, .1)",
        width: 87,
        height: 29,
        borderRadius: 6,
        padding: 3,
        alignItems: 'center',
        flexDirection: 'row'
    },
    dateItem: {
        width: 40,
        height: 23,
        textAlign: 'center',
        lineHeight: 23,
        color: '#000',
        borderRadius: 4,
        overflow: 'hidden'
    },
    active: {
        backgroundColor: '#1CBCB4',
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
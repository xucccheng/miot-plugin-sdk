import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import PluginStrings from '../../resources/strings';

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const Mon = PluginStrings.Mon;
const Tue = PluginStrings.Tue;
const Wed = PluginStrings.Wed;
const Thu = PluginStrings.Thu;
const Fri = PluginStrings.Fri;
const Sat = PluginStrings.Sat;
const Sun = PluginStrings.Sun;

const DatePicker = ({ type, updateData, time }) => {

  let nDate = new Date(time);
  nDate.setHours(0, 0, 0, 0);

  let nStart = new Date(nDate);
  let nEnd = new Date(nDate);
  if (type === 'day') {
    nEnd.setDate(nStart.getDate() + 1);
    nEnd = nEnd >= new Date() ? new Date() : nEnd;
  } else if (type === 'year') {
    nDate = new Date(Date.UTC(nDate.getFullYear(), 0, 1));
    nStart = new Date(nDate);
    nEnd = new Date(Date.UTC(nStart.getFullYear(), 11, 31));
  } else {
    nStart.setDate(nStart.getDate() - nStart.getDay() + 1);
    nEnd.setDate(nEnd.getDate() - nEnd.getDay() + 7);
    nEnd = nEnd >= new Date() ? new Date() : nEnd;
  }

  const [currentDate, setCurrentDate] = useState(nDate);
  const [selectedDate, setSelectedDate] = useState(nDate);

  const [dateType, setDateType] = useState(type); // 模式: day, week, month, year
  const [startOfWeek, setStartOfWeek] = useState(nStart);
  const [endOfWeek, setEndOfWeek] = useState(nEnd);

  const [selectedDateText, setSelectedDateText] = useState('');

  useEffect(() => {
    setDateType(type);
  }, []);

  useEffect(() => {
    setSelectedDateText(getSelectDate(selectedDate));
    updateData(confirmData());
  }, [selectedDate]);

  
  const confirmData = () => {
    let txt = '';
    if (dateType === 'day') {
      txt = [formattedDayDate(startOfWeek)].join("-");
    } else if (dateType === 'week') {
      txt = [formattedDayDate(startOfWeek), formattedDayDate(endOfWeek)].join("-");
    } else if (dateType === 'month') {
      let m = selectedDate.getMonth() + 1;
      m = m < 10 ? `0${ m }` : m;
      txt = `${ selectedDate.getFullYear() }/${ m }`;
    } else if (dateType === 'year') {
      txt = selectedDate.getFullYear() + PluginStrings.year;
    }
        
    return {
      txt: txt,
      time: selectedDate
    };
  };

  const formattedDayDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要 +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${ year }/${ month }/${ day }`;
  };

  // 获取月份和年份的显示格式
  const getMonthName = (date) => {
    // const options = { year: 'numeric', month: 'long' };
    if (dateType === 'day' || dateType === 'week') {
      return `${ date.getFullYear() }${ PluginStrings.year }${ date.getMonth() + 1 }${ PluginStrings.month }`;
    } else if (dateType === 'month') {
      return `${ date.getFullYear() }${ PluginStrings.year }`;
    } else if (dateType === 'year') {
      return `${ date.getFullYear() - 3 }${ PluginStrings.year }` + `~${ date.getFullYear() }${ PluginStrings.year }`;
    }
  };

  const getSelectDate = () => {
    if (dateType === 'day') {
      return `${ selectedDate.getMonth() + 1 }${ PluginStrings.month }${ selectedDate.getDate() }${ PluginStrings.day }`;
    } else if (dateType === 'week') {
      return `${ startOfWeek.getMonth() + 1 }${ PluginStrings.month }${ startOfWeek.getDate() }${ PluginStrings.day }`
                + ` - ${ endOfWeek.getMonth() + 1 }${ PluginStrings.month }${ endOfWeek.getDate() }${ PluginStrings.day }`;
    } else if (dateType === 'month') {
      return `${ selectedDate.getMonth() + 1 }${ PluginStrings.month }`;
    } else if (dateType === 'year') {
      return `${ selectedDate.getFullYear() }${ PluginStrings.year }`;
    }
  };

  // 获取当前月的日期数组
  const daysOfWeek = [Sun, Mon, Tue, Wed, Thu, Fri, Sat];

  const getDatesInMonth = (date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();
    const endDayOfWeek = lastDayOfMonth.getDay();
    const nowTime = new Date().getTime();
    const dates = [];
    for (let i = 1 - startDayOfWeek; i <= daysInMonth + (6 - endDayOfWeek); i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      if (date.getTime() > nowTime) {
        continue;
      }
      dates.push(date);
    }
    return dates;
  };

  const getMonthOrYearDates = (date) => {
    if (dateType === 'month') {
      let list = [];
      for (let i = 0; i < 12; i++) {
        list.push(i);
      }
      return list;
    } else {
      let n_date = new Date();
      let n_year = n_date.getFullYear();
      let list = [];
      for (let i = n_year - 3; i <= n_year; i++) {
        list.push(i);
      }
      return list;
    }

  };

  const parseWeekRange = (date) => {
    if (date.getDay() === 0) {
      let o = getWeekDates(date);
      const nextWeekStart = o.startOfWeek;
      nextWeekStart.setDate(nextWeekStart.getDate() - 7); // 设置为下周的开始日期
      setStartOfWeek(nextWeekStart);
      let nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd.setDate(nextWeekEnd.getDate() + 6);
      setEndOfWeek(nextWeekEnd); // 设置为下周的结束日期
      setSelectedDate(nextWeekStart);
    } else {
      let o = getWeekDates(date);

      setStartOfWeek(o.startOfWeek);
      setEndOfWeek(o.endOfWeek);
      setSelectedDate(o.startOfWeek);
    }
  };

  const handleSelectDate = (date) => {

    if (dateType === 'day') {
      setSelectedDate(date);
      setStartOfWeek(date);
      let start = date;
      start.setHours(0, 0, 0, 0);
      let end = new Date(start);
      end.setDate(end.getDate() + 1);
      setStartOfWeek(date);
      setEndOfWeek(end);
    } else if (dateType === 'week') {
      // 如果选中的是周日，选择下一周
      parseWeekRange(date);
    } else {
      setSelectedDate(date);
    }
  };

  const handlePreviousMonth = () => {
    if (dateType === 'day' || dateType === 'week') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (dateType === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
    }
  };

  const handleNextMonth = () => {
    if (dateType === 'day' || dateType === 'week') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (dateType === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
    }
  };

  const isNextMonth = (date) => {
    return date.getMonth() !== currentDate.getMonth();
  };

  const getWeekDates = (date = new Date()) => {
    const firstDayOfWeek = 1; // Monday
    const lastDayOfWeek = 7; // Sunday
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay() + firstDayOfWeek));
    startOfWeek.setHours(0, 0, 0, 0);
    let nowTime = new Date();
    nowTime.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(date.setDate(startOfWeek.getDate() + lastDayOfWeek - firstDayOfWeek));
    if (nowTime.getTime() <= endOfWeek.getTime()) {
      endOfWeek.setTime(nowTime.getTime());
    }
    endOfWeek.setHours(0, 0, 0, 0);
    return {
      startOfWeek: startOfWeek,
      endOfWeek: endOfWeek
    };
  };

  const isNext7Start = (date) => {
    if (!selectedDate || dateType !== 'week') {
      return false;
    }

    let sevenDaysStart = new Date(startOfWeek);
    sevenDaysStart.setHours(0, 0, 0, 0);

    let e = new Date();
    e.setHours(0, 0, 0, 0);
    if (e.getTime() === sevenDaysStart.getTime()) {
      return false;
    }
    sevenDaysStart.setDate(sevenDaysStart.getDate() - sevenDaysStart.getDay() + 1);

    return sevenDaysStart.getTime() === date.getTime();
  };

  const isNext7Day = (date) => {
    if (!selectedDate || dateType !== 'week') {
      return false;
    }

    let sevenDaysStart = new Date(selectedDate);
    sevenDaysStart.setDate(sevenDaysStart.getDate() - sevenDaysStart.getDay() + 1);

    let sevenDaysLater = new Date(selectedDate);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 6);

    let nowTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    let sevenDaysLaterTime = new Date(sevenDaysLater).getTime();

    sevenDaysLaterTime = sevenDaysLaterTime > nowTime ? nowTime : sevenDaysLaterTime;
    return sevenDaysStart < date.getTime() && date.getTime() < sevenDaysLaterTime;
  };

  const isNext7Last = (date) => {
    if (!selectedDate || dateType !== 'week') {
      return false;
    }

    const sevenDaysLater = new Date(selectedDate);

    sevenDaysLater.setDate(sevenDaysLater.getDate() + 6);
    sevenDaysLater.setHours(0, 0, 0, 0);
        
    let nowTime = new Date();
    nowTime.setHours(0, 0, 0, 0);

    // 如果选中的日期是今天，不显示
    if (sevenDaysLater.getTime() === nowTime.getTime()) {
      return false;
    }

    // 
    if (selectedDate.getTime() === nowTime.getTime()) {
      return false;   
    }

    // if (date.getTime() === nowTime.getTime()) {
    //     return true;
    // }

    if (sevenDaysLater.getTime() === nowTime.getTime()) {
      return false;
    }

    if (sevenDaysLater.getTime() > new Date(nowTime).getTime()) {
      return date.getTime() === new Date(nowTime).getTime();
    } else {
      return false;
    }
  };

  const isNext6Last = (date) => {
    if (!selectedDate || dateType !== 'week') {
      return false;
    }
    let nowTime = new Date();
    nowTime.setHours(0, 0, 0, 0);
    if (nowTime.getTime() <= endOfWeek.getTime()) {
      return false;
    } else {
      let n = new Date(startOfWeek.getTime());
      n.setDate(n.getDate() + 5);
      n.setHours(0, 0, 0, 0);
      if (n.getTime() === date.getTime()) {
        return true;
      } else {
        return false;
      }
    }
  };

  const renderDay = ({ item }) => {
    let isSelected = false;
    if (dateType === 'day') {
      isSelected = item.toLocaleDateString() === selectedDate.toLocaleDateString();
    } else {
      let d = new Date(selectedDate);
      d.setDate(d.getDate() - d.getDay() + 1);
      d.setHours(0, 0, 0, 0);
      isSelected = item.toLocaleDateString() === d.toLocaleDateString();
    }

    return (
      <View style={[
        styles.dayView
      ]}>

        <View style={[
          isNext7Start(item) && styles.weekStartDay,
          isNext7Day(item) && styles.nextDay,
          isNext7Last(item) && styles.weekLastDay,
          isNext6Last(item) && styles.week6Day
        ]}>
        </View>
        <TouchableOpacity
          style={[
            styles.day,
            isSelected && styles.selectedView,
            ((dateType === 'week' && (endOfWeek.getTime() === item.getTime())) || isNext7Last(item)) && styles.selectedView
          ]}
          onPress={() => handleSelectDate(item)}
        >
          <Text style={[
            styles.dayText,
            isNextMonth(item) && { color: '#999' },
            isSelected && styles.selectedViewText,
            ((dateType === 'week' && (endOfWeek.getTime() === item.getTime())) || isNext7Last(item)) && styles.selectedViewText
          ]}>{item.getDate()}</Text>
        </TouchableOpacity>

      </View>
    );
  };

  const selectMonthOrYear = (d) => {
    if (dateType === 'month') {
      let nm = new Date(selectedDate);

      let nmData = new Date(nm.getFullYear(), d, 1);

      nmData.setHours(0, 0, 0, 0);
      setSelectedDate(nmData);
    } else if (dateType === 'year') {

      let nmData = new Date(d, 0, 1);
      nmData.setHours(0, 0, 0, 0);
      setSelectedDate(nmData);
    }
  };
  const monthOrYearUnit = dateType === 'month' ? `${ PluginStrings.month }` : `${ PluginStrings.year }`;

  const renderMonthOrYear = ({ item }) => {
    let txt = item;
    let isSelected = false;
    if (dateType === 'month') {
      let d = new Date(selectedDate);
      d.setMonth(item);
      d.setHours(0, 0, 0, 0);
      txt = item + 1;
      isSelected = d.toLocaleDateString() === selectedDate.toLocaleDateString(); // item.toLocaleDateString() === selectedDate.toLocaleDateString();
    } else if (dateType === 'year') {
      let d = new Date(item, 0, 1);
      d.setHours(0, 0, 0, 0);
      isSelected = item === selectedDate.getFullYear();
    }

    return (
      <View style={[
        styles.monthView
      ]}>
        <TouchableOpacity
          style={[
            styles.month,
            isSelected && styles.selectedView
          ]}
          onPress={() => selectMonthOrYear(item)}
        >
          <Text style={[
            styles.monthText,
            isSelected && styles.selectedViewText
          ]}>{isSelected}{txt}{monthOrYearUnit}</Text>
        </TouchableOpacity>

      </View>
    );
  };

  const renderDateMode = () => {
    return (
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={handlePreviousMonth}>
            <Text style={styles.navButton}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>{getMonthName(currentDate)}</Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <Text style={styles.navButton}>{">"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.selectDaysView}>
          <Text style={[styles.selectDays]}>{selectedDateText}</Text>
        </View>

        {(dateType === 'day' || dateType === 'week') && <View style={styles.weekdays}>
          {daysOfWeek.map((day, index) => (
            <Text key={index} style={styles.weekdayText}>
              {day}
            </Text>
          ))}
        </View>
        }

        {(dateType === 'day' || dateType === 'week') && <FlatList
          data={getDatesInMonth(currentDate)}
          numColumns={7}
          keyExtractor={(item) => item}
          renderItem={renderDay}
          style={styles.dateGrid}
        />}
        {(dateType === 'month' || dateType === 'year') && <FlatList
          data={getMonthOrYearDates()}
          numColumns={4}
          keyExtractor={(item) => item}
          renderItem={renderMonthOrYear}
          style={styles.dateGrid}
        />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderDateMode()}
      {/* {mode === 'week' && renderWeekMode()} */}
      {/* {dateType === 'month' && renderMonthMode()} */}
      {/* {dateType === 'year' && renderYearMode()} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    width: screenWidth - 72,
    backgroundColor: 'white',
    paddingBottom: 10,
    // borderRadius: 10,
    // elevation: 5,
    alignSelf: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  navButton: {
    paddingHorizontal: 30,
    fontSize: 24,
    color: '#A2A2A2'
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  selectDaysView: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectDays: {
    marginTop: 5,
    fontSize: 14,
    color: '#666'
  },
  weekdays: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    marginTop: 20
    // marginVertical: 10,
  },
  weekdayText: {
    flexBasis: '14.28%',
    fontSize: 14,
    width: 30,
    textAlign: 'center'
  },
  dateGrid: {
    width: '100%'
    // marginVertical: 10,
  },
  dayView: {
    flexBasis: '14.28%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  day: {
    // flex: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2
  },
  dayText: {
    fontSize: 14
  },
  selectedView: {
    backgroundColor: '#447EF2'
  },
  selectedViewText: {
    color: 'white'
  },
  weekStartDay: {
    height: 30,
    width: '50%',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(68, 126, 242, .1)',
    position: 'absolute'
  },
  nextDay: {
    height: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(68, 126, 242, .1)',
    position: 'absolute'
  },
  week6Day: {
    height: 30,
    width: '75%',
    right: '25%',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(68, 126, 242, .1)',
    position: 'absolute'
  },
  weekLastDay: {
    height: 30,
    width: '50%',
    right: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(68, 126, 242, .1)',
    position: 'absolute'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    width: '48%',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
  activeButtonText: {
    color: '#fff'
  },
  modeButtonText: {
    color: '#333'
  },
  monthButton: {
    flex: 1,
    margin: 6,
    height: 32,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    alignItems: 'center'
  },
  yearButton: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
    alignItems: 'center'
  },
  monthItem: {
    height: 32
  },
  monthView: {
    flexBasis: '25%',
    height: 32,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
    // backgroundColor: '#F5F5F5',
  },
  month: {
    width: 70,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    textAlign: 'center',
    borderRadius: 6,
    fontSize: 14
  },
  monthText: {
    fontSize: 14
  }
});

export default DatePicker;
import React, { useRef, useState, useEffect, useMemo } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { DarkMode } from 'miot';
import { jiaShi, set, shouD } from "../../resources/strings/zh";
import PluginStrings from "../../resources/strings";

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");
// const baseImgUrl = '../../resources/images/';

const defaultImages = {
  timerIcon: require('../../resources/images/timer_icon.png'),
  nxhIcon: require('../../resources/images/nxh_icon.png'),
  shouDIcon: require('../../resources/images/shouD_icon.png'),
  ziDongIcon: require('../../resources/images/ziDong_icon.png'),
  jiaShiIcon: require('../../resources/images/jiaS_icon.png'),
  sfjIcon: require('../../resources/images/0_icon.png'),
  pfjIcon: require('../../resources/images/0_icon.png')
};

let isDark = false;
let mDarkModeListener = null;
const ModeCom = ({ pressMode, params, style }) => {

  const [list, setList] = useState([]);

  useEffect(() => {
    isDark = DarkMode.getColorScheme() === 'dark' ? true : false;

    mDarkModeListener = DarkMode.addChangeListener((object) => {
      if (object.colorScheme) {
        isDark = object.colorScheme === 'dark' ? true : false;
      }
    });
  }, []);

  useEffect(() => {
    setList([{
      icon: defaultImages.timerIcon,
      title: PluginStrings.timer,
      key: 'mode'
    }, {
      icon: defaultImages.sfjIcon,
      title: PluginStrings.songFJ,
      key: 'fanLevel'
    }, {
      icon: defaultImages.pfjIcon,
      title: PluginStrings.paiFJ,
      key: 'exhaustLevel'
    }, {
      img: defaultImages.nxhIcon,
      txt: PluginStrings.nxh,
      key: 'action'
    }]);
    console.log('list', list);
  }, []);

  useEffect(() => {
    // specialFunction3Type = 0的时候不需要action

    console.log('params.specialFunction3Type', params.specialFunction3Type);

    console.log('params.fanLevelMax', params.fanLevelMax, params.fanLevelMax === 0);

    if (params.fanLevelMax === 0) {
      setList((prev) => prev.filter((item) => item.key !== 'fanLevel')); // 移除风机
    }

    if (params.exhaustLevelMax === 0) {
      setList((prev) => prev.filter((item, index) => item.key !== 'exhaustLevel')); // 移除排风
    }
    setList((prev) => {
      // 添加到第二位
      let newList = prev.filter((item, index) => item.key !== 'fanLevel');
      if (params.fanLevelMax > 0) {
        newList.splice(1, 0, {
          icon: numIcon(params.fanLevel),
          title: PluginStrings.songFJ,
          key: 'fanLevel'
        });
      }
      // 添加到第三位
      newList = newList.filter((item, index) => item.key !== 'exhaustLevel');
      if (params.exhaustLevelMax > 0) {
        newList.splice(2, 0, {
          icon: numIcon(params.exhaustLevel),
          title: PluginStrings.paiFJ,
          key: 'exhaustLevel'
        });
      }
      return newList;
    });
  }, [params.fanLevelMax, params.exhaustLevelMax]);


  useEffect(() => {
    if (params.specialFunction3Type === 0) {
      setList((prev) => {
        let newList = prev.filter((item, index) => index !== (prev.length - 1)); // 移除最后一个
        return newList;
      });
    } else {
      setList((prev) => {
        let newList = prev.filter((item, index) => item.key !== 'action'); // 移除action
        // 如果列表没有key === 'action'，则添加
        let obj = parseAction(params.action);
        if (obj && obj.icon && obj.title) {
          newList.push({
            icon: obj.icon,
            title: obj.title,
            key: 'action'
          });
        }
        console.log('newList', newList);
        return newList;
      });
    }

    // setList(newList);
  }, [params.specialFunction3Type]);

  useEffect(() => {
    console.log('params', params, params.mode);
    let mode = params.mode;
    let o = parseMode(mode);
    // 0: 自动
    // 1: 手动
    // 2: 定时
    // 3: 睡眠

    console.log('o', o);
    updateItem('mode', o);
  }, [params.mode]);

  // 
  const parseMode = (mode) => {
    switch (mode) {
      case 0:
        return {
          icon: require('../../resources/images/ziDong_icon.png'),
          title: PluginStrings.auto
        };
      case 1:
        return {
          icon: require('../../resources/images/shouD_icon.png'),
          title: PluginStrings.shouD
        };
      case 2:
        return {
          icon: defaultImages.timerIcon,
          title: PluginStrings.timer
        };
      case 3:
        return {
          icon: require('../../resources/images/sleep_icon.png'),
          title: PluginStrings.sleep
        };
    }
  };

  const updateItem = (key, newProps) => {
    setList((prev) => prev.map((item) =>
      item.key === key ? { ...item, ...newProps } : item // 仅修改目标对象
    ));
  };

  const parseAction = (action) => {
    switch (action) {
      case 1:
        return {
          icon: require('../../resources/images/nxh_icon.png'),
          title: PluginStrings.nxh
        };
      case 2:
        return {
          icon: require('../../resources/images/jiaS_icon.png'),
          title: PluginStrings.jiaShi
        };
      case 3:
        return {
          icon: require('../../resources/images/chuS_icon.png'),
          title: PluginStrings.chuShi
        };
      case 4:
        return {
          icon: require('../../resources/images/tongF_icon.png'),
          title: PluginStrings.tongFeng
        };
      case 5:
        return {
          icon: require('../../resources/images/ziDong_icon.png'),
          title: PluginStrings.auto
        };
      case 6:
        return {
          icon: require('../../resources/images/xinF_icon.png'),
          title: PluginStrings.xinFeng
        };
      case 7:
        return {
          icon: require('../../resources/images/xfcs_icon.png'),
          title: PluginStrings.xinFengCS
        };
      default:
        return {
          icon: require('../../resources/images/nxh_icon.png'),
          title: PluginStrings.nxh
        };
    }
  };


  useEffect(() => {
    let action = params.action;
    console.log('action', action);
    // // 1: 内循环
    // // 2: 加湿
    // // 3: 除湿
    // // 4: 通风
    // // 5: 内外循环
    // // 6: 新风
    // // 7: 新风除湿

    let o = parseAction(action);

    updateItem('action', o);
  }, [params.action]);



  const numIcon = (n) => {
    switch (n) {
      case 0:
        return require('../../resources/images/0_icon.png');
      case 1:
        return require('../../resources/images/1_icon.png');
      case 2:
        return require('../../resources/images/2_icon.png');
      case 3:
        return require('../../resources/images/3_icon.png');
      case 4:
        return require('../../resources/images/4_icon.png');
      case 5:
        return require('../../resources/images/5_icon.png');
      case 6:
        return require('../../resources/images/6_icon.png');
      case 7:
        return require('../../resources/images/7_icon.png');
      case 8:
        return require('../../resources/images/8_icon.png');
      case 9:
        return require('../../resources/images/9_icon.png');
      case 10:
        return require('../../resources/images/10_icon.png');
      default:
        return require('../../resources/images/0_icon.png');
    }
  };

  useEffect(() => {
    let o = ({
      icon: numIcon(params.fanLevel),
      title: PluginStrings.songFJ
    });
    updateItem('fanLevel', o);
  }, [params.fanLevel]);

  useEffect(() => {
    let o = ({
      icon: numIcon(params.exhaustLevel),
      title: PluginStrings.paiFJ
    });
    updateItem('exhaustLevel', o);
  }, [params.exhaustLevel]);

  return (
    <View style={[styles.baseContainer, style]}>
      {(!list || list.length === 0) && <Text style={{ color: '#fff' }}>{PluginStrings.noData}</Text>}
      {list.map((item, index) => {
        return (
          <TouchableOpacity style={[styles.ModeItem]} key={`mode_${ index }`} onPress={() => pressMode(item.key)}>
            <View style={[styles.ModeIconContainer, isDark ? { backgroundColor: 'xmrgba(255, 255, 255, .1)' } : { backgroundColor: 'rgba(255, 255, 255, .1)' }]}>
              {item.icon && <Image style={[styles.ModeIcon]} source={item.icon} resizeMode="contain" />}
            </View>
            <Text style={[styles.ModeTitle]}>{item.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    marginLeft: 11,
    marginRight: 11,
    flex: 1,
    paddingTop: 17,
    paddingBottom: 17,
    paddingLeft: 19,
    paddingRight: 19,
    borderRadius: 17,
    backgroundColor: "#2F3045",
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    height: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    justifyContent: 'center'
  },
  ModeItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ModeIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .1)'
  },
  ModeIcon: {
    width: 28,
    height: 28
  },
  ModeTitle: {
    marginTop: 7,
    fontSize: 15,
    color: '#fff'
  }
});

export default ModeCom;
import { ListItemWithSwitch } from "mhui-rn";
import { DarkMode } from 'miot';
import React, { useRef, useState, useEffect, useMemo } from "react";
import { View, StyleSheet, Image, Text, Dimensions, TouchableOpacity, Animated } from "react-native";
import PluginStrings from "../../resources/strings";
import { jD, set } from "../../resources/strings/zh";

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const images = {
  flzIcon: require('../../resources/images/flz_icon.png'),
  chuCIcon: require('../../resources/images/chuC_icon.png'),
  dnIcon: require('../../resources/images/dn_icon.png'),
  zwdIcon: require('../../resources/images/zwd_icon.png'),
  ffIcon: require('../../resources/images/ff_icon.png'),
  huaSIcon: require('../../resources/images/huaS_icon.png'),
  jDIcon: require('../../resources/images/jD_icon.png'),
  ptfIcon: require('../../resources/images/ptf_icon.png'),
  ptfActiveIcon: require('../../resources/images/ptf_active_icon.png'),
  jSIcon: require('../../resources/images/jS_icon.png')
};

class MyImage extends React.PureComponent {
  render() {
    return <Image {...this.props} />;
  }
}

let isDark = false;
let mDarkModeListener = null;

const FuncCom = React.memo(({ style, spec1, spec2, spec1Value, spec2Value, funcClick }) => {

  const [spec1Active, setSpec1Active] = useState(false);
  const [spec2ccActive, setSpec2Active] = useState(false);

  const [spec1Img, setSpec1Img] = useState(images.flzIcon);
  const [spec2Img, setSpec2Img] = useState(images.chuCIcon);


  const [funcList, setFuncList] = useState([]);
  useEffect(() => {

    // Image.getSize(require('../../resources/images/chuC_icon.png'), (w, h) => {
    //     console.log('image1 已预加载完成');
    // });
    isDark = DarkMode.getColorScheme() === 'dark' ? true : false;

    mDarkModeListener = DarkMode.addChangeListener((object) => {
      if (object.colorScheme) {
        isDark = object.colorScheme === 'dark' ? true : false;
      }
    });
  }, []);

  useEffect(() => {
    setSpec1Active(spec1Value);
  }, [spec1Value]);

  useEffect(() => {
    console.log('spec2====', spec2);
    if (spec2) {
      if (spec2 === 4) {
        // 如果是PTF功能
        let funcList = [];
        if (spec1 > 0) {
          funcList.push(parseSpec1(spec1));
        }
        // 如果PTF功能开启
        funcList.push({
          type: 4,
          title: PluginStrings.ptf,
          image: spec2Value ? images.ptfActiveIcon : images.ptfIcon,
          index: 1
        });
        setFuncList(funcList);
      }
    }
    setSpec2Active(spec2Value);
  }, [spec2Value]);

  useEffect(() => {
    let list = [];

    if (spec1 > 0) {
      list.push(parseSpec1(spec1));
    }

    if (spec2 > 0) {
      list.push(parseSpec2(spec2));
    }
    setFuncList(list);
  }, [spec1, spec2]);

  useEffect(() => {
    console.log('funcList', funcList);
  }, [funcList]);

  const parseSpec1 = (s) => {
    let title = '';
    let image;
    if (s === 1) {
      title = PluginStrings.flz;
      image = images.flzIcon;
    } else if (s === 2) {
      title = PluginStrings.dn;
      image = images.dnIcon;
    } else if (s === 3) {
      title = PluginStrings.zwd;
      image = images.zwdIcon;
    } else if (s === 4) {
      title = PluginStrings.jD;
      image = images.jDIcon;
    } else if (s === 5) {
      title = PluginStrings.jS;
      image = images.jSIcon;
    }
    return {
      type: s,
      title: title,
      image: image,
      index: 0
    };
  };

  const parseSpec2 = (s) => {
    let title = '';
    let image;
    if (s === 1) {
      title = PluginStrings.chuC;
      image = images.chuCIcon;
    } else if (s === 2) {
      title = PluginStrings.huaS;
      image = images.huaSIcon;
    } else if (s === 3) {
      title = PluginStrings.ff;
      image = images.ffIcon;
    } else if (s === 4) {
      title = PluginStrings.ptf;
      image = spec2Value ? images.ptfActiveIcon : images.ptfIcon;
    }
    return {
      type: s,
      title: title,
      image: image,
      index: 1
    };
  };

  //   const onImageLoad = () => {
  //     setIsLoaded(true);
  //     Animated.timing(fadeAnim, {
  //       toValue: 1,
  //       duration: 500,
  //       useNativeDriver: true
  //     }).start();
  //   };

  const MemoizedImage = React.memo(({ source }) => {
    return <Image source={source} style={[styles.FuncIcon]} />;
  });

  const FuncItem = (fProps) => {
    let active = false;
    let index = fProps.index;
    if (index === '0') {
      active = spec1Active;
    } else if (index === '1') {
      active = spec2ccActive;
    }

    return (
      <TouchableOpacity style={[styles.funcItem]} onPress={() => changeFunc(fProps)}>
        <View style={[styles.FuncImgBg, active && { backgroundColor: '#1CBCB4' }]}>
          <MemoizedImage source={fProps.image}></MemoizedImage>
          {/* <Image style={[styles.FuncIcon]} source={fProps.image} resizeMode="center"></Image> */}
        </View>
        <Text style={[styles.FuncText]}>{fProps.txt}</Text>
      </TouchableOpacity>
    );
  };

  const changeFunc = (type) => {
    funcClick(type);
  };

  return (
    <View style={[styles.baseContainer, style]}>
      {(funcList && funcList.length === 2) && <View style={[styles.func2Container]}>
        {funcList.map((item, i) => (
          // <Text key={`func_${index}`}> {JSON.stringify(item)}</Text>
          <FuncItem type={item.type} txt={item.title} image={item.image} index={`${ item.index }`} key={`func_${ i }`}></FuncItem>
        ))}
      </View>
      }

      {
        (funcList && funcList.length === 1) && <ListItemWithSwitch
          title={funcList[0].title}
          onValueChange={(value) => funcClick({ index: `${ funcList[0].index }` })}
          value={funcList[0].index === 0 ? spec1Active : spec2ccActive}
          containerStyle={{ width: screenWidth - 22, height: 56, paddingLeft: 15, backgroundColor: '#2F3045', borderRadius: 17 }}
          titleStyle={{ fontSize: 17, color: '#fff' }}
        />
      }
    </View >
  );
});

const styles = StyleSheet.create({
  baseContainer: {
    marginLeft: 11,
    marginRight: 11
    // marginTop: 11,
    // flex: 1,


  },
  func2Container: {
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    borderRadius: 17,
    backgroundColor: "#2F3045"
  },
  funcItem: {
    flex: 1,
    paddingLeft: 21,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  FuncImgBg: {
    width: 54,
    height: 54,
    borderRadius: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'xmrgba(255, 255, 255, .1)'
  },
  FuncIcon: {
    width: 54,
    height: 54
  },
  FuncText: {
    marginLeft: 11,
    color: '#fff'
  }
});

export default FuncCom;
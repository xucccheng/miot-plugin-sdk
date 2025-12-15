import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import PluginStrings from "../../resources/strings";

const ArcProgressBar = ({ progress = 0, days }) => {
  const size = 240; // 宽高
  const strokeWidth = 20; // 线宽
  const radius = (size - strokeWidth) / 2; // 半径
  // const circumference = 2 * Math.PI * radius; // 圆的周长
  
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };
  
  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    const d = [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y
    ].join(" ");
    
    return d;
  };
  
  const [daysTxt, setDaysTxt] = useState();
  
  useEffect(() => {
    setDaysTxt(PluginStrings.filterTimeTips.replace('XX', days));
  }, [days]);
  
  
  const arcPath =
    describeArc(
      size / 2,
      size / 2,
      radius,
      -30,
      (progress / 100) * 240 - 30
    );
  
  
  return (
    <View>
      <View style={ styles.container }>
        <Svg width={ size } height={ size }>
          {/* 背景弧 */ }
          <Path
            d={ describeArc(size / 2, size / 2, radius, -30, 210) }
            stroke="#e6e6e6"
            strokeWidth={ strokeWidth }
            fill="none"
          />
          {/* 前景弧 */ }
          { arcPath && (
            <Path
              d={ arcPath }
              stroke="#44A7F2"
              strokeWidth={ strokeWidth }
              fill="none"
            />
          ) }
        </Svg>
        <View style={ styles.textContainer }>
          <Text style={ styles.progressText }>{ `${ progress }%` }</Text>
          <Text style={ styles.progressTitle }>{ PluginStrings.filterRemaining }</Text>
        </View>
      </View>
      <Text style={ styles.remaining }>{ daysTxt }</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 92
  },
  textContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center"
  },
  progressText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000"
  },
  progressTitle: {
    fontSize: 14,
    color: '#666666'
  },
  remaining: {
    marginTop: 34,
    fontSize: 14,
    color: 'rgba(102, 102, 102, .9)',
    textAlign: 'center'
  }
});

export default ArcProgressBar;

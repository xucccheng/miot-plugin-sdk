import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Animated, Easing, Text, Dimensions, TouchableOpacity } from 'react-native';
import PluginStrings from '../../resources/strings';
import FaultCom from './FaultCom';

const PARTICLE_COUNT = 28;
const PARTICLE_SIZE = 6.5;

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

// 初始化粒子配置
const initializeParticleConfigs = () => {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    left: 5 + Math.random() * 90,
    life: 3200 + Math.random() * 2200,
    startDelay: 100 + Math.random() * 8000,
    driftX: (Math.random() - 0.5) * 100,
    swayAmp: Math.random() * 28 + 8,
    swayFreq: Math.random() * 2 + 0.8,
    colorOffset: Math.random() * 0.6 - 0.3
  }));
};

const PuStateCom = ({ ParticleColor, PuState, goToFaultPage }) => {
  // 使用 ref 保持动画值与配置的稳定引用
  const particlesRef = useRef(Array.from({ length: PARTICLE_COUNT }, () => new Animated.Value(0)));
  const configsRef = useRef(initializeParticleConfigs());

  // 合并相关的state，减少重渲染
  const [displayState, setDisplayState] = useState({
    gear: PuState?.gearTxt || '--',
    windDirection: PuState?.windDirectionTxt || '--',
    windType: PuState?.windTypeTxt || '--',
    leftTime: PuState?.leftTime || '--',
    isFault: PuState?.fault !== 0,
    faultCode: PuState?.fault || '--'
  });

  // 启动粒子动画回调
  const startParticleAnimation = useCallback(() => {
    const gear = 1;
    const direction = 0; // 风向：0 无，1 右，2 左

    particlesRef.current.forEach((anim, index) => {
      const cfg = configsRef.current[index];
      anim.setValue(0);

      const duration = Math.max(cfg.life - gear * 200, 1200);
      cfg.driftX += direction === 1 ? 20 : direction === 2 ? -20 : 0;

      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(cfg.startDelay + index * 100),
          Animated.timing(anim, {
            toValue: 1,
            duration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true
          })
        ])
      );

      loop.start();
    });
  }, []);

  // 初始化动画
  useEffect(() => {
    startParticleAnimation();

    // 清理：组件卸载时停止动画
    return () => {
      particlesRef.current.forEach((v) => v.setValue(0));
    };
  }, [startParticleAnimation]);


  // 监听PuState变化，更新显示状态
  useEffect(() => {
    if (PuState) {
      setDisplayState({
        gear: PuState.gearTxt || '--',
        windDirection: PuState.windDirectionTxt || '--',
        windType: PuState.windTypeTxt || '--',
        leftTime: PuState.leftTime || '--',
        isFault: PuState.fault !== 0,
        faultCode: PuState.fault || '--'
      });
    }
  }, [
        PuState?.fault,
        PuState?.gearTxt,
        PuState?.windDirectionTxt,
        PuState?.windTypeTxt,
        PuState?.leftTime
  ]);

  // 定时器逻辑：更新剩余时间
  useEffect(() => {
    if (!displayState.isFault && PuState?.mode !== 0) {
      setDisplayState((prev) => ({
        ...prev,
        leftTime: PuState?.leftTime || '--'
      }));
    }
  }, [PuState?.mode, displayState.isFault, PuState?.leftTime]);

  // 生成状态列表数据
  const statusList = useMemo(() => [
    { title: PluginStrings.gear, key: 'gearTxt', value: displayState.gear },
    { title: PluginStrings.windDirection, key: 'windDirectionTxt', value: displayState.windDirection },
    { title: PluginStrings.windType, key: 'windTypeTxt', value: displayState.windType }
  ], [displayState.gear, displayState.windDirection, displayState.windType]);

  // 渲染粒子效果
  const renderParticles = useCallback(() => {
    return (
      <View style={styles.particlesContainer} pointerEvents="none">
        {particlesRef.current.map((anim, i) => {
          const cfg = configsRef.current[i];

          const opacity = anim.interpolate({
            inputRange: [0, 0.1, 0.5, 0.8, 1],
            outputRange: [0, 0.7, 1, 0.5, 0]
          });

          const translateY = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [260, -320]
          });

          const sway = anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [
              0,
              Math.sin(Math.PI * cfg.swayFreq) * cfg.swayAmp,
              0
            ]
          });

          const scale = anim.interpolate({
            inputRange: [0, 0.4, 0.7, 1],
            outputRange: [0.6, 1.2, 1, 0.7]
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                {
                  width: PARTICLE_SIZE,
                  height: PARTICLE_SIZE,
                  borderRadius: PARTICLE_SIZE / 2,
                  left: `${ cfg.left }%`,
                  backgroundColor: ParticleColor,
                  opacity,
                  transform: [
                    { translateY },
                    { translateX: sway },
                    { scale }
                  ]
                }
              ]}
            />
          );
        })}
      </View>
    );
  }, [ParticleColor]);

  // 获取当前时间显示
  const getCurrentTimeDisplay = useCallback(() => {
    const leftTime = PuState?.leftTime || 0;
    console.log('PuState?.leftTime', PuState?.leftTime);
    console.log('leftTime', leftTime);
    const hours = String(Math.floor(leftTime / 60)).padStart(2, '0');
    const minutes = String(leftTime % 60).padStart(2, '0');
    return `${ hours }:${ minutes }`;
  }, [PuState?.leftTime]);


  // 设备运行状态页面
  const runStateView = useCallback(() => {
    return (
      <View style={styles.runStateContainer}>
        {renderParticles()}

        <View style={styles.statusRunContainer}>
          <Text style={styles.stateMode}>{PuState?.modeTxt || '--'}</Text>
          <Text style={styles.stateTime}>{getCurrentTimeDisplay()}</Text>
          <Text style={styles.stateEndText}>{PluginStrings.endAfter}</Text>
        </View>
        {/* 如果有故障 */}
        {displayState.isFault && <TouchableOpacity style={styles.errContent} onPress={() => goToFaultPage()}>
          <Text style={styles.errText}>F16</Text>
        </TouchableOpacity>}

        <View style={styles.statusItemContainer}>
          {statusList.map((item, index) => (
            <View key={index} style={styles.statusItem}>
              <Text style={styles.statusItemValue}>{item.value}</Text>
              <Text style={styles.statusItemText}>{item.title}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }, [renderParticles, getCurrentTimeDisplay, statusList, PuState?.modeTxt]);

  // 待机状态页面
  const standbyView = useCallback(() => {
    return (
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{PluginStrings.standbyRunning}</Text>
      </View>
    );
  }, []);

  // 条件渲染内容
  const renderContent = useCallback(() => {
    const mode = PuState?.mode ?? 0;
    if (displayState.isFault && displayState.faultCode !== 4) return <FaultCom faultCode={displayState.faultCode} />;
    if (mode === 0) return standbyView();
    return runStateView();
  }, [PuState?.mode, displayState.isFault, displayState.faultCode, standbyView, runStateView]);

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  runStateContainer: {
    height: 285,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: screenWidth
    // backgroundColor: '#FFFFFF',
  },
  errContent: {
    position: 'absolute',
    right: 20,
    top: 0,
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // zIndex: 10,
    color: '#DC3117'
  },
  errText: {
    fontSize: 16,
    color: '#DC3117'
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: 285,
    paddingBottom: 20,
    overflow: 'hidden'
  },
  particle: {
    position: 'absolute',
    bottom: 0
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 285
  },
  statusRunContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -100
  },
  stateMode: {
    color: 'rgba(31, 32, 34, 0.70)',
    fontSize: 16
  },
  stateTime: {
    color: '#1F2022',
    fontSize: 50,
    fontWeight: 'bold'
  },
  stateEndText: {
    color: '#1f2022',
    fontSize: 16,
    marginTop: 13
  },
  statusItemContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    position: 'absolute',
    bottom: 33.5
  },
  statusItem: {
    width: screenWidth / 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center'
  },
  statusItemValue: {
    color: '#1F2022',
    fontSize: 20
  },
  statusItemText: {
    color: 'rgba(31, 32, 34, 0.70)',
    fontSize: 14
  },
  statusText: {
    color: '#1F2022',
    fontSize: 50,
    marginTop: -80,
    fontWeight: 'bold'
  }
});

export default PuStateCom;
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import PluginStrings from '../../resources/strings';

const PuStateCom = ({ ParticleColor, PuState }) => {
    // 使用 ref 保持动画值与配置的稳定引用，避免重渲染时丢失动画
    const particlesRef = useRef(Array.from({ length: 28 }, () => new Animated.Value(0)));
    const configsRef = useRef(Array.from({ length: 28 }, () => ({
        left: 5 + Math.random() * 90,
        life: 3200 + Math.random() * 2200,
        startDelay: 100 + Math.random() * 8000,
        driftX: (Math.random() - 0.5) * 100,
        swayAmp: Math.random() * 28 + 8,
        swayFreq: Math.random() * 2 + 0.8,
        colorOffset: Math.random() * 0.6 - 0.3
    })));

    useEffect(() => {
        // 启动粒子动画（仅一次）
        startParticleAnimation();
        console.log('PuState====', PuState);
        // 组件卸载时停止动画（可选）
        return () => {
            // Animated 没有统一 stop API，这里重置值以避免悬挂动画影响性能
            particlesRef.current.forEach(v => v.setValue(0));
        };
    }, []);

    // 启动粒子动画
    const startParticleAnimation = () => {
        const gear = 1;
        const direction = 0; // 风向：0 无，1 右，2 左

        particlesRef.current.forEach((anim, index) => {
            const cfg = configsRef.current[index];

            // 重置初始值，避免重复启动时没有可见变化
            anim.setValue(0);

            // 档位加速
            const duration = Math.max(cfg.life - gear * 200, 1200);

            // 风向影响横移
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
    };

    const renderParticles = () => {
        // const baseColor = ParticleColor;

        return (
            <View style={styles.particlesContainer} pointerEvents="none">
                {particlesRef.current.map((anim, i) => {
                    const cfg = configsRef.current[i];

                    // 淡入 → 稳定 → 微弱淡出
                    const opacity = anim.interpolate({
                        inputRange: [0, 0.1, 0.5, 0.8, 1],
                        outputRange: [0, 0.7, 1, 0.5, 0],
                    });

                    // 竖直上升轨迹
                    const translateY = anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [260, -320],
                    });

                    // 横向轻微摆动 + 风向效果
                    const sway = anim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [
                            0,
                            Math.sin(Math.PI * cfg.swayFreq) * cfg.swayAmp,
                            0,
                        ],
                    });

                    // 尺寸动态更自然
                    const scale = anim.interpolate({
                        inputRange: [0, 0.4, 0.7, 1],
                        outputRange: [0.6, 1.2, 1, 0.7],
                    });

                    // 动态颜色渐变偏移
                    // const particleColor = this.getBackgroundColor()[0];

                    return (
                        <Animated.View
                            key={i}
                            style={[
                                styles.particle,
                                {
                                    width: 6.5,
                                    height: 6.5,
                                    borderRadius: 3.25,
                                    left: `${cfg.left}%`,
                                    backgroundColor: ParticleColor,
                                    opacity,
                                    transform: [
                                        { translateY },
                                        { translateX: sway },
                                        { scale },
                                    ],
                                },
                            ]}
                        />
                    );
                })}
            </View>
        );
    };

    // 档位
    const [gear, setGear] = useState(PuState.fanLevel || '--');
    // 风向
    const [windDirection, setWindDirection] = useState(PuState.windDirection || '--');
    // 风种
    const [windType, setWindType] = useState(PuState.windType || '--');

    const [list, setList] = useState([
        { title: PluginStrings.gear, key: "gear", value: gear },
        { title: PluginStrings.windDirection, key: "windDirection", value: windDirection },
        { title: PluginStrings.windType, key: "windType", value: windType },
    ]);

    return (
        <View style={styles.container}>
            {renderParticles()}
            {false && <View style={styles.statusContainer}>
                <Text style={styles.statusText}>{PluginStrings.standbyRunning}</Text>
            </View>}
            <View style={styles.statusRunContainer}>
                <Text style={styles.stateMode}>{PuState.mode}</Text>
                <Text style={styles.stateTime}>15:02</Text>
                <Text style={styles.stateEndText}>{PluginStrings.endAfter}</Text>
            </View>
            <View style={styles.statusItemContainer}>
                {
                    list.map((item, index) => (
                        <View key={index} style={styles.statusItem}>
                            <Text style={styles.statusItemValue}>{item.value}</Text>
                            <Text style={styles.statusItemText}>{item.title}</Text>
                        </View>
                    ))
                }
                {/* <View style={styles.statusItem} ></View> */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: 340,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    particlesContainer: {
        position: 'absolute',
        width: '100%',
        height: 340,
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
    },
    statusRunContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -160
    },
    stateMode: {
        color: 'rgba(31, 32, 34, 0.70)',
        fontSize: 16,
    },
    stateTime: {
        color: '#1F2022',
        fontSize: 50,

        fontWeight: 'bold',
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'center',
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
        fontWeight: 'bold',
    }
});

export default PuStateCom;
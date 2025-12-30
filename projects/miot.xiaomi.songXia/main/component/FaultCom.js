import React, { useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import PluginStrings from '../../resources/strings';


const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const FaultCom = ({ faultCode }) => {
  const faultCodeDisplay = useMemo(() => {
    if (faultCode === 1) return 'F20';
    if (faultCode === 2) return 'F15';
    if (faultCode === 3) return 'F01';
    if (faultCode === 4) return 'F03';
    if (faultCode === undefined || faultCode === null || faultCode === '--') return '--';
    return `F${ faultCode }`;
  }, [faultCode]);

  const faultSolutionDescription = useMemo(() => {
    const key = `faultSolutionDescription${ faultCode }`;
    return PluginStrings[key] || '--';
  }, [faultCode]);

  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>{PluginStrings.faultCode}</Text>
      </View>
      <View style={styles.codeView}>
        <Text style={styles.codeText}>{faultCodeDisplay}</Text>
      </View>
      <View style={styles.solutionView}>
        <Text style={styles.solutionText}>{PluginStrings.faultSolution}</Text>
        <Text style={styles.solutionDescription}>{faultSolutionDescription}</Text>
      </View>

      <View style={styles.afterSalesContainers}>
        <TouchableOpacity style={styles.afterSalesContainer} activeOpacity={0.8} onPress={() => this.callPhone('4008-308-583')}>
          <View style={styles.afterSalesLeft}>
            <Text style={styles.afterSalesTitle}>{PluginStrings.afterSalesTitle}</Text>
            <Text style={styles.afterSalesPhone}>4008-308-583</Text>
          </View>
          <View style={styles.afterSalesRight}>
            <Image resizeMode="contain"
              source={require('../../resources/images/after_sales_icon.png')}
              style={styles.afterSalesIcon} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.afterSalesContainer} activeOpacity={0.8} onPress={() => this.callPhone('4008-811-315')}>
          <View style={styles.afterSalesLeft}>
            <Text style={styles.afterSalesTitle}>{PluginStrings.afterSalesTitle}</Text>
            <Text style={styles.afterSalesPhone}>4008-811-315</Text>
          </View>
          <View style={styles.afterSalesRight}>
            <Image resizeMode="contain"
              source={require('../../resources/images/after_sales_icon.png')}
              style={styles.afterSalesIcon} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#1F2022'
  },
  titleView: {
    backgroundColor: '#e5e5e5',
    height: 32,
    paddingLeft: 16,
    paddingRight: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25
  },
  titleText: {
    fontSize: 16
  },
  codeView: {
    marginTop: 15
  },
  codeText: {
    fontSize: 50,
    fontWeight: 'bold'
  },
  solutionView: {
    marginTop: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  solutionText: {
    fontSize: 18,
    fontWeight: '500'
  },
  solutionDescription: {
    marginTop: 8,
    marginLeft: 50,
    marginRight: 50,
    fontSize: 16,
    textAlign: 'center'
  },
  afterSalesContainers: {
    // position: 'absolute',
    // backgroundColor: '#000',
    width: screenWidth,
    left: 0,
    right: 0,
    bottom: 0,
    marginTop: 172,
    paddingBottom: 20
  },
  afterSalesContainer: {
    backgroundColor: '#E9E9E9',
    borderRadius: 4,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 12,
    color: '#1F2022',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 75
  },
  afterSalesLeft: {
    marginLeft: 20
  },
  afterSalesTitle: {
    fontSize: 15
  },
  afterSalesPhone: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: 'bold'
  },
  afterSalesRight: {
    marginRight: 25
  },
  afterSalesIcon: {
    width: 35,
    height: 35
  }
});

export default FaultCom;

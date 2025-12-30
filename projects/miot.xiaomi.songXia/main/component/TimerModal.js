import { StringSpinner } from 'mhui-rn';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
import PluginStrings from '../../resources/strings';


const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const TimerModal = ({ visible, mode, selectedValue, onClose, onConfirm }) => {
  const [current, setCurrent] = useState(selectedValue);

  useEffect(() => {
    if (visible) {
      setCurrent(selectedValue);
    }
  }, [visible, selectedValue]);



  // 根据 mode 生成 spinner 数据
  const spinnerOptions = useMemo(() => {
    // 默认选项
    const options = [
      { label: `15${ PluginStrings.minute }`, value: 1 },
      { label: `30${ PluginStrings.minute }`, value: 2 },
      { label: `1${ PluginStrings.hour }`, value: 3 },
      { label: `3${ PluginStrings.hour }`, value: 4 },
      { label: `6${ PluginStrings.hour }`, value: 5 },
      { label: `${ PluginStrings.timerContinuous }`, value: 6 }
    ];
    switch (mode) {
      case 1:
        // 去掉6小时和连续
        return options.filter((opt) => opt.value !== 5 && opt.value !== 6);
      case 2:
        return options;
      case 3:
        return options;
      case 4:
        return options.filter((opt) => opt.value !== 6);
      default:
        return options;
    }
  }, [mode]);

  // // 兜底：如果 options 未传则使用默认 3/6/连续
  // const spinnerOptions = useMemo(() => {
  //     if (Array.isArray(options) && options.length > 0) return options;
  //     return [
  //         { label: PluginStrings.timer3Hours, value: 3 },
  //         { label: PluginStrings.timer6Hours, value: 6 },
  //         { label: PluginStrings.timerContinuous, value: 0 }
  //     ];
  // }, [options]);

  const spinnerData = useMemo(() => spinnerOptions.map((opt) => opt.label), [spinnerOptions]);

  const handleValueChange = (label) => {
    console.log('Selected label:', label.newValue);
    const hit = spinnerOptions.find((opt) => opt.label === label.newValue);
    console.log('Matched option:', hit);
    if (hit) {
      setCurrent(hit.value);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      // animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <View style={styles.panelWrapper}>
        <View style={styles.panel}>
          <Text style={styles.title}>{PluginStrings.timer}</Text>
          <StringSpinner
            style={styles.spinner}
            dataSource={spinnerData}
            defaultValue={spinnerOptions.find((opt) => opt.value === current)?.label || spinnerData[0]}
            pickerInnerStyle={{
              lineColor: 'rgba(0, 0, 0, 0.20)',
              textColor: 'rgba(31, 32, 34, 1)',
              selectTextColor: '#1BC5BD',
              fontSize: 16,
              selectFontSize: 20,
              rowHeight: 60
            }}
            onValueChanged={handleValueChange}
          />
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={onClose}>
              <Text style={styles.cancelText}>{PluginStrings.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.confirmBtn]} onPress={() => onConfirm(current)}>
              <Text style={styles.confirmText}>{PluginStrings.confirm}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)'
  },
  panelWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center'
  },
  panel: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    color: '#1F2022',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 18
  },
  spinner: {
    // flex: 1,
    height: 200,
    // marginLeft: 39,
    width: screenWidth - 78,
    marginTop: 10,
    marginBottom: 10
  },
  options: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e8e8e8'
  },
  option: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8'
  },
  optionActive: {
    backgroundColor: '#F1FCFB'
  },
  optionText: {
    fontSize: 18,
    color: '#1F2022'
  },
  optionTextActive: {
    color: '#1BC5BD',
    fontWeight: '700'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 10
  },
  actionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelBtn: {
    marginRight: 10,
    backgroundColor: '#F5F5F5'
  },
  confirmBtn: {
    marginLeft: 10,
    backgroundColor: '#F5F5F5'
  },
  cancelText: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 1)'
  },
  confirmText: {
    fontSize: 16,
    color: 'rgba(28, 188, 180, 1)',
    fontWeight: '600'
  }
});

export default TimerModal;

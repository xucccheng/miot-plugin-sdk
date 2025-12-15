import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, PanResponder, Dimensions } from "react-native";

const ITEM_HEIGHT = 44;
const VISIBLE_COUNT = 5;

export default function CustomPicker({ data = [], value = 0, onChange, onCancel, onConfirm, title = "请选择" }) {
  const [selected, setSelected] = useState(value);
  const startY = useRef(0);
  const lastSelected = useRef(value);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gesture) => {
        startY.current = gesture.dy;
        lastSelected.current = selected;
      },
      onPanResponderMove: (_, gesture) => {
        let offset = Math.round((gesture.dy - startY.current) / ITEM_HEIGHT);
        let next = Math.min(Math.max(lastSelected.current - offset, 0), data.length - 1);
        setSelected(next);
        onChange && onChange(data[next], next);
      }
    })
  ).current;

  return (
    <View style={styles.pickerWrap}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.listWrap} {...panResponder.panHandlers}>
        {data.map((item, idx) => (
          <View
            key={item}
            style={[
              styles.item,
              idx === selected && styles.selectedItem
            ]}
          >
            <Text style={[styles.itemText, idx === selected && styles.selectedText]}>
              {item}
            </Text>
          </View>
        ))}
        {/* 高亮线 */}
        <View style={styles.highlightLine} pointerEvents="none" />
      </View>
      <View style={styles.btnRow}>
        <Text style={styles.btn} onPress={onCancel}>取消</Text>
        <Text style={styles.btn} onPress={() => onConfirm(data[selected], selected)}>确定</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerWrap: {
    backgroundColor: "#2F3045",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    paddingBottom: 20,
    paddingTop: 19
  },
  title: {
    fontSize: 19,
    color: '#fff',
    width: '100%',
    paddingLeft: 33
  },
  listWrap: {
    height: ITEM_HEIGHT * VISIBLE_COUNT,
    overflow: "hidden",
    width: Dimensions.get("window").width - 72,
    marginTop: 10,
    marginBottom: 10,
    position: "relative"
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center"
  },
  selectedItem: {},
  itemText: { color: "#fff", fontSize: 17, opacity: 0.6 },
  selectedText: { color: "#1CBCB4", fontSize: 21, opacity: 1, fontWeight: "bold" },
  highlightLine: {
    position: "absolute", left: 0, right: 0,
    top: ITEM_HEIGHT * 2, height: ITEM_HEIGHT, borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: "#1CBCB4", zIndex: 10
  },
  btnRow: { flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 10 },
  btn: { flex: 1, textAlign: "center", color: "#1CBCB4", fontWeight: "bold", fontSize: 16, paddingVertical: 12 }
});
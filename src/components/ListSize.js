import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {colors, fontType} from '../theme';

const Item = ({value, backgroundColor, color, onPress}) => {
  return (
    <TouchableOpacity style={[styles.box, {backgroundColor}]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.title, {color}]}>{value}</Text>
    </TouchableOpacity>
  );
};
const data = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5];
const ListSize = () => {
  const [selected, setSelected] = useState(0);
  const renderItem = ({item, index}) => {
    const backgroundColor =
      index === selected ? colors.black() : colors.extraLightGray();
    const color = index === selected ? colors.white() : colors.midGray();
    return (
      <Item
        value={item}
        backgroundColor={backgroundColor}
        color={color}
        onPress={() => setSelected(index)}
      />
    );
  };
  return (
    <FlatList
      data={data}
      renderItem={item => renderItem({...item})}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{gap: 10, paddingHorizontal: 24}}
    />
  );
};

export default ListSize;

const styles = StyleSheet.create({
  title: {
    fontFamily: fontType['Pjs-SemiBold'],
    fontSize: 14,
  },
  box: {
    width: 40,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

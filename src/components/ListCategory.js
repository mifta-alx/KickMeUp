import {FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {colors, fontType} from '../theme';

const ItemCategory = ({itemdata, onPress, backgroundColor, color}) => {
  return (
    <TouchableOpacity style={[category.item, {backgroundColor}]} onPress={onPress}>
      <Text style={[category.text, {color}]}>{itemdata.category}</Text>
    </TouchableOpacity>
  );
};

const ListCategory = ({data}) => {
  const [selected, setSelected] = useState(1);
  const renderItem = ({item}) => {
    const backgroundColor =
      item.id === selected ? colors.black() : colors.extraLightGray();
      const color = item.id === selected ? colors.white() : colors.midGray();
    return (
      <ItemCategory
        itemdata={item}
        onPress={()=>setSelected(item.id)}
        backgroundColor={backgroundColor}
        color={color}
      />
    );
  };
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={item => renderItem({...item})}
      horizontal
      contentContainerStyle={category.container}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default ListCategory;
const category = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    gap: 10,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  text: {
    fontFamily: fontType['Pjs-Medium'],
    fontSize: 12,
  },
});

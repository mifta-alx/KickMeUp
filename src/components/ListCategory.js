import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {colors, fontType} from '../theme';
import {Filter} from 'iconsax-react-native';

const ItemCategory = ({itemdata, onPress, backgroundColor, color}) => {
  return (
    <TouchableOpacity
      style={[category.item, {backgroundColor}]}
      onPress={onPress}>
      <Text style={[category.text, {color}]}>{itemdata.category}</Text>
    </TouchableOpacity>
  );
};

const ListCategory = ({data, filter}) => {
  const [selected, setSelected] = useState(1);
  const renderItem = ({item}) => {
    const backgroundColor =
      item.id === selected ? colors.black() : colors.extraLightGray();
    const color = item.id === selected ? colors.white() : colors.midGray();
    return (
      <ItemCategory
        itemdata={item}
        onPress={() => setSelected(item.id)}
        backgroundColor={backgroundColor}
        color={color}
      />
    );
  };
  return (
    <View style={{flexDirection: 'row'}}>
      {filter && (
        <View style={{paddingVertical: 10, paddingRight:10, paddingLeft:24}}>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 25,
              borderWidth: 1,
              borderColor: colors.black(),
              alignItems: 'center',
            }}>
            <Text style={{fontFamily:fontType['Pjs-Medium'], fontSize:12, color:colors.black()}}>Filter</Text>
            <Filter size={14} color={colors.black()} variant="Linear" />
          </View>
        </View>
      )}

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={item => renderItem({...item})}
        horizontal
        contentContainerStyle={[category.container, {paddingLeft: filter ? 10 : 24}]}
        showsHorizontalScrollIndicator={false}
      />
    </View>
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
    alignItems:'center',
    justifyContent:'center'
  },
  text: {
    fontFamily: fontType['Pjs-Medium'],
    fontSize: 12,
  },
});

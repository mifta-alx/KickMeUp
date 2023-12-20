import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import {Heart} from 'iconsax-react-native';
import React, {useState} from 'react';
import {colors, fontType} from '../theme';
import {formatPrice} from '../utils/formatPrice';
import FastImage from 'react-native-fast-image';
import {brandData} from '../../data';

const windowWidth = Dimensions.get('window').width;

const Item = ({itemdata}) => {
  const [BtnColor, setBtnColor] = useState(colors.black());
  const brand = brandData.find(data => data.id === itemdata?.brandId);
  return (
    <TouchableOpacity style={item.card}>
      <View style={item.wishlist}>
        <Heart variant="Bold" size={20} color={colors.black()} />
      </View>
      <FastImage
        style={item.image}
        source={{
          uri: itemdata?.image,
          headers: {Authorization: 'someAuthToken'},
          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={item.info}>
        <View style={item.textContainer}>
          <Text style={item.brand}>{brand.brand_name}</Text>
          <Text style={item.type}>{itemdata?.productName}</Text>
        </View>
        <View style={{gap: 10}}>
          <Text style={item.price}>IDR {itemdata?.price && formatPrice(itemdata?.price)}</Text>
          <TouchableHighlight
            style={item.button}
            underlayColor={colors.black()}
            onPressIn={() => setBtnColor(colors.white())}
            onPressOut={() => setBtnColor(colors.black())}>
            <Text style={[item.textbutton, {color: BtnColor}]}>
              Add to cart
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Wishlist = ({data}) => {
  const renderItem = ({item}) => {
    return <Item itemdata={item} />;
  };
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={item => renderItem({...item})}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={item.container}
      numColumns={2}
      columnWrapperStyle={{justifyContent: 'space-between'}}
    />
  );
};

export default Wishlist;

const item = StyleSheet.create({
  container: {paddingHorizontal: 24, paddingVertical: 14, gap: 14},
  card: {
    height: 290,
    width: windowWidth * 0.41984733,
    borderWidth: 1,
    borderColor: colors.extraLightGray(),
    borderRadius: 10,
    backgroundColor: colors.white(),
  },
  image: {width: 'auto', height: 135, borderRadius: 10},
  info: {padding: 14, justifyContent: 'space-between', flex: 1},
  brand: {
    fontFamily: fontType['Pjs-SemiBold'],
    fontSize: 10,
    color: colors.black(),
  },
  price: {
    fontSize: 12,
    fontFamily: fontType['Cousine-R'],
    color: colors.black(),
  },
  type: {
    fontFamily: fontType['Pjs-Regular'],
    fontSize: 10,
    color: colors.black(),
  },
  textContainer: {gap: 5},
  wishlist: {position: 'absolute', top: 10, right: 10, zIndex: 999},
  button: {
    borderWidth: 1,
    borderColor: colors.black(),
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textbutton: {
    fontFamily: fontType['Pjs-SemiBold'],
    fontSize: 12,
  },
});

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {Heart} from 'iconsax-react-native';
import React from 'react';
import {colors, fontType} from '../theme';
import {formatPrice} from '../utils/formatPrice';
import { brandData } from '../../data';

const windowWidth = Dimensions.get('window').width;

const Item = ({itemdata, variant, onPress, navigate}) => {
  const brand = brandData.find(data => data.id === itemdata?.brandId)
  return (
    <TouchableOpacity style={item.card} onPress={navigate} activeOpacity={0.8}>
      <TouchableOpacity onPress={onPress} style={item.wishlist}>
        <Heart variant={variant} size={20} color={colors.black()} />
      </TouchableOpacity>
      <Image source={{uri : itemdata?.image}} style={item.image} />
      <View style={item.info}>
        <View style={item.textContainer}>
          <Text style={item.brand}>{brand.brand_name}</Text>
          <Text style={item.type}>{itemdata.productName}</Text>
        </View>
        <Text style={item.price}>IDR {formatPrice(itemdata?.price)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Item;

const item = StyleSheet.create({
  card: {
    height: 250,
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
});

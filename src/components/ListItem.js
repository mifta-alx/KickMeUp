import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Heart} from 'iconsax-react-native';
import React, {useState} from 'react';
import {colors, fontType} from '../theme';

const Item = ({itemdata, variant, onPress}) => {
  const formatPrice = price => {
    const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formatted;
  };
  return (
    <TouchableOpacity style={item.card}>
      <TouchableOpacity onPress={onPress} style={item.wishlist}>
        <Heart variant={variant} size={20} color={colors.black()} />
      </TouchableOpacity>
      <Image source={itemdata.image.image_1} style={item.image} />
      <View style={item.info}>
        <View style={item.textContainer}>
          <Text style={item.brand}>{itemdata.brand}</Text>
          <Text style={item.type}>{itemdata.type}</Text>
        </View>
        <Text style={item.price}>IDR {formatPrice(itemdata.price)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ListItem = ({data, layoutType}) => {
  const [wishlist, setWishlist] = useState([]);
  const toggleWishlist = itemId => {
    if (wishlist.includes(itemId)) {
      setWishlist(wishlist.filter(id => id !== itemId));
    } else {
      setWishlist([...wishlist, itemId]);
    }
  };
  const renderItem = ({item}) => {
    variant = wishlist.includes(item.id) ? 'Bold' : 'Linear';
    return (
      <Item
        variant={variant}
        itemdata={item}
        onPress={() => toggleWishlist(item.id)}
      />
    );
  };
  if(layoutType == 'vertical'){
    return (
      <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={item => renderItem({...item})}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={item.container}
      numColumns={2}
      columnWrapperStyle={{justifyContent: 'space-between'}}/>
    )
  }else{
    return (
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={item => renderItem({...item})}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={item.container}
        horizontal
      />
    )
  }
};

export default ListItem;

const item = StyleSheet.create({
  container: {paddingHorizontal: 24, paddingVertical: 14, gap: 14},
  card: {
    height: 250,
    width: 165,
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

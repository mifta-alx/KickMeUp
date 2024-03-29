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
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

const Item = ({itemdata, onPress, navigate}) => {
  const [BtnColor, setBtnColor] = useState(colors.black());
  const brand = brandData.find(data => data.id === itemdata?.brandId);
  return (
    <TouchableOpacity style={item.card} onPress={navigate} activeOpacity={0.8}>
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
            onPressOut={() => setBtnColor(colors.black())} 
            onPress={onPress}>
            <Text style={[item.textbutton, {color: BtnColor}]}>
              Add to cart
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const toggleAddtoCart = async (itemId) => {
  const userId = auth().currentUser.uid;
  try {
    const cartRef = firestore()
      .collection('userData')
      .doc(userId)
      .collection('cart')
      .doc(itemId);

    const isExist = (await cartRef.get()).exists;
    if (isExist) {
      await cartRef.update({
        amount: firestore.FieldValue.increment(1),
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await cartRef.set({
        productId: itemId,
        size: 2,
        amount: 1,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error add to cart status:', error);
  }
};

const Wishlist = ({data}) => {
  const navigation = useNavigation()
  const renderItem = ({item}) => {
    return <Item itemdata={item} onPress={() => toggleAddtoCart(item.productId)} navigate={() => navigation.navigate('ItemDetail', {itemId: item.productId})}/>;
  };
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.productId}
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

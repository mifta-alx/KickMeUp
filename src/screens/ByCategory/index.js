import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  TextInput
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {colors, fontType} from '../../theme';
import {ArrowLeft2, Bag2, SearchNormal1, Sort, Box} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import {brandData} from '../../../data';
import {Item} from '../../components';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const windowHeight = Dimensions.get('window').height;

const ByCategory = ({route}) => {
  const {brandId} = route.params;
  const navigation = useNavigation();
  const userId = auth().currentUser?.uid;
  const selectedBrand = brandData.find(data => data.id === brandId);
  const [products, setProducts] = useState([]);
  const [result, setResult] = useState([])
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [itemAmount, setItemAmount] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const Header_Max_Height = windowHeight * 0.28638498;
  const Header_Min_Height = windowHeight * 0.07511737;
  const animatedHeight = scrollY.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [Header_Max_Height, 64],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const cartSubscriber = firestore()
      .collection('userData')
      .doc(userId)
      .collection('cart')
      .onSnapshot(querySnapshot => {
        const cartData = [];
        querySnapshot.forEach(documentSnapshot => {
          cartData.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setItemAmount(cartData.length);
      });
    const productSubscriber = firestore()
      .collection('products')
      .where('brandId', '==', brandId)
      .onSnapshot(querySnapshot => {
        const products = [];
        querySnapshot.forEach(documentSnapshot => {
          products.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setProducts(products);
        setResult(products)
        setLoading(false);
      });
    const wishlistSubscriber = firestore()
      .collection('userData')
      .doc(userId)
      .collection('wishlist')
      .onSnapshot(async querySnapshot => {
        const wishlistData = [];
        querySnapshot.forEach(documentSnapshot => {
          wishlistData.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setWishlist(wishlistData);
      });
    return () => {
      productSubscriber(), cartSubscriber(), wishlistSubscriber;
    };
  }, [brandId]);

  const searchItem = text => {
    if (text) {
      const newData = products.filter(item => {
        const itemData = item.productName
          ? item.productName.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setResult(newData);
      setKeyword(text);
    } else {
      setResult(products);
      setKeyword(text);
    }
  };

  return (
    <View style={styles.container}>
      <View style={header.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}>
          <ArrowLeft2 variant="Linear" color={colors.black()} size={24} />
        </TouchableOpacity>
        <Text style={header.title}>{selectedBrand.brand_name}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.6}>
          {itemAmount > 0 && (
            <View
              style={{
                backgroundColor: colors.black(),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 100,
                width: 18,
                height: 18,
                position: 'absolute',
                zIndex: 100,
                right: -6,
                top: -3,
              }}>
              <Text
                style={{
                  fontSize: 10,
                  color: colors.white(),
                  fontFamily: fontType['Pjs-Medium'],
                  lineHeight: 12,
                }}>
                {itemAmount}
              </Text>
            </View>
          )}
          <Bag2 variant="Linear" color={colors.black()} size={24} />
        </TouchableOpacity>
      </View>
      <Animated.View style={[header.stickycontainer, {top: animatedHeight}]}>
        <View style={[header.container, {gap: 16}]}>
          <View style={searchBar.container}>
            <SearchNormal1
              variant="Linear"
              color={colors.midGray()}
              size={20}
            />
            <TextInput
              placeholder={'Search in '+selectedBrand.brand_name}
              placeholderTextColor={colors.midGray()}
              value={keyword}
              onChangeText={text  => searchItem(text)}
              style={searchBar.text}
            />
          </View>
          <Sort variant="Linear" color={colors.black()} size={24} />
        </View>
      </Animated.View>
      <ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}>
        <Image source={selectedBrand.brand_logo} style={brand.image} />
        <View
          style={{
            paddingHorizontal: 24,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: 14,
            marginTop: Header_Min_Height,
            paddingVertical: 10,
          }}>
          {result.length > 0 ? (
            result.map((product, index) => {
              const isWishlistItem = wishlist.some(
                data => data?.productId === product?.id,
              );
              const variant = isWishlistItem ? 'Bold' : 'Linear';
              return (
                <Item
                  key={index}
                  itemdata={product}
                  variant={variant}
                  navigate={() =>
                    navigation.navigate('ItemDetail', {itemId: product.id})
                  }
                />
              );
            })
          ) : (
            <View
              style={{
                gap: 12,
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                opacity: 0.3,
                paddingVertical: 80,
              }}>
              <Box variant="Linear" color={colors.midGray()} size={96} />
              <Text
                style={{
                  color: colors.midGray(),
                  fontSize: 18,
                  fontFamily: fontType['Pjs-SemiBold'],
                }}>
                No {selectedBrand.brand_name} product found.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ByCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
});

const header = StyleSheet.create({
  stickycontainer: {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: colors.white(),
    zIndex: 99,
  },
  container: {
    flexDirection: 'row',
    height: 64,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: fontType['Pjs-Bold'],
    fontSize: 18,
    color: colors.black(),
  },
});

const searchBar = StyleSheet.create({
  container: {
    backgroundColor: colors.extraLightGray(),
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
  },
  text: {
    color: colors.black(),
    flex: 1,
    fontSize: 14,
    fontFamily: fontType['Pjs-Medium'],
    padding:0
  },
});
const brand = StyleSheet.create({
  image: {
    width: 'auto',
    height: windowHeight * 0.21126761,
    resizeMode: 'contain',
  },
});

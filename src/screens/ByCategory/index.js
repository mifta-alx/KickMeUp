import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {colors, fontType} from '../../theme';
import {ArrowLeft2, Bag2, SearchNormal1, Sort} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import {brandData, dataItem} from '../../../data';
import { Item } from '../../components';

const windowHeight = Dimensions.get('window').height;

const ByCategory = ({route}) => {
  const {brandId} = route.params;
  const selectedBrand = brandData.find(data => data.id === brandId);
  const navigation = useNavigation();
  const [wishlist, setWishlist] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const Header_Max_Height = windowHeight * 0.28638498;
  const Header_Min_Height = windowHeight * 0.07511737;
  const animatedHeight = scrollY.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [Header_Max_Height, 64],
    extrapolate: 'clamp', 
  });
  return (
    <View style={styles.container}>
      <View style={header.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}>
          <ArrowLeft2 variant="Linear" color={colors.black()} size={24} />
        </TouchableOpacity>
        <Text style={header.title}>{selectedBrand.brand_name}</Text>
        <TouchableOpacity onPress={() => {}} activeOpacity={0.6}>
          <Bag2 variant="Linear" color={colors.black()} size={24} />
        </TouchableOpacity>
      </View>
      <Animated.View
        style={[header.stickycontainer, {top: animatedHeight}]}>
        <View style={[header.container, {gap: 16}]}>
          <View style={searchBar.container}>
            <SearchNormal1
              variant="Linear"
              color={colors.midGray()}
              size={20}
            />
            <Text style={searchBar.text}>
              Search in {selectedBrand.brand_name}
            </Text>
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
        <Image
          source={selectedBrand.brand_logo}
          style={brand.image}
        />
        <View style={{paddingHorizontal:24, flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', rowGap:14, marginTop: Header_Min_Height, paddingVertical:10}}>
        {dataItem.map((data, index) => {
          const toggleWishlist = itemId => {
            if (wishlist.includes(itemId)) {
              setWishlist(wishlist.filter(id => id !== itemId));
            } else {
              setWishlist([...wishlist, itemId]);
            }
          };
          variant = wishlist.includes(data.id) ? 'Bold' : 'Linear';
          return <Item key={index} itemdata={data} variant={variant} onPress={() => toggleWishlist(data.id)}
          navigate={() => navigation.navigate('ItemDetail', {itemId : data.id})}/>;
        })}
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
  stickycontainer:{
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
    color: colors.midGray(),
    fontSize: 14,
    fontFamily: fontType['Pjs-Medium'],
  },
});
const brand = StyleSheet.create({
  image:{
    width: 'auto',
    height: windowHeight * 0.21126761,
    resizeMode: 'contain',
  }
})
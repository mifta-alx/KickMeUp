import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, fontType} from '../../theme';
import {Bag2, Notification} from 'iconsax-react-native';
import { Wishlist } from '../../components';
import { dataItem, wishlistData } from '../../../data';

const WishlistScreen = () => {
  const [wishlist, setWishlist] = useState([]);
  useEffect(() =>{
    const getData = () => {
      const wishlistItems = wishlistData.map(wishlistItem =>
        dataItem.find(data => data.id === wishlistItem.item_id)
      );
      setWishlist(wishlistItems)
    }
    getData()
  }, [wishlistData])
  return (
    <View style={styles.container}>
      <View style={header.container}>
        <Text
          style={header.title}>
          Wishlist ({wishlist.length})
        </Text>
        <View style={{flexDirection: 'row', gap: 16, alignItems: 'center'}}>
          <Notification variant="Linear" color={colors.black()} size={24} />
          <Bag2 variant="Linear" color={colors.black()} size={24} />
        </View>
      </View>
      <Wishlist data={wishlist}/>
    </View>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
});

const header = StyleSheet.create({
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

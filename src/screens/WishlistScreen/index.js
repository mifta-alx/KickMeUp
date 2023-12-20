import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import React, {useState, useCallback} from 'react';
import {colors, fontType} from '../../theme';
import {Bag2, Notification} from 'iconsax-react-native';
import {Wishlist} from '../../components';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';

const WishlistScreen = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemData, setItemData] = useState([]);

  const fetchWishlistData = useCallback(async () => {
    setLoading(true);
    try {
      const userId = auth().currentUser?.uid;
      const wishlistSnapshot = await firestore()
        .collection('userWishlist')
        .doc(userId)
        .collection('wishlist')
        .get();

      const wishlistData = wishlistSnapshot.docs.map(doc => doc.data());
      setWishlist(wishlistData);
      const productDetails = await Promise.all(
        wishlistData.map(async wishlistItem => {
          const productId = wishlistItem.productId;
          const productSnapshot = await firestore()
            .collection('products')
            .doc(productId)
            .get();
          return productSnapshot.data();
        }),
      );

      setItemData(productDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchWishlistData();
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={header.container}>
        <Text style={header.title}>Wishlist ({wishlist.length})</Text>
        <View style={{flexDirection: 'row', gap: 16, alignItems: 'center'}}>
          <Notification variant="Linear" color={colors.black()} size={24} />
          <Bag2 variant="Linear" color={colors.black()} size={24} />
        </View>
      </View>
      {loading ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size={'large'} color={colors.black()} />
        </View>
      ) : (
        <Wishlist data={itemData} />
      )}
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

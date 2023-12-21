import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {colors, fontType} from '../../theme';
import {Bag2, Notification} from 'iconsax-react-native';
import {Wishlist} from '../../components';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const WishlistScreen = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemData, setItemData] = useState([]);
  const [itemAmount, settemAmount] = useState(0);

  const userId = auth().currentUser?.uid;

  useEffect(() => {
    const wishlistRef = firestore()
      .collection('userData')
      .doc(userId)
      .collection('wishlist');
    const wishlistSubscriber = wishlistRef.onSnapshot(async querySnapshot => {
      const wishlistData = [];
      querySnapshot.forEach(documentSnapshot => {
        wishlistData.push({
          ...documentSnapshot.data(),
          id: documentSnapshot.id,
        });
      });
      setWishlist(wishlistData);

      const productDetails = await Promise.all(
        wishlistData.map(async wishlistItem => {
          const productId = wishlistItem.productId;
          const productSnapshot = await firestore()
            .collection('products')
            .doc(productId)
            .get();
          return {...productSnapshot.data(), productId: productId};
        }),
      );

      setItemData(productDetails);
      setLoading(false);
    });

    const cartSubscriber = firestore()
      .collection('userData')
      .doc(userId)
      .collection('cart').onSnapshot(querySnapshot => {
        const cartData = [];
        querySnapshot.forEach(documentSnapshot => {
          cartData.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        settemAmount(cartData.length);
      });
    return () => {
      cartSubscriber();
      wishlistSubscriber();
    };
  }, []);
  return (
    <View style={styles.container}>
      <View style={header.container}>
        <Text style={header.title}>Wishlist ({wishlist.length})</Text>
        <View style={{flexDirection: 'row', gap: 16, alignItems: 'center'}}>
          <Notification variant="Linear" color={colors.black()} size={24} />
          <TouchableOpacity onPress={() => {}} activeOpacity={0.6}>
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

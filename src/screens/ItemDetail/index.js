import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {colors, fontType} from '../../theme';
import {Bag2, ArrowLeft2, Share, Heart, More, Bag} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import {brandData} from '../../../data';
import {formatPrice} from '../../utils/formatPrice';
import {ListSize} from '../../components';
import ActionSheet from 'react-native-actions-sheet';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import FastImage from 'react-native-fast-image';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;

const ItemDetail = ({route}) => {
  const {itemId, type} = route.params;
  const navigation = useNavigation();
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlist, setIsWishlist] = useState(false);
  const [itemAmount, setItemAmount] = useState(0);

  const actionSheetRef = useRef(null);
  const userId = auth().currentUser?.uid;

  const openActionSheet = () => {
    actionSheetRef.current?.show();
  };

  const closeActionSheet = () => {
    actionSheetRef.current?.hide();
  };

  const fetchProductData = async () => {
    try {
      const productSnapshot = await firestore()
        .collection('products')
        .doc(itemId)
        .get();

      const productData = productSnapshot.data();
      if (productData) {
        setItemData(productData);

        const wishlistRef = firestore()
          .collection('userData')
          .doc(userId)
          .collection('wishlist')
          .doc(itemId);

        const isWishlist = (await wishlistRef.get()).exists;
        setIsWishlist(isWishlist);
      } else {
        console.log(`Product with ID ${itemId} not found.`);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProductData();
    }, []),
  );
  useEffect(() => {
    const cartRef = firestore()
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
    return () => cartRef();
  }, []);

  const navigateEdit = () => {
    closeActionSheet();
    navigation.navigate('EditItem', {itemId});
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await firestore()
        .collection('products')
        .doc(itemId)
        .delete()
        .then(() => {
          console.log('Product deleted!');
        });
      if (itemData?.image) {
        const imageRef = storage().refFromURL(itemData?.image);
        await imageRef.delete();
      }
      console.log('Product deleted!');
      closeActionSheet();
      setItemData(null);
      setLoading(false);
      navigation.navigate('MyProducts');
    } catch (error) {
      console.error(error);
    }
  };

  const toggleWishlist = async () => {
    const userId = auth().currentUser.uid;
    try {
      const wishlistRef = firestore()
        .collection('userData')
        .doc(userId)
        .collection('wishlist')
        .doc(itemId);

      const isWishlist = (await wishlistRef.get()).exists;

      if (isWishlist) {
        // Hapus dari daftar favorit jika sudah ada
        await wishlistRef.delete();
      } else {
        // Tambahkan ke daftar favorit jika belum ada
        await wishlistRef.set({
          productId: itemId,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
      }

      setIsWishlist(!isWishlist);
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };
  const toggleAddtoCart = async () => {
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
  const brand = brandData.find(data => data.id === itemData?.brandId);
  return (
    <View style={styles.container}>
      <View style={header.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}>
          <ArrowLeft2 variant="Linear" color={colors.black()} size={24} />
        </TouchableOpacity>
        <Text style={header.title}>Product Detail</Text>
        {type == 'auth' ? (
          <TouchableOpacity onPress={openActionSheet} activeOpacity={0.6}>
            <More
              variant="Linear"
              color={colors.black()}
              size={24}
              style={{transform: [{rotate: '90deg'}]}}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('Cart')} activeOpacity={0.6}>
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
        )}
      </View>
      {loading ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size={'large'} color={colors.black()} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <FastImage
            source={{
              uri: itemData?.image,
              headers: {Authorization: 'someAuthToken'},
              priority: FastImage.priority.high,
            }}
            style={item.image}
          />
          <View style={{paddingVertical: 16, gap: 16, paddingHorizontal: 24}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('ByCategory', {
                    brandId: itemData.brandId,
                  })
                }>
                <Text style={item.brand}>{brand?.brand_name}</Text>
              </TouchableOpacity>
              <View style={{flexDirection: 'row', gap: 20}}>
                <Share variant="Linear" color={colors.black()} size={24} />
                <TouchableOpacity activeOpacity={0.8} onPress={toggleWishlist}>
                  <Heart
                    variant={isWishlist ? 'Bold' : 'Linear'}
                    color={colors.black()}
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{gap: 8}}>
              <Text style={item.type}>{itemData?.productName}</Text>
              <Text style={item.price}>
                IDR {itemData?.price ? formatPrice(itemData.price) : 'N/A'}
              </Text>
            </View>
          </View>
          <View style={{gap: 12}}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: 24,
              }}>
              <Text style={styles.title}>Select Size</Text>
              <Text style={[styles.title, {textDecorationLine: 'underline'}]}>
                Size Chart
              </Text>
            </View>
            <ListSize />
          </View>
          <View style={{paddingVertical: 10, gap: 10, paddingHorizontal: 24}}>
            {itemData?.productDescription && (
              <>
                <Text style={item.description}>
                  {itemData?.productDescription}
                </Text>
                <Text style={styles.title}>Product Description</Text>
              </>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
              gap: 40,
              paddingHorizontal: 24,
            }}>
            <View style={{gap: 10}}>
              <Text style={item.description}>SKU</Text>
              <Text style={item.description}>Color</Text>
              <Text style={item.description}>Release Date</Text>
              <Text style={item.description}>Retail</Text>
            </View>

            <View style={{gap: 10}}>
              <Text style={item.description}>{itemData?.attributes.sku}</Text>
              <Text style={item.description}>{itemData?.attributes.color}</Text>
              <Text style={item.description}>
                {itemData?.attributes.releaseDate}
              </Text>
              <Text style={item.description}>
                {itemData?.attributes.retailPrice
                  ? `IDR ${formatPrice(itemData.attributes.retailPrice)}`
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
      <View style={bottomBar.bar}>
        <TouchableOpacity
          style={bottomBar.btnWhite}
          activeOpacity={0.8}
          onPress={toggleAddtoCart}>
          <Bag2 variant="Bold" size={24} color={colors.black()} />
        </TouchableOpacity>
        <TouchableOpacity style={bottomBar.btnBlack} activeOpacity={0.8}>
          <Text style={bottomBar.text}>Buy Now</Text>
        </TouchableOpacity>
      </View>
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={{
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
        indicatorStyle={{
          width: 100,
        }}
        gestureEnabled={true}
        defaultOverlayOpacity={0.3}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 15,
          }}
          onPress={navigateEdit}>
          <Text
            style={{
              fontFamily: fontType['Pjs-Medium'],
              color: colors.black(),
              fontSize: 18,
            }}>
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 15,
          }}
          onPress={handleDelete}>
          <Text
            style={{
              fontFamily: fontType['Pjs-Medium'],
              color: colors.black(),
              fontSize: 18,
            }}>
            Delete
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 15,
          }}
          onPress={closeActionSheet}>
          <Text
            style={{
              fontFamily: fontType['Pjs-Medium'],
              color: 'red',
              fontSize: 18,
            }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </ActionSheet>
    </View>
  );
};

export default ItemDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  title: {
    fontFamily: fontType['Pjs-SemiBold'],
    fontSize: 14,
    color: colors.black(),
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
const item = StyleSheet.create({
  image: {
    width: '100%',
    height: windowHeight * 0.35211268,
  },
  brand: {
    fontFamily: fontType['Pjs-SemiBold'],
    fontSize: 20,
    color: colors.black(),
    textDecorationLine: 'underline',
  },
  type: {
    fontFamily: fontType['Pjs-Medium'],
    fontSize: 16,
    color: colors.black(),
  },
  price: {
    fontFamily: fontType['Pjs-SemiBold'],
    fontSize: 20,
    color: colors.black(),
  },
  description: {
    fontFamily: fontType['Pjs-Regular'],
    fontSize: 12,
    color: colors.midGray(),
    textAlign: 'justify',
  },
});
const bottomBar = StyleSheet.create({
  bar: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    flexDirection: 'row',
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: colors.extraLightGray(),
    backgroundColor: colors.white(),
  },
  btnWhite: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.extraLightGray(),
    borderRadius: 10,
    backgroundColor: colors.white(),
  },
  btnBlack: {
    backgroundColor: colors.black(),
    borderRadius: 10,
    paddingVertical: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.white(),
    fontSize: 14,
    fontFamily: fontType['Pjs-SemiBold'],
  },
});

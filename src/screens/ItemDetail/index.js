import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {colors, fontType} from '../../theme';
import {Bag2, ArrowLeft2, Share, Heart, More} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import {brandData} from '../../../data';
import {formatPrice} from '../../utils/formatPrice';
import {ListSize} from '../../components';
import ActionSheet from 'react-native-actions-sheet';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import FastImage from 'react-native-fast-image';

const windowHeight = Dimensions.get('window').height;

const ItemDetail = ({route}) => {
  const {itemId, type} = route.params;
  const navigation = useNavigation();
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);

  const actionSheetRef = useRef(null);

  const openActionSheet = () => {
    actionSheetRef.current?.show();
  };

  const closeActionSheet = () => {
    actionSheetRef.current?.hide();
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('products')
      .doc(itemId)
      .onSnapshot(documentSnapshot => {
        const product = documentSnapshot.data();
        if (product) {
          setItemData(product);
        } else {
          console.log(`Product with ID ${itemId} not found.`);
        }
      });
    setLoading(false);
    return () => subscriber();
  }, [itemId]);
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
      setLoading(false)
      navigation.navigate('MyProducts');
    } catch (error) {
      console.error(error);
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
          <TouchableOpacity onPress={() => {}} activeOpacity={0.6}>
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
                  navigation.navigate('ByCategory', {brandId: itemData.brandId})
                }>
                <Text style={item.brand}>{brand?.brand_name}</Text>
              </TouchableOpacity>
              <View style={{flexDirection: 'row', gap: 20}}>
                <Share variant="Linear" color={colors.black()} size={24} />
                <Heart variant="Linear" color={colors.black()} size={24} />
              </View>
            </View>
            <View style={{gap: 8}}>
              <Text style={item.type}>{itemData?.productName}</Text>
              <Text style={item.price}>IDR {itemData?.price ? formatPrice(itemData.price) : 'N/A'}</Text>
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
            <Text style={styles.title}>Product Description</Text>
            <Text style={item.description}>{itemData?.productDescription}</Text>
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
                {itemData?.attributes.retailPrice ? formatPrice(itemData.attributes.retailPrice) : 'N/A'}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
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

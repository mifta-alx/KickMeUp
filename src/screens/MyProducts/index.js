import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, fontType} from '../../theme';
import {ArrowLeft2, AddCircle, Box} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import {ListItem} from '../../components';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const MyProducts = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [myProduct, setMyProduct] = useState([]);
  useEffect(() => {
    const user = auth().currentUser;
    const fetchProduct = () => {
      try {
        if (user) {
          const userId = user.uid;
          const query = firestore().collection('products').where('userId', '==', userId);
          const unsubscribeProduct = query.onSnapshot(querySnapshot => {
            const products = querySnapshot.docs.map(doc => ({
              ...doc.data(),
              id: doc.id,
            }));
            setMyProduct(products);
            setLoading(false);
          });

          return () => {
            unsubscribeProduct();
          };
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    }
    fetchProduct()
  }, []);
  return (
    <View style={styles.container}>
      <View style={header.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}>
          <ArrowLeft2 variant="Linear" color={colors.black()} size={24} />
        </TouchableOpacity>
        <Text style={header.title}>My Products</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddItem')}
          activeOpacity={0.6}>
          <AddCircle variant="Linear" color={colors.black()} size={24} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size={'large'} color={colors.black()} />
        </View>
      ) : myProduct && myProduct.length > 0 ? (
        <ListItem data={myProduct} layoutType="vertical" type="auth"/>
      ) : (
        <View
          style={{
            gap: 12,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            opacity: 0.3,
          }}>
          <Box variant="Linear" color={colors.midGray()} size={96} />
          <Text
            style={{
              color: colors.midGray(),
              fontSize: 18,
              fontFamily: fontType['Pjs-SemiBold'],
            }}>
            No Product yet.
          </Text>
        </View>
      )}
    </View>
  );
};

export default MyProducts;

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

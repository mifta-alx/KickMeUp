import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {colors, fontType} from '../../theme';
import {ArrowLeft2, AddCircle, Box} from 'iconsax-react-native';
import axios from 'axios';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {ListItem} from '../../components';

const MyProducts = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [myProduct, setMyProduct] = useState([]);
  const getAllProducts = async () => {
    setLoading(true);
    try {
      const product = await axios.get(
        'https://657b24f9394ca9e4af13d51c.mockapi.io/kickmeup/product',
      );
      setMyProduct(product.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getAllProducts();
    }, []),
  );
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
      ) : myProduct ? (
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
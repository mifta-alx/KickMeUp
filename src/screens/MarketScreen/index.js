import {View, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ListCategory, ListItem, Searchbar} from '../../components';
import {categoryItem} from '../../../data';
import {colors} from '../../theme';
import firestore from '@react-native-firebase/firestore';

const MarketScreen = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const subscriber = firestore()
      .collection('products')
      .onSnapshot(querySnapshot => {
        const products = [];
        querySnapshot.forEach(documentSnapshot => {
          products.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setAllProducts(products);
        setLoading(false);
      });
    return () => subscriber();
  }, []);

  return (
    <View style={styles.container}>
      <Searchbar />
      <ListCategory data={categoryItem} filter={true} />
      {loading ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size={'large'} color={colors.black()} />
        </View>
      ) : (
        <ListItem data={allProducts} layoutType="vertical" />
      )}
    </View>
  );
};

export default MarketScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
});

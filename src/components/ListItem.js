import {FlatList, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import Item from './Item';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ListItem = ({data, layoutType, type}) => {
  const userId = auth().currentUser?.uid;
  const [wishlist, setWishlist] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
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

    return () => wishlistSubscriber;
  }, [userId]);
  const renderItem = ({item}) => {
    const isWishlistItem = wishlist.some(data => data?.productId === item?.id);
    const variant = isWishlistItem ? 'Bold' : 'Linear';
    return (
      <Item
        variant={variant}
        itemdata={item}
        navigate={() =>
          navigation.navigate('ItemDetail', {itemId: item.id, type})
        }
      />
    );
  };
  if (layoutType == 'vertical') {
    return (
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={item => renderItem({...item})}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
      />
    );
  } else {
    return (
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={item => renderItem({...item})}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        horizontal
      />
    );
  }
};

export default ListItem;

const styles = StyleSheet.create({
  container: {paddingHorizontal: 24, paddingVertical: 14, gap: 14},
});

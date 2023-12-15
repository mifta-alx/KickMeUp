import {
  FlatList,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import Item from './Item';

const ListItem = ({data, layoutType, type}) => {
  const navigation = useNavigation()
  const [wishlist, setWishlist] = useState([]);
  const toggleWishlist = itemId => {
    if (wishlist.includes(itemId)) {
      setWishlist(wishlist.filter(id => id !== itemId));
    } else {
      setWishlist([...wishlist, itemId]);
    }
  };
  const renderItem = ({item}) => {
    variant = wishlist.includes(item.id) ? 'Bold' : 'Linear';
    return (
      <Item
        variant={variant}
        itemdata={item}
        onPress={() => toggleWishlist(item.id)}
        navigate={() => navigation.navigate('ItemDetail', {itemId : item.id, type })}
      />
    );
  };
  if(layoutType == 'vertical'){
    return (
      <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={item => renderItem({...item})}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      numColumns={2}
      columnWrapperStyle={{justifyContent: 'space-between'}}/>
    )
  }else{
    return (
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={item => renderItem({...item})}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        horizontal
      />
    )
  }
};

export default ListItem;

const styles = StyleSheet.create({
  container: {paddingHorizontal: 24, paddingVertical: 14, gap: 14},
});

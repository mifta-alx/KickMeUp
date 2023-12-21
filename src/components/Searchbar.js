import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SearchNormal1, Notification, Bag2} from 'iconsax-react-native';
import {colors, fontType} from '../theme';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Searchbar = () => {
  const [itemAmount, setItemAmount] = useState(0);
  const userId = auth().currentUser?.uid;
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
  });
  return (
    <View style={header.container}>
      <View style={searchBar.container}>
        <SearchNormal1 variant="Linear" color={colors.midGray()} size={20} />
        <Text style={searchBar.text}>Search</Text>
      </View>
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
  );
};

export default Searchbar;

const header = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 16,
  },
});
const searchBar = StyleSheet.create({
  container: {
    backgroundColor: colors.extraLightGray(),
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
  },
  text: {
    color: colors.midGray(),
    fontSize: 14,
    fontFamily: fontType['Pjs-Medium'],
  },
});

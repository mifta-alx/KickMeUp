import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import { SearchNormal1, Notification, Bag2 } from 'iconsax-react-native';
import { colors, fontType } from '../theme';

const Searchbar = () => {
  return (
    <View style={header.container}>
      <View style={searchBar.container}>
        <SearchNormal1 variant="Linear" color={colors.midGray()} size={20} />
        <Text style={searchBar.text}>Search</Text>
      </View>
      <Notification variant="Linear" color={colors.black()} size={24} />
      <Bag2 variant="Linear" color={colors.black()} size={24} />
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

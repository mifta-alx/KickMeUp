import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors, fontType} from '../theme';
import {BoxAdd, Add} from 'iconsax-react-native';

const ItemNotification = ({data}) => {
  return (
    <View style={styles.container}>
      {data?.type === 'newProduct' && (
        <BoxAdd size={24} variant="Linear" color={colors.black()} />
      )}
      <View style={{gap: 5, flex: 1}}>
      <Text style={styles.title}>{data?.title}</Text>
      <Text style={styles.desc}>{data?.desc}</Text>
      </View>
      <Add size={20} variant="Linear" color={colors.midGray()} style={{transform:[{rotate:'45deg'}]}} />
    </View>
  );
};

export default ItemNotification;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 18,
    backgroundColor: colors.white(),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.extraLightGray(),
    flexDirection: 'row',
  },
  title: {
    fontFamily: fontType['Pjs-SemiBold'],
    color: colors.black(),
    fontSize: 12,
  },
  desc:{
    fontFamily: fontType['Pjs-Regular'],
    color: colors.midGray(),
    fontSize: 10,
  }
});

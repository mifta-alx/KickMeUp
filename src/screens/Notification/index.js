import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import {ItemNotification} from '../../components';
import {colors, fontType} from '../../theme';
import {ArrowLeft2, More, Notification as IconNotif} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';

const Notification = () => {
  const notificationData = [
    {
      type: 'newProduct',
      title: 'New Drop : Adidas Samba Nylon Wales Bonner',
      desc: 'Don’t miss out on this. Check ‘em now!!',
    },
    {
      type: 'newProduct',
      title: 'New Drop : Converse Chuck 70 Hi x Stussy',
      desc: 'Don’t miss out on this. Check ‘em now!!',
    },
    {
      type: 'newProduct',
      title: 'New Drop : New Balance 992 x Stone Island',
      desc: 'Don’t miss out on this. Check ‘em now!!',
    },
  ];
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={header.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}>
          <ArrowLeft2 variant="Linear" color={colors.black()} size={24} />
        </TouchableOpacity>
        <Text style={header.title}>Notification</Text>
        <TouchableOpacity activeOpacity={0.6}>
          <More
            variant="Linear"
            color={colors.black()}
            size={24}
            style={{transform: [{rotate: '90deg'}]}}
          />
        </TouchableOpacity>
      </View>
      {notificationData.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingVertical: 10,
            gap: 10,
          }}>
          {notificationData.map((item, index) => (
            <ItemNotification data={item} key={index} />
          ))}
        </ScrollView>
      ) : (
        <View
          style={{
            gap: 12,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            opacity: 0.3,
          }}>
          <IconNotif variant="Linear" color={colors.midGray()} size={96} />
          <Text
            style={{
              color: colors.midGray(),
              fontSize: 18,
              fontFamily: fontType['Pjs-SemiBold'],
            }}>
            Notification is empty.
          </Text>
        </View>
      )}
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
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

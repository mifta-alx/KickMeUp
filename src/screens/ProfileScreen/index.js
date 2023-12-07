import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {
  ArrowRight2,
  Box,
  Card,
  Clock,
  Logout,
  MedalStar,
  MessageQuestion,
  Note,
  SecurityUser,
  Setting2,
  Tag,
  TruckFast,
} from 'iconsax-react-native';
import {colors, fontType} from '../../theme';

const menu = [
  {
    icon: <Tag variant="Linear" size={24} color={colors.black()} />,
    title: 'My Voucher',
  },
  {
    icon: <Clock variant="Linear" size={24} color={colors.black()} />,
    title: 'Recently Viewed',
  },
  {
    icon: <SecurityUser variant="Linear" size={24} color={colors.black()} />,
    title: 'Privacy Policy',
  },
  {
    icon: <Note variant="Linear" size={24} color={colors.black()} />,
    title: 'Terms And Conditions',
  },
  {
    icon: <MessageQuestion variant="Linear" size={24} color={colors.black()} />,
    title: 'Help Center',
  },
  {
    icon: <Logout variant="Linear" size={24} color={colors.black()} />,
    title: 'Logout',
  },
];

const Menu = ({icon, title}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 20,
        paddingVertical: 16,
        alignItems: 'center',
      }}>
      {icon}
      <Text
        style={{
          color: colors.black(),
          fontSize: 14,
          fontFamily: fontType['Pjs-Medium'],
        }}>
        {title}
      </Text>
    </View>
  );
};

const orderMenu = [
  {
    icon: <Card variant="Linear" size={24} color={colors.black()} />,
    title: 'To Pay',
  },
  {
    icon: <Box variant="Linear" size={24} color={colors.black()} />,
    title: 'To Ship',
  },
  {
    icon: <TruckFast variant="Linear" size={24} color={colors.black()} />,
    title: 'To Receive',
  },
  {
    icon: <MedalStar variant="Linear" size={24} color={colors.black()} />,
    title: 'To Review',
  },
];

const Order = ({icon, title}) => {
  return (
    <View
      style={{
        gap: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: 54,
      }}>
      {icon}
      <Text
        style={{
          fontSize: 10,
          fontFamily: fontType['Pjs-SemiBold'],
          color: colors.black(),
        }}>
        {title}
      </Text>
    </View>
  );
};

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <View style={header.container}>
        <Text style={header.title}>Profile</Text>
        <Setting2 variant="Linear" size={24} color={colors.black()} />
      </View>
      <View style={body.container}>
        <View style={body.profilesection}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
            style={{width: 64, height: 64, borderRadius: 100}}
          />
          <View style={{justifyContent: 'center', gap: 10, flex: 1}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fontType['Pjs-Bold'],
                color: colors.black(),
              }}>
              Arthur Conan Doyle
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: fontType['Pjs-Medium'],
                color: colors.midGray(),
              }}>
              Silver Member
            </Text>
          </View>
          <ArrowRight2 color={colors.black()} variant="Linear" size={20} />
        </View>
        <View style={{gap: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fontType['Pjs-SemiBold'],
                color: colors.black(),
              }}>
              My Order
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: fontType['Pjs-Regular'],
                color: colors.midGray(),
              }}>
              View Order History
            </Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.extraLightGray(),
              borderRadius: 10,
              paddingVertical: 20,
              paddingHorizontal: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {orderMenu.map((item, index) => (
              <Order key={index} icon={item.icon} title={item.title} />
            ))}
          </View>
        </View>
        <View>
          {menu.map((item, index) => (
            <View key={index} >
              <Menu icon={item.icon} title={item.title} />
              {index < menu.length - 1 && (
                <View
                  style={{height: 1, backgroundColor: colors.extraLightGray()}}
                />
              )}
            </View>
          ))}
        </View>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: fontType['Pjs-Regular'],
              fontSize: 10,
              color: colors.black(),
            }}>
            version 1.0.0
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;
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
const body = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    gap: 20,
  },
  profilesection: {
    borderWidth: 1,
    borderColor: colors.extraLightGray(),
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
});

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import React, {useCallback, useState} from 'react';
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
  User,
} from 'iconsax-react-native';
import {colors, fontType} from '../../theme';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';
import { checkMembershipLevel } from '../../utils/checkMembershipLevel';

const Menu = ({icon, title, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}
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
    </TouchableOpacity>
  );
};

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
const windowWidth = Dimensions.get('window').width;

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [authorized, setAuthorized] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [loading, setLoading] = useState(true);

  const checkToken = async () => {
    try {
      const userDataJSON = await AsyncStorage.getItem('userData');
      if (userDataJSON) {
        const userData = JSON.parse(userDataJSON);
        const {userToken, expirationTime} = userData;

        if (userToken && expirationTime) {
          const currentTime = new Date().getTime();
          if (currentTime <= expirationTime) {
            setAuthorized(true);
            fetchProfileData()
          } else {
            setAuthorized(false);
          }
        } else {
          setAuthorized(false);
        }
      } else {
        setAuthorized(false);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error retrieving token data:', error);
      setAuthorized(false);
    }
  };
  const fetchProfileData = () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const userId = user.uid;
        const userRef = firestore().collection('users').doc(userId);

        const unsubscribeProfile = userRef.onSnapshot(doc => {
          if (doc.exists) {
            const userData = doc.data();
            setProfileData(userData);
          } else {
            console.error('Dokumen pengguna tidak ditemukan.');
          }
          setLoading(false);
        });

        return () => {
          unsubscribeProfile();
        };
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(()=>{
      checkToken();
      // fetchProfileData();
    },[])
  )
  const handleLogout = async () => {
    try {
      await auth().signOut();
      await AsyncStorage.removeItem('userData');
      setAuthorized(false);
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
    }
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

  const menu = [
    {
      icon: <Tag variant="Linear" size={24} color={colors.black()} />,
      title: 'My Voucher',
      onPress: {},
    },
    {
      icon: <Clock variant="Linear" size={24} color={colors.black()} />,
      title: 'Recently Viewed',
      onPress: {},
    },
    {
      icon: <SecurityUser variant="Linear" size={24} color={colors.black()} />,
      title: 'Privacy Policy',
      onPress: {},
    },
    {
      icon: <Note variant="Linear" size={24} color={colors.black()} />,
      title: 'Terms And Conditions',
      onPress: {},
    },
    {
      icon: (
        <MessageQuestion variant="Linear" size={24} color={colors.black()} />
      ),
      title: 'Help Center',
      onPress: {},
    },
    {
      icon: <Logout variant="Linear" size={24} color={colors.black()} />,
      title: 'Logout',
      onPress: handleLogout,
    },
  ];
  return (
    <View style={styles.container}>
      <View style={header.container}>
        <Text style={header.title}>Profile</Text>
        <TouchableOpacity onPress={() => {}}>
          <Setting2 variant="Linear" size={24} color={colors.black()} />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size={'large'} color={colors.black()} />
        </View> ):(
      <ScrollView
        contentContainerStyle={body.container}
        showsVerticalScrollIndicator={false}>
        {!authorized ? (
          <View style={{paddingVertical: 10}}>
            <View style={{gap: 10, alignItems: 'center'}}>
              <View style={body.skeletonProfile}>
                <User size={24} variant="Linear" color={colors.lightGray()} />
              </View>
              <Text style={body.skeletonTitle}>Hi, Fam!</Text>
              <Text style={body.skeletonText}>
                Get the most out of the KickMeUp app by creating or signing in
                to your account.
              </Text>
            </View>
            <View style={{gap: 16, flexDirection: 'row', paddingVertical: 10}}>
              <TouchableOpacity
                style={[body.button, {backgroundColor: colors.white()}]}
                onPress={() => {
                  navigation.navigate('Login');
                }}
                activeOpacity={0.8}>
                <Text style={[body.buttonText, {color: colors.black()}]}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[body.button, {backgroundColor: colors.black()}]}
                onPress={() => {
                  navigation.navigate('Register');
                }}
                activeOpacity={0.8}>
                <Text style={[body.buttonText, {color: colors.white()}]}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{gap: 20}}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('MyProducts')}>
              <View style={body.profilesection}>
                <FastImage
                  source={{
                    uri: profileData?.photoUrl,
                    headers: {Authorization: 'someAuthToken'},
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={{width: 64, height: 64, borderRadius: 100}}
                />
                <View style={{justifyContent: 'center', gap: 10, flex: 1}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fontType['Pjs-Bold'],
                      color: colors.black(),
                    }}>
                    {profileData?.username}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: fontType['Pjs-Medium'],
                      color: colors.midGray(),
                    }}>
                    {checkMembershipLevel(profileData?.point)}
                  </Text>
                </View>
                <ArrowRight2
                  color={colors.black()}
                  variant="Linear"
                  size={20}
                />
              </View>
            </TouchableOpacity>
            {/* myorder */}
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
                <View key={index}>
                  <Menu icon={item.icon} title={item.title} onPress={item.onPress} />
                  {index < menu.length - 1 && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: colors.extraLightGray(),
                      }}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

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
      </ScrollView>
      )}
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
  button: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.black(),
    alignItems: 'center',
    paddingVertical: 14,
    flex: 1,
  },
  buttonText: {
    fontFamily: fontType['Pjs-SemiBold'],
    fontSize: 14,
  },
  skeletonProfile: {
    backgroundColor: colors.extraLightGray(),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    width: windowWidth * 0.21374046,
    height: windowWidth * 0.21374046,
  },
  skeletonTitle: {
    fontSize: 16,
    fontFamily: fontType['Pjs-Bold'],
    color: colors.black(),
    textAlign: 'center',
  },
  skeletonText: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Medium'],
    color: colors.midGray(),
    textAlign: 'center',
  },
});

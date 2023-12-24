import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  TouchableHighlight,
  Alert,
  ActivityIndicator
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {colors, fontType} from '../../theme';
import {ArrowLeft2, EyeSlash, Eye} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoginDisabled, setLoginDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    let errorMessage = '';
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      const userToken = await auth().currentUser.getIdToken();
      const expirationInMilliseconds = 30 * 24 * 60 * 60 * 1000; //hari * jam * menit * detik * milidetik
      const expirationTime = new Date().getTime() + expirationInMilliseconds;
      const dataToStore = {
        userToken,
        expirationTime,
      };
      await AsyncStorage.setItem('userData', JSON.stringify(dataToStore));
      setLoading(false);
      navigation.replace('MainApp');
    } catch (error) {
      setLoading(false);
      console.log('Login Error:', error.message);
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email tidak valid.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Password salah.';
      } else if (error.code === 'auth/invalid-login') {
        errorMessage = 'Email atau password salah, silahkan periksa kembali.';
      } else {
        errorMessage = 'Terjadi kesalahan saat login.';
      }
      Alert.alert('Error', errorMessage);
    }
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const updateLoginButtonStatus = () => {
    if (email.trim() && password.trim()) {
      setLoginDisabled(false);
    } else {
      setLoginDisabled(true);
    }
  };
  useEffect(() => {
    updateLoginButtonStatus();
  }, [email, password]);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={header.container}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.6}>
            <ArrowLeft2 variant="Linear" color={colors.black()} size={24} />
          </TouchableOpacity>
          <Text style={header.title}>Login</Text>
        </View>
        <View style={body.container}>
          <View style={styles.form}>
            <View>
              <Text style={textinput.label}>Email</Text>
              <View style={textinput.container}>
                <TextInput
                  placeholder="Enter your email address"
                  placeholderTextColor={colors.midGray()}
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                    updateLoginButtonStatus();
                  }}
                  inputMode="email"
                  keyboardType="email-address"
                  style={textinput.text}
                />
              </View>
            </View>
            <View>
              <Text style={textinput.label}>Password</Text>
              <View
                style={[
                  textinput.container,
                  {
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: 10,
                  },
                ]}>
                <TextInput
                  placeholder="Enter password"
                  placeholderTextColor={colors.midGray()}
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    updateLoginButtonStatus();
                  }}
                  secureTextEntry={!passwordVisible}
                  style={[textinput.text, {flex: 1}]}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  {passwordVisible ? (
                    <Eye variant="Linear" color={colors.midGray()} size={24} />
                  ) : (
                    <EyeSlash
                      variant="Linear"
                      color={colors.midGray()}
                      size={24}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <Text
                style={[
                  textinput.label,
                  {
                    fontSize: 10,
                    marginTop: 8,
                    marginBottom: 0,
                    textAlign: 'right',
                  },
                ]}>
                Forgot Password?
              </Text>
            </View>
          </View>
          <View style={{gap: 10}}>
            <TouchableHighlight
              style={[
                button.container,
                {
                  backgroundColor: isLoginDisabled
                    ? colors.black(0.6)
                    : colors.black(),
                },
              ]}
              underlayColor={colors.black(0.9)}
              onPress={handleLogin}
              disabled={isLoginDisabled}>
              {loading ? (
                <ActivityIndicator color={colors.white()} />
              ) : (
                <Text style={button.label}>Log In</Text>
              )}
            </TouchableHighlight>
            <View style={{flexDirection: 'row', gap: 5, alignSelf: 'center'}}>
              <Text style={[button.label, {color: colors.black()}]}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[button.label, {color: colors.midGray()}]}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  form: {
    gap: 20,
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
    flex: 1,
    textAlign: 'center',
  },
});
const textinput = StyleSheet.create({
  label: {
    fontFamily: fontType['Pjs-Medium'],
    fontSize: 14,
    color: colors.midGray(),
    marginBottom: 8,
  },
  container: {
    backgroundColor: colors.extraLightGray(),
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 10,
  },
  text: {
    paddingVertical: 0,
    color: colors.black(),
    fontFamily: fontType['Pjs-Medium'],
    fontSize: 14,
  },
});
const button = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  label: {
    color: colors.white(),
    fontSize: 14,
    fontFamily: fontType['Pjs-SemiBold'],
  },
});
const body = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    gap: 30,
  },
});

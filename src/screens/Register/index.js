import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {colors, fontType} from '../../theme';
import {ArrowLeft2, EyeSlash, Eye} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

const Register = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isRegisterDisabled, setRegisterDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    let match = email.match(/^([^@]+)@[^@]+$/);

    let errorMessage = '';

    if (password !== confirmPassword) {
      errorMessage = 'Password dan konfirmasi password tidak cocok.';
    } else if (password.length < 8) {
      errorMessage = 'Panjang kata sandi harus minimal 8 karakter.';
    } else {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
      if (!passwordRegex.test(password)) {
        errorMessage = 'Password harus mengandung kombinasi huruf dan angka.';
      }
    }

    if (errorMessage) {
      Alert.alert('Error', errorMessage);
      return;
    }

    setLoading(true);
    try {
      //registration
      await auth().createUserWithEmailAndPassword(email, password);
      // simpan data ke firestore
      await firestore().collection('users').doc(auth().currentUser.uid).set({
        username: match[1],
        email,
        photoUrl: `https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2680&q=80`,
        point: 0,
        createdAt: new Date(),
      });
      //login user setelah registrasi
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
      console.log('Registration Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email sudah terdaftar!';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email tidak valid';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password lemah';
      }
      Alert.alert('Error', errorMessage);
    }
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };
  const updateRegisterButtonStatus = () => {
    if (
      phoneNumber.trim() &&
      email.trim() &&
      password.trim() &&
      confirmPassword.trim()
    ) {
      setRegisterDisabled(false);
    } else {
      setRegisterDisabled(true);
    }
  };

  useEffect(() => {
    updateRegisterButtonStatus();
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
          <Text style={header.title}>Register</Text>
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
                    updateRegisterButtonStatus();
                  }}
                  inputMode="email"
                  keyboardType="email-address"
                  style={textinput.text}
                />
              </View>
            </View>
            <View>
              <Text style={textinput.label}>Phone Number</Text>
              <View style={textinput.container}>
                <TextInput
                  placeholder="Enter your phone number"
                  placeholderTextColor={colors.midGray()}
                  value={phoneNumber}
                  onChangeText={text => {
                    setPhoneNumber(text);
                    updateRegisterButtonStatus();
                  }}
                  inputMode="numeric"
                  keyboardType="phone-pad"
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
                    updateRegisterButtonStatus();
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
            </View>
            <View>
              <Text style={textinput.label}>Confirm Password</Text>
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
                  placeholder="Re-type password"
                  placeholderTextColor={colors.midGray()}
                  value={confirmPassword}
                  onChangeText={text => {
                    setConfirmPassword(text);
                    updateRegisterButtonStatus();
                  }}
                  secureTextEntry={!confirmPasswordVisible}
                  style={[textinput.text, {flex: 1}]}
                />
                <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                  {confirmPasswordVisible ? (
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
            </View>
          </View>
          <View style={{gap: 10}}>
            <TouchableHighlight
              style={[
                button.container,
                {
                  backgroundColor: isRegisterDisabled
                    ? colors.black(0.6)
                    : colors.black(),
                },
              ]}
              underlayColor={colors.black(0.9)}
              onPress={handleRegister}
              disabled={isRegisterDisabled}>
              {loading ? (
                <ActivityIndicator color={colors.white()} />
              ) : (
                <Text style={button.label}>Register</Text>
              )}
            </TouchableHighlight>
            <View style={{flexDirection: 'row', gap: 5, alignSelf: 'center'}}>
              <Text style={[button.label, {color: colors.black()}]}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[button.label, {color: colors.midGray()}]}>
                  Log In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Register;

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

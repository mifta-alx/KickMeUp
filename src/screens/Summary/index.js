import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, fontType} from '../../theme';
import {ArrowLeft2, ArrowRight2, Location} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {formatPrice} from '../../utils/formatPrice';

const windowWidth = Dimensions.get('window').width;

const truncateTextByLetters = (text, maxLetters) => {
  if (text?.length > maxLetters) {
    return text.slice(0, maxLetters) + ' ...';
  }
  return text;
};

const ItemCard = ({data}) => {
  return (
    <View style={{flexDirection: 'row', gap: 16}}>
      <FastImage
        source={{
          uri: data?.image,
          priority: FastImage.priority.high,
          headers: {Authorization: 'someAuthToken'},
        }}
        style={body.cardImage}
      />
      <View style={{gap: 8, paddingVertical: 5, flex: 5}}>
        <Text
          style={{
            color: colors.black(),
            fontSize: 14,
            fontFamily: fontType['Pjs-Bold'],
          }}>
          {truncateTextByLetters(data?.productName, 25)}
        </Text>
        <Text
          style={{
            color: colors.midGray(),
            fontSize: 12,
            fontFamily: fontType['Pjs-SemiBold'],
          }}>
          Size : US {data?.size}
        </Text>
        <Text
          style={{
            color: colors.black(),
            fontSize: 14,
            fontFamily: fontType['Pjs-SemiBold'],
          }}>
          IDR {formatPrice(data?.price)}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          paddingVertical: 5,
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}>
        <Text
          style={{
            color: colors.black(),
            fontSize: 14,
            fontFamily: fontType['Pjs-Bold'],
          }}>
          x{data?.amount}
        </Text>
      </View>
    </View>
  );
};

const Summary = ({route}) => {
  const {cart, selectedItem, total} = route.params;
  const [productData, setProductData] = useState([]);
  const navigation = useNavigation();
  const [shipping, setShipping] = useState(0);
  const [promoCode, setPromoCode] = useState();
  useEffect(() => {
    const productIdInCart = selectedItem.map(item => item.productId);
    const selectedItems = cart.filter(item =>
      productIdInCart.includes(item.productId),
    );
    setProductData(selectedItems);
  }, []);
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={header.container}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.6}>
              <ArrowLeft2 variant="Linear" color={colors.black()} size={24} />
            </TouchableOpacity>
            <Text style={header.title}>Summary</Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={body.container}>
            {/* Address */}
            <View
              style={{
                paddingVertical: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{flexDirection: 'row', gap: 14}}>
                <Location size={20} variant="Bold" color={colors.black()} />
                <View style={{gap: 5}}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fontType['Pjs-SemiBold'],
                      color: colors.black(),
                    }}>
                    Delivery Address
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fontType['Pjs-Medium'],
                      color: colors.black(),
                    }}>
                    Home - Arthur Conan Doyle
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fontType['Pjs-Medium'],
                      color: colors.midGray(),
                    }}>
                    Jl. Sukawati No.78, Gianyar, Bali
                  </Text>
                </View>
              </View>
              <ArrowRight2
                size={16}
                variant="Linear"
                color={colors.midGray()}
              />
            </View>
            {/* Item */}
            <View style={{paddingVertical: 10, gap: 14}}>
              {productData?.map((item, index) => (
                <ItemCard data={item} key={index} />
              ))}
            </View>
            {/* Shipping */}
            <View style={{paddingVertical: 10}}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.lightGray(),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                }}>
                <Text
                  style={{
                    fontFamily: fontType['Pjs-SemiBold'],
                    fontSize: 12,
                    color: colors.black(),
                  }}>
                  Select Shipping
                </Text>
                <ArrowRight2
                  size={16}
                  variant="Linear"
                  color={colors.midGray()}
                />
              </TouchableOpacity>
            </View>
            {/* Payment Section */}
            <View style={{paddingVertical: 10, gap: 20}}>
              <View>
                <View
                  style={{
                    paddingVertical: 24,
                    paddingHorizontal: 20,
                    gap: 10,
                    borderWidth: 1,
                    borderColor: colors.lightGray(),
                    borderTopStartRadius: 15,
                    borderTopEndRadius: 15,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: fontType['Pjs-Regular'],
                        color: colors.midGray(),
                      }}>
                      Subtotal
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: fontType['Pjs-SemiBold'],
                        color: colors.black(),
                      }}>
                      IDR {formatPrice(total?.summary)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: fontType['Pjs-Regular'],
                        color: colors.midGray(),
                      }}>
                      Shipping
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: fontType['Pjs-SemiBold'],
                        color: colors.black(),
                      }}>
                      IDR {formatPrice(shipping)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    paddingVertical: 24,
                    paddingHorizontal: 20,
                    gap: 10,
                    borderWidth: 1,
                    borderColor: colors.lightGray(),
                    borderBottomStartRadius: 15,
                    borderBottomEndRadius: 15,
                    borderTopWidth: 0,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: fontType['Pjs-Bold'],
                        color: colors.black(),
                      }}>
                      Total
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: fontType['Pjs-SemiBold'],
                        color: colors.black(),
                      }}>
                      IDR {formatPrice(total?.summary + shipping)}
                    </Text>
                  </View>
                </View>
              </View>
              {/* Promo Code */}
              <View style={{flexDirection: 'row', gap: 10}}>
                <View style={textinput.container}>
                  <TextInput
                    placeholder="Enter promo code"
                    placeholderTextColor={colors.midGray()}
                    value={promoCode}
                    onChange={value => setPromoCode(value)}
                    style={textinput.text}
                  />
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: colors.black(),
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.white(),
                      fontFamily: fontType['Pjs-Medium'],
                    }}>
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
              {/* Payment Method */}
              <View style={{gap: 14}}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fontType['Pjs-SemiBold'],
                    color: colors.black(),
                  }}>
                  Payment method
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 14,
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../../assets/images/apple-pay.png')}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: fontType['Pjs-Medium'],
                        color: colors.black(),
                      }}>
                      Apple Pay
                    </Text>
                  </View>
                  <ArrowRight2
                    size={16}
                    variant="Linear"
                    color={colors.midGray()}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={{paddingHorizontal: 24, paddingVertical: 10, gap: 20}}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                backgroundColor: colors.black(),
                paddingVertical: 16,
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.white(),
                  fontFamily: fontType['Pjs-Bold'],
                }}>
                Place Order
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Summary;

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
    alignItems: 'center',
    gap: 10,
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
    flex: 1,
  },
  cardImage: {
    width: windowWidth * 0.17811705,
    height: windowWidth * 0.17811705,
  },
});
const textinput = StyleSheet.create({
  container: {
    backgroundColor: colors.extraLightGray(),
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 10,
    flex: 1,
  },
  text: {
    padding: 0,
    margin: 0,
    color: colors.black(),
    fontFamily: fontType['Pjs-Medium'],
    fontSize: 12,
  },
});

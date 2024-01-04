import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {colors, fontType} from '../../theme';
import {
  Add,
  ArrowLeft2,
  BagCross1,
  Minus,
  More,
  TickSquare,
} from 'iconsax-react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {formatPrice} from '../../utils/formatPrice';
const windowWidth = Dimensions.get('window').width;

const truncateTextByLetters = (text, maxLetters) => {
  if (text.length > maxLetters) {
    return text.slice(0, maxLetters) + ' ...';
  }
  return text;
};

const Cart = () => {
  const userId = auth().currentUser?.uid;
  const navigation = useNavigation();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState({
    item: 0,
    summary: 0,
  });
  const [selectedItem, setSelectedItem] = useState([]);
  useEffect(() => {
    const cartRef = firestore()
      .collection('userData')
      .doc(userId)
      .collection('cart');
    const cartSubscriber = cartRef.onSnapshot(async querySnapshot => {
      const cartData = [];
      querySnapshot.forEach(documentSnapshot => {
        cartData.push({
          ...documentSnapshot.data(),
          id: documentSnapshot.id,
        });
      });
      const productDetails = await Promise.all(
        cartData.map(async cartItem => {
          const productId = cartItem.productId;
          const productSnapshot = await firestore()
            .collection('products')
            .doc(productId)
            .get();
          return {
            ...productSnapshot.data(),
            amount: cartItem.amount,
            size: cartItem.size,
            productId: cartItem.productId,
          };
        }),
      );
      setCart(productDetails);
      setLoading(false);
    });

    return () => cartSubscriber();
  }, []);
  const AddAmount = useCallback(
    async (itemId, price) => {
      const cartRef = firestore()
        .collection('userData')
        .doc(userId)
        .collection('cart');
      const cartItem = cart.find(item => item.productId === itemId);
      const isSelected = selectedItem.some(item => item.productId === itemId);
      if (cartItem) {
        await cartRef.doc(itemId).update({
          amount: cartItem.amount + 1,
        });

        if (isSelected) {
          setTotal(prevTotal => ({
            item: prevTotal.item + 1,
            summary: prevTotal.summary + Number(price),
          }));
        }
      }
    },
    [cart, selectedItem],
  );

  const MinusAmount = useCallback(
    async (itemId, price) => {
      const cartRef = firestore()
        .collection('userData')
        .doc(userId)
        .collection('cart');
      const cartItem = cart.find(item => item.productId === itemId);
      const isSelected = selectedItem.some(item => item.productId === itemId);

      if (cartItem) {
        // Check if the amount is already 0
        if (cartItem.amount === 1) {
          // Show confirmation alert
          Alert.alert('', 'Do you want to remove this product?', [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: async () => {
                // Remove from database
                await cartRef.doc(itemId).delete();

                // Remove from state if selected
                if (isSelected) {
                  setTotal(prevTotal => ({
                    item: prevTotal.item - 1,
                    summary: prevTotal.summary - price,
                  }));
                  setSelectedItem(prevItems =>
                    prevItems.filter(item => item.productId !== itemId),
                  );
                }
              },
            },
          ]);
        } else {
          await cartRef.doc(itemId).update({
            amount: cartItem.amount - 1,
          });

          if (isSelected) {
            setTotal(prevTotal => ({
              item: prevTotal.item - 1,
              summary: prevTotal.summary - Number(price),
            }));
          }
        }
      }
    },
    [cart, selectedItem, userId],
  );

  const handleTickPress = useCallback(
    data => {
      const selectedItemIndex = selectedItem.findIndex(
        item => item.productId === data.productId,
      );

      if (selectedItemIndex !== -1) {
        // Item already selected, remove it
        const selectedAmount = selectedItem[selectedItemIndex].amount;
        setSelectedItem(prevItems =>
          prevItems.filter(item => item.productId !== data.productId),
        );
        setTotal(prevTotal => ({
          item: prevTotal.item - selectedAmount,
          summary: prevTotal.summary - selectedAmount * data.price,
        }));
      } else {
        // Item not selected, add it
        setSelectedItem(prevItems => [
          ...prevItems,
          {productId: data.productId, amount: data.amount},
        ]);
        setTotal(prevTotal => ({
          item: prevTotal.item + data.amount,
          summary: prevTotal.summary + data.amount * data.price,
        }));
      }
    },
    [selectedItem],
  );

  const ItemCart = ({data}) => {
    const isSelected = selectedItem.some(
      item => item.productId === data.productId,
    );
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
            {truncateTextByLetters(data?.productName, 21)}
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
            justifyContent: 'space-between',
            flex: 2,
            paddingVertical: 5,
            flexDirection: 'column',
          }}>
          <View
            style={{flex: 1, justifyContent: 'flex-end', flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => handleTickPress(data)}>
              <View
                style={{borderColor: 'black', borderWidth: 2, borderRadius: 5}}>
                <TickSquare
                  variant="Bold"
                  color={isSelected ? colors.black() : colors.white(0)}
                  size={18}
                  style={{margin: -2}}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              style={{backgroundColor: 'black', padding: 5, borderRadius: 5}}
              onPress={() => MinusAmount(data?.productId, data?.price)}
              activeOpacity={0.6}>
              <Minus variant="Linear" size={10} color={colors.white()} />
            </TouchableOpacity>
            <Text
              style={{
                color: colors.black(),
                fontSize: 12,
                fontFamily: fontType['Pjs-SemiBold'],
              }}>
              {data?.amount}
            </Text>
            <TouchableOpacity
              style={{backgroundColor: 'black', padding: 5, borderRadius: 5}}
              onPress={() => AddAmount(data?.productId, data?.price)}
              activeOpacity={0.6}>
              <Add variant="Linear" size={10} color={colors.white()} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  const ListCart = ({data}) => {
    const renderItem = ({item}) => <ItemCart data={item} onPress={() => {}} />;

    return (
      <FlatList
        data={data}
        keyExtractor={item => item.productId}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={body.container}
        ItemSeparatorComponent={
          <View
            style={{
              marginVertical: 14,
              height: 1,
              backgroundColor: colors.extraLightGray(),
            }}
          />
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={header.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}>
          <ArrowLeft2 variant="Linear" color={colors.black()} size={24} />
        </TouchableOpacity>
        <Text style={header.title}>Cart</Text>
        <TouchableOpacity activeOpacity={0.6}>
          <More
            variant="Linear"
            color={colors.black()}
            size={24}
            style={{transform: [{rotate: '90deg'}]}}
          />
        </TouchableOpacity>
      </View>
      {cart.length > 0 ? (
        <>
          <ListCart data={cart} />
          <View style={{paddingHorizontal: 24, paddingVertical: 10, gap: 20}}>
            <View
              style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.midGray(),
                  fontFamily: fontType['Pjs-Regular'],
                }}>
                Total
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black(),
                  fontFamily: fontType['Pjs-Bold'],
                }}>
                IDR {formatPrice(total.summary)}
              </Text>
            </View>
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
                Checkout Now ({total.item})
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View
          style={{
            gap: 12,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            opacity: 0.3,
          }}>
          <BagCross1 variant="Linear" color={colors.midGray()} size={96} />
          <Text
            style={{
              color: colors.midGray(),
              fontSize: 18,
              fontFamily: fontType['Pjs-SemiBold'],
            }}>
            Cart is empty.
          </Text>
        </View>
      )}
    </View>
  );
};

export default Cart;
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
    flex: 1,
  },
  cardImage: {
    width: windowWidth * 0.17811705,
    height: windowWidth * 0.17811705,
  },
});

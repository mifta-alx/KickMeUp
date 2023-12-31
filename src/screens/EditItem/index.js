import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {ArrowLeft2, Add, Image as ImageIcon} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import {fontType, colors} from '../../theme';
import {brandData, categoryItem} from '../../../data';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const EditItem = ({route}) => {
  const {itemId} = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [itemData, setitemData] = useState({
    brandId: 0,
    productName: '',
    productDescription: '',
    image: '',
    price: '',
    categoryId: 0,
    attributes: {
      sku: '',
      color: '',
      releaseDate: '',
      retailPrice: '',
    },
  });
  const [oldImage, setOldImage] = useState(null);
  const handleChange = (key, value) => {
    if (key.includes('.')) {
      const [parentKey, nestedKey] = key.split('.');
      setitemData({
        ...itemData,
        [parentKey]: {
          ...itemData[parentKey],
          [nestedKey]: value,
        },
      });
    } else {
      setitemData({
        ...itemData,
        [key]: value,
      });
    }
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('products')
      .doc(itemId)
      .onSnapshot(documentSnapshot => {
        const products = documentSnapshot.data();
        if (products) {
          setitemData({
            ...products,
          });
          setOldImage(products.image);
          setLoading(false);
        } else {
          console.log(`Product with ID ${itemId} not found.`);
        }
      });
    setLoading(false);
    return () => subscriber();
  }, [itemId]);

  const handleImagePick = async () => {
    ImagePicker.openPicker({
      width: 1080,
      height: 1080,
      cropping: true,
    })
      .then(image => {
        handleChange('image', image.path);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleUpdate = async () => {
    setLoading(true);
    const productName = itemData.productName.replace(/\s+/g, '_').toLowerCase();
    let filename = itemData.image.substring(
      itemData.image.lastIndexOf('/') + 1,
    );
    const extension = filename.split('.').pop();
    filename = `${productName}_${Date.now()}.${extension}`;
    const reference = storage().ref(`productImages/${filename}`);
    try {
      if (itemData.image !== oldImage && oldImage) {
        const oldImageRef = storage().refFromURL(oldImage);
        await oldImageRef.delete();
      }
      if (itemData.image !== oldImage) {
        await reference.putFile(itemData.image);
      }
      const url =
        itemData.image !== oldImage
          ? await reference.getDownloadURL()
          : oldImage;
      await firestore()
        .collection('products')
        .doc(itemId)
        .update({
          brandId: itemData.brandId,
          productName: itemData.productName,
          productDescription: itemData.productDescription,
          image: url,
          price: itemData.price,
          categoryId: itemData.categoryId,
          attributes: {
            sku: itemData.attributes.sku,
            color: itemData.attributes.color,
            releaseDate: itemData.attributes.releaseDate,
            retailPrice: itemData.attributes.retailPrice,
          },
        });
      setLoading(false);
      navigation.navigate('ItemDetail', {itemId, type:'auth'});
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={header.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}>
          <ArrowLeft2 variant="Linear" color={colors.black()} size={24} />
        </TouchableOpacity>
        <Text style={header.title}>Edit Item</Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingVertical: 10,
          gap: 12,
        }}>
        <View style={textInput.borderDashed}>
          <TextInput
            placeholder="Product name"
            value={itemData.productName}
            onChangeText={text => handleChange('productName', text)}
            placeholderTextColor={colors.gray(0.6)}
            style={textInput.title}
          />
        </View>
        {itemData.image ? (
          <View style={{position: 'relative'}}>
            <FastImage
              style={{width: 100, height: 100, borderRadius: 5, resizeMode: 'cover'}}
              source={{
                uri: itemData.image,
                headers: {Authorization: 'someAuthToken'},
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: -5,
                left : 90,
                backgroundColor: colors.black(),
                borderRadius: 25,
              }}
              onPress={() => handleChange('image', null)}>
              <Add
                size={20}
                variant="Linear"
                color={colors.white()}
                style={{transform: [{rotate: '45deg'}]}}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleImagePick}>
            <View
              style={[
                textInput.borderDashed,
                {
                  width: 100,
                  height : 100,
                  gap: 10,
                  paddingVertical: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <ImageIcon color={colors.gray(0.6)} variant="Linear" size={24} />
              <Text
                style={{
                  fontFamily: fontType['Pjs-SemiBold'],
                  fontSize: 10,
                  color: colors.gray(0.6),
                }}>
                Upload Image
              </Text>
            </View>
          </TouchableOpacity>
        )}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            rowGap: 20,
            columnGap: 27,
          }}>
          {brandData.map((data, index) => {
            return (
              <TouchableOpacity
                style={{gap: 10, alignItems: 'center'}}
                key={index}
                activeOpacity={0.6}
                onPress={() => handleChange('brandId', data.id)}>
                <View
                  style={{
                    borderWidth: 2,
                    borderColor:
                      itemData.brandId == data.id
                        ? colors.black()
                        : colors.lightGray(),
                  }}>
                  <Image
                    source={data.brand_logo}
                    style={{width: 60, height: 35}}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: fontType['Pjs-SemiBold'],
                    fontSize: 10,
                    color:
                      itemData.brandId == data.id
                        ? colors.black()
                        : colors.midGray(),
                  }}>
                  {data.brand_name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={[textInput.borderDashed]}>
          <TextInput
            placeholder="Price"
            value={itemData.price}
            onChangeText={text => handleChange('price', text)}
            placeholderTextColor={colors.gray(0.6)}
            style={textInput.content}
          />
        </View>
        <View style={[textInput.borderDashed]}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: fontType['Pjs-Regular'],
              color: colors.gray(),
            }}>
            Category
          </Text>
          <View style={category.container}>
            {categoryItem.slice(1).map((item, index) => {
              const bgColor =
                item.id === itemData.categoryId
                  ? colors.black()
                  : colors.gray(0.08);
              const color =
                item.id === itemData.categoryId
                  ? colors.white()
                  : colors.midGray();
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleChange('categoryId', item.id)}
                  style={[category.item, {backgroundColor: bgColor}]}>
                  <Text style={[category.name, {color: color}]}>
                    {item.category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={[textInput.borderDashed, {minHeight: 180}]}>
          <TextInput
            placeholder="Product description"
            value={itemData.productDescription}
            onChangeText={text => handleChange('productDescription', text)}
            placeholderTextColor={colors.gray(0.6)}
            multiline
            style={textInput.content}
          />
        </View>
        <View style={[textInput.borderDashed]}>
          <TextInput
            placeholder="SKU"
            value={itemData.attributes.sku}
            onChangeText={text => handleChange('attributes.sku', text)}
            placeholderTextColor={colors.gray(0.6)}
            style={textInput.content}
          />
        </View>
        <View style={[textInput.borderDashed]}>
          <TextInput
            placeholder="Color"
            value={itemData.attributes.color}
            onChangeText={text => handleChange('attributes.color', text)}
            placeholderTextColor={colors.gray(0.6)}
            style={textInput.content}
          />
        </View>
        <View style={[textInput.borderDashed]}>
          <TextInput
            placeholder="Release date"
            value={itemData.attributes.releaseDate}
            onChangeText={text => handleChange('attributes.releaseDate', text)}
            placeholderTextColor={colors.gray(0.6)}
            style={textInput.content}
          />
        </View>
        <View style={[textInput.borderDashed]}>
          <TextInput
            placeholder="Retail price"
            value={itemData.attributes.retailPrice}
            onChangeText={text => handleChange('attributes.retailPrice', text)}
            placeholderTextColor={colors.gray(0.6)}
            style={textInput.content}
          />
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonLabel}>Update</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.black()} />
        </View>
      )}
    </View>
  );
};

export default EditItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  header: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    elevation: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    fontFamily: fontType['Pjs-Bold'],
    fontSize: 16,
    color: colors.black(),
  },
  bottomBar: {
    backgroundColor: colors.white(),
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 10,
    shadowColor: colors.black(),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.black(),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: 14,
    fontFamily: fontType['Pjs-SemiBold'],
    color: colors.white(),
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.black(0.4),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const textInput = StyleSheet.create({
  borderDashed: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: colors.gray(0.4),
  },
  title: {
    fontSize: 14,
    fontFamily: fontType['Pjs-Medium'],
    color: colors.black(),
    padding: 0,
  },
  content: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.black(),
    padding: 0,
  },
});
const category = StyleSheet.create({
  title: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.gray(0.6),
  },
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
  },
  name: {
    fontSize: 10,
    fontFamily: fontType['Pjs-Medium'],
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
    flex:1, 
    textAlign:'center'
  },
});

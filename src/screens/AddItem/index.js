import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {ArrowLeft} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import {fontType, colors} from '../../theme';
import {brandData} from '../../../data';

const AddItem = () => {
  const [itemData, setitemData] = useState({
    brandId: 0,
    productName: '',
    productDescription: '',
    image: '',
    price: '',
    sku: '',
    color: '',
    releaseDate: '',
    retailPrice: '',
  });
  const handleChange = (key, value) => {
    setitemData({
      ...itemData,
      [key]: value,
    });
  };
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={colors.black()} variant="Linear" size={24} />
        </TouchableOpacity>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={styles.title}>Add Item</Text>
        </View>
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
            value={itemData.title}
            onChangeText={text => handleChange('title', text)}
            placeholderTextColor={colors.gray(0.6)}
            multiline
            style={textInput.title}
          />
        </View>
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
                onPress={ () => handleChange('brandId', data.id)}>
                <View style={{borderWidth: 2, borderColor: itemData.brandId == data.id ? colors.black() : colors.lightGray()}}>
                  <Image
                    source={data.brand_logo}
                    style={{width: 60, height: 35}}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: fontType['Pjs-SemiBold'],
                    fontSize: 10,
                    color: itemData.brandId == data.id ? colors.black() : colors.midGray(),
                  }}>
                  {data.brand_name}
                </Text>
              </TouchableOpacity>
            );
          })}
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
            placeholder="Image"
            value={itemData.image}
            onChangeText={text => handleChange('image', text)}
            placeholderTextColor={colors.gray(0.6)}
            style={textInput.content}
          />
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
          <TextInput
            placeholder="Color"
            value={itemData.color}
            onChangeText={text => handleChange('color', text)}
            placeholderTextColor={colors.gray(0.6)}
            style={textInput.content}
          />
        </View>
        <View style={[textInput.borderDashed]}>
          <TextInput
            placeholder="Release date"
            value={itemData.relaseDate}
            onChangeText={text => handleChange('releaseDate', text)}
            placeholderTextColor={colors.gray(0.6)}
            style={textInput.content}
          />
        </View>
        <View style={[textInput.borderDashed]}>
          <TextInput
            placeholder="Retail price"
            value={itemData.retailPrice}
            onChangeText={text => handleChange('retailPrice', text)}
            placeholderTextColor={colors.gray(0.6)}
            style={textInput.content}
          />
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonLabel}>Upload</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddItem;

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

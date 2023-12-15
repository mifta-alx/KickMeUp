import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator
} from 'react-native';
import {ArrowLeft} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import {fontType, colors} from '../../theme';
import {brandData, categoryItem} from '../../../data';
import axios from 'axios';


const EditItem = ({route}) => {
    const {itemId} = route.params;
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true)
    const [itemData, setitemData] = useState({
      brandId: 0,
      productName: '',
      productDescription: '',
      image: '',
      price: '',
      categoryId : 0,
      attributes : {
        sku: '',
        color: '',
        releaseDate: '',
        retailPrice: '',
      },
    });
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
        getSelectedData()
    },[itemId])

    const getSelectedData = async () => {
        try{
            const res = await axios.get(`https://657b24f9394ca9e4af13d51c.mockapi.io/kickmeup/product/${itemId}`)
            setitemData(res.data);
            setLoading(false)
        }catch(err){
            console.log(err)
        }
    }

    const handleUpdate = async () => {
        setLoading(true)
        try {
            await axios.put(`https://657b24f9394ca9e4af13d51c.mockapi.io/kickmeup/product/${itemId}`, {...itemData})
            .then(function (response) {
                console.log('res', response);
              })
              .catch(function (error) {
                console.log(error);
              })
              setLoading(false)
              navigation.goBack()
        } catch (err) {
            console.log(err)
        }
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color={colors.black()} variant="Linear" size={24} />
          </TouchableOpacity>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.title}>Edit Product</Text>
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
              value={itemData.productName}
              onChangeText={text => handleChange('productName', text)}
              placeholderTextColor={colors.gray(0.6)}
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
                fontFamily: fontType["Pjs-Regular"],
                color: colors.gray(),
              }}
            >
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
                    onPress={() =>
                      handleChange("categoryId", item.id)
                    }
                    style={[category.item, { backgroundColor: bgColor }]}
                  >
                    <Text style={[category.name, { color: color }]}>
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
              placeholder="Image"
              value={itemData.image}
              onChangeText={text => handleChange('image', text)}
              placeholderTextColor={colors.gray(0.6)}
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

export default EditItem


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
      fontFamily: fontType["Pjs-Regular"],
      color: colors.gray(0.6),
    },
    container: {
      flexWrap: "wrap",
      flexDirection: "row",
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
      fontFamily: fontType["Pjs-Medium"],
    },
  });
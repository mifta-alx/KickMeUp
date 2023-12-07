import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';
import {colors, fontType} from '../../theme';
import {Bag2, ArrowLeft2, Share, Heart} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import {dataItem} from '../../../data';
import {formatPrice} from '../../utils/formatPrice';
import { ListSize } from '../../components';

const windowHeight = Dimensions.get('window').height;

const ItemDetail = ({route}) => {
  const {itemId} = route.params;
  const navigation = useNavigation();

  const selectedData = dataItem.find(data => data.id === itemId);

  return (
    <View style={styles.container}>
      <View style={header.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}>
          <ArrowLeft2 variant="Linear" color={colors.black()} size={24} />
        </TouchableOpacity>
        <Text style={header.title}>Product Detail</Text>
        <TouchableOpacity onPress={() => {}} activeOpacity={0.6}>
          <Bag2 variant="Linear" color={colors.black()} size={24} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Image source={selectedData?.image.image_1} style={item.image} />
        
          <View style={{paddingVertical: 16, gap: 16, paddingHorizontal: 24}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={item.brand}>{selectedData?.brand}</Text>
              <View style={{flexDirection: 'row', gap: 20}}>
                <Share variant="Linear" color={colors.black()} size={24} />
                <Heart variant="Linear" color={colors.black()} size={24} />
              </View>
            </View>
            <View style={{gap: 8}}>
              <Text style={item.type}>{selectedData?.type}</Text>
              <Text style={item.price}>
                IDR {formatPrice(selectedData?.price)}
              </Text>
            </View>
          </View>
          <View style={{gap:12}}>
          <View  style={{justifyContent:'space-between', flexDirection:'row', paddingHorizontal:24}}>
            <Text style={styles.title}>Select Size</Text>
            <Text style={[styles.title, {textDecorationLine:'underline'}]}>Size Chart</Text>
          </View>
         <ListSize/>
          </View>
          <View style={{paddingVertical: 10, gap: 10, paddingHorizontal: 24}}>
            <Text
              style={styles.title}>
              Product Description
            </Text>
            <Text style={item.description}>{selectedData?.description}</Text>
          </View>
          <View style={{flexDirection:'row', paddingVertical:10, gap: 40, paddingHorizontal:24}}>
            <View style={{gap:10}}>
              <Text style={item.description}>SKU</Text>
              <Text style={item.description}>Color</Text>
              <Text style={item.description}>Release Date</Text>
              <Text style={item.description}>Retail</Text>
            </View>

            <View style={{gap:10}}>
              <Text style={item.description}>
                {selectedData?.attributes.sku}
              </Text>
              <Text style={item.description}>
                {selectedData?.attributes.color}
              </Text>
              <Text style={item.description}>
                {selectedData?.attributes.releaseDate}
              </Text>
              <Text style={item.description}>
                {selectedData?.attributes.retailPrice}
              </Text>
            </View>
          </View>
      </ScrollView>
    </View>
  );
};

export default ItemDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  title : {
    fontFamily: fontType['Pjs-SemiBold'],
    fontSize: 14,
    color: colors.black(),
  }
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
const item = StyleSheet.create({
  image: {
    width: '100%',
    height: windowHeight * 0.35211268,
  },
  brand: {
    fontFamily: fontType['Pjs-SemiBold'],
    fontSize: 20,
    color: colors.black(),
    textDecorationLine: 'underline',
  },
  type: {
    fontFamily: fontType['Pjs-Medium'],
    fontSize: 16,
    color: colors.black(),
  },
  price: {
    fontFamily: fontType['Pjs-SemiBold'],
    fontSize: 20,
    color: colors.black(),
  },
  description: {
    fontFamily: fontType['Pjs-Regular'],
    fontSize: 12,
    color: colors.midGray(),
    textAlign: 'justify',
  },
});

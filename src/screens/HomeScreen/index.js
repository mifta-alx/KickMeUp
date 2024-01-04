import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, fontType} from '../../theme';
import {ListCategory, ListItem, Searchbar} from '../../components';
import {dataItem, categoryItem, brandData} from '../../../data';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const windowWidth = Dimensions.get('window').width
const HomeScreen = () => {
  const navigation = useNavigation();
  const [topSneakers, setTopSneakers] = useState([]);
  const [topCollaboration, setTopCollaboration] = useState([]);
  useEffect(() => {
    const topSneakersSubs = firestore()
      .collection('products')
      .orderBy('productName', 'asc')
      .onSnapshot(querySnapshot => {
        const products = [];
        querySnapshot.forEach(documentSnapshot => {
          products.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setTopSneakers(products);
      });
      const topCollaborationSubs = firestore()
      .collection('products')
      .orderBy('price', 'desc')
      .onSnapshot(querySnapshot => {
        const products = [];
        querySnapshot.forEach(documentSnapshot => {
          products.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setTopCollaboration(products);
      });
    return () => {topCollaborationSubs(), topSneakersSubs()};
  }, [])
  return (
    <View style={styles.container}>
      <Searchbar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ListCategory data={categoryItem} filter={false} />
        <View style={{paddingHorizontal: 24, paddingVertical: 10}}>
          <Image
            source={require('../../assets/images/1.jpg')}
            style={carousel.image}
          />
        </View>
        <View>
          <View style={section.header}>
            <Text style={section.title}>Top Sneakers</Text>
            <TouchableOpacity>
              <Text style={section.button}>View All</Text>
            </TouchableOpacity>
          </View>
          <ListItem data={topSneakers.slice(0, 5)} />
        </View>
        <View style={{backgroundColor: colors.black()}}>
          <View style={[section.header, {paddingVertical: 14}]}>
            <Text style={[section.title, {color: colors.white()}]}>
              Top Collaboration
            </Text>
            <TouchableOpacity>
              <Text style={[section.button, {color: colors.white()}]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <ListItem data={topCollaboration.slice(0, 5)} />
        </View>
        <View>
          <View style={section.header}>
            <Text style={section.title}>Brand Focus</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              rowGap: 20,
              columnGap: windowWidth*0.087,
              paddingHorizontal: 24,
              paddingVertical: 10,
            }}>
            {brandData.map((data, index) => {
              return (
                <TouchableOpacity style={{gap: 10, alignItems: 'center'}} key={index} activeOpacity={0.6} onPress={() => navigation.navigate('ByCategory', {brandId : data.id})}>
                  <View style={{borderWidth: 2, borderColor: colors.black()}}>
                    <Image
                      source={data.brand_logo}
                      style={{width: 60, height: 35}}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: fontType['Pjs-SemiBold'],
                      fontSize: 10,
                      color: colors.black(),
                    }}>
                    {data.brand_name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
});
const carousel = StyleSheet.create({
  image: {
    width: 'auto',
    height: 200,
    borderRadius: 10,
  },
});
const section = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
  },
  title: {
    fontFamily: fontType['Pjs-Bold'],
    fontSize: 16,
    color: colors.black(),
  },
  button: {
    fontFamily: fontType['Pjs-SemiBold'],
    fontSize: 12,
    color: colors.black(),
  },
});

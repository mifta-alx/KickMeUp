import {StyleSheet, Text, View, SafeAreaView, ScrollView, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {Bag2, Notification, SearchNormal1} from 'iconsax-react-native';
import {colors, fontType} from './src/theme';
import { ListCategory, ListItem } from './src/components';
import { dataItem, categoryItem } from './data';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={header.container}>
          <View style={searchBar.container}>
            <SearchNormal1
              variant="Linear"
              color={colors.midGray()}
              size={20}
            />
            <Text style={searchBar.text}>Search</Text>
          </View>
          <Notification variant="Linear" color={colors.black()} size={24} />
          <Bag2 variant="Linear" color={colors.black()} size={24} />
        </View>
        <ListCategory data={categoryItem}/>
        <View style={{paddingHorizontal: 24, paddingVertical: 10}}>
          <Image
            source={require('./src/assets/images/1.jpg')}
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
          <ListItem data={dataItem}/>
        </View>
        <View style={{backgroundColor:colors.black()}}>
          <View style={[section.header,{paddingVertical:14}]}>
            <Text style={[section.title, {color:colors.white()}]}>Top Collaboration</Text>
            <TouchableOpacity>
              <Text style={[section.button, {color:colors.white()}]}>View All</Text>
            </TouchableOpacity>
          </View>
          <ListItem data={dataItem}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
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
    gap: 16,
  },
});
const searchBar = StyleSheet.create({
  container: {
    backgroundColor: colors.extraLightGray(),
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
  },
  text: {
    color: colors.midGray(),
    fontSize: 14,
    fontFamily: fontType['Pjs-Medium'],
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

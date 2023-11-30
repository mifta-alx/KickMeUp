import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Bag2, Heart, Notification, SearchNormal1} from 'iconsax-react-native';
import {colors, fontType} from './src/theme';

const ListItem = () => {
  return (
    <ScrollView
      contentContainerStyle={item.container}
      showsHorizontalScrollIndicator={false}
      horizontal>
      <TouchableOpacity style={item.card}>
        <Heart
          variant="Linear"
          size={20}
          color={colors.black()}
          style={item.wishlist}
        />
        <Image
          source={require('./src/assets/images/samba(1).jpg')}
          style={item.image}
        />
        <View style={item.info}>
          <View style={item.textContainer}>
            <Text style={item.brand}>Adidas</Text>
            <Text style={item.type}>
              Adidas Samba OG Cloud White Core Black
            </Text>
          </View>
          <Text style={item.price}>IDR 2,100,000</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={item.card}>
        <Heart
          variant="Linear"
          size={20}
          color={colors.black()}
          style={item.wishlist}
        />
        <Image
          source={require('./src/assets/images/nb(1).jpg')}
          style={item.image}
        />
        <View style={item.info}>
          <View style={item.textContainer}>
            <Text style={item.brand}>New Balance</Text>
            <Text style={item.type}>New Balance 530 White SIlver Navy</Text>
          </View>
          <Text style={item.price}>IDR 1,200,000</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={item.card}>
        <Heart
          variant="Linear"
          size={20}
          color={colors.black()}
          style={item.wishlist}
        />
        <Image
          source={require('./src/assets/images/yeezy.jpg')}
          style={item.image}
        />
        <View style={item.info}>
          <View style={item.textContainer}>
            <Text style={item.brand}>Adidas</Text>
            <Text style={item.type}>
              Adidas Yeezy Boost 350 V2 MX Dark Salt
            </Text>
          </View>
          <Text style={item.price}>IDR 4,300,000</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

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
        <ScrollView
          horizontal
          contentContainerStyle={category.container}
          showsHorizontalScrollIndicator={false}>
          <View style={[category.item, {backgroundColor: colors.black()}]}>
            <Text style={[category.text, {color: colors.white()}]}>All</Text>
          </View>
          <View style={category.item}>
            <Text style={category.text}>Sports</Text>
          </View>
          <View style={category.item}>
            <Text style={category.text}>Casual</Text>
          </View>
          <View style={category.item}>
            <Text style={category.text}>Lifestyle</Text>
          </View>
          <View style={category.item}>
            <Text style={category.text}>Sneakers</Text>
          </View>
          <View style={category.item}>
            <Text style={category.text}>Luxury</Text>
          </View>
        </ScrollView>
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
          <ListItem />
        </View>
        <View style={{backgroundColor:colors.black()}}>
          <View style={[section.header,{paddingVertical:14}]}>
            <Text style={[section.title, {color:colors.white()}]}>Top Collaboration</Text>
            <TouchableOpacity>
              <Text style={[section.button, {color:colors.white()}]}>View All</Text>
            </TouchableOpacity>
          </View>
          <ListItem />
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
const category = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    gap: 10,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.extraLightGray(),
    borderRadius: 25,
  },
  text: {
    fontFamily: fontType['Pjs-Medium'],
    fontSize: 12,
    color: colors.midGray(),
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
const item = StyleSheet.create({
  container: {paddingHorizontal: 24, paddingVertical: 14, gap: 14},
  card: {
    height: 250,
    width: 165,
    borderWidth: 1,
    borderColor: colors.extraLightGray(),
    borderRadius: 10,
    backgroundColor:colors.white()
  },
  image: {width: 'auto', height: 135, borderRadius:10},
  info: {padding: 14, justifyContent: 'space-between', flex: 1},
  brand: {
    fontFamily: fontType['Pjs-SemiBold'],
    fontSize: 10,
    color: colors.black(),
  },
  price: {
    fontSize: 12,
    fontFamily: fontType['Cousine-R'],
    color: colors.black(),
  },
  type: {
    fontFamily: fontType['Pjs-Regular'],
    fontSize: 10,
    color: colors.black(),
  },
  textContainer: {gap: 5},
  wishlist: {position: 'absolute', top: 10, right: 10, zIndex: 999},
});

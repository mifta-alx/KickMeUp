import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
  } from 'react-native';
  import React from 'react';
  import {colors, fontType} from '../../theme';
  import { ListCategory, ListItem, Searchbar } from '../../components';
  import { dataItem, categoryItem } from '../../../data';

const HomeScreen = () => {
    return (
        <View style={styles.container} >
        <Searchbar/>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ListCategory data={categoryItem} filter={false}/>
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
              <ListItem data={dataItem.slice(0, 3)}/>
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
        </View>
      );
}

export default HomeScreen

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
  
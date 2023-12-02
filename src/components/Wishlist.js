import {
    FlatList,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    TouchableHighlight,
  } from 'react-native';
  import {Heart} from 'iconsax-react-native';
  import React, {useState} from 'react';
  import {colors, fontType} from '../theme';
  
  const Item = ({itemdata}) => {
    const formatPrice = price => {
      const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return formatted;
    };
    const [BtnColor, setBtnColor] = useState(colors.black());
    return (
      <TouchableOpacity style={item.card}>
        <View style={item.wishlist}>
          <Heart variant='Bold' size={20} color={colors.black()} />
        </View>
        <Image source={itemdata.image.image_1} style={item.image} />
        <View style={item.info}>
          <View style={item.textContainer}>
            <Text style={item.brand}>{itemdata.brand}</Text>
            <Text style={item.type}>{itemdata.type}</Text>
          </View>
          <View style={{gap:10}}>
          <Text style={item.price}>IDR {formatPrice(itemdata.price)}</Text>
          <TouchableHighlight style={item.button} underlayColor={colors.black()} onPressIn={()=>setBtnColor(colors.white())} onPressOut={()=>setBtnColor(colors.black())}>
            <Text style={[item.textbutton, {color:BtnColor}]}>Add to cart</Text>
          </TouchableHighlight>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

const Wishlist = ({data}) => {
    const renderItem = ({item}) => {
      return (
        <Item
          itemdata={item}
        />
      );
    };
      return (
        <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={item => renderItem({...item})}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={item.container}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}/>
      )
}

export default Wishlist

const item = StyleSheet.create({
    container: {paddingHorizontal: 24, paddingVertical: 14, gap: 14},
    card: {
      height: 290,
      width: 165,
      borderWidth: 1,
      borderColor: colors.extraLightGray(),
      borderRadius: 10,
      backgroundColor: colors.white(),
    },
    image: {width: 'auto', height: 135, borderRadius: 10},
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
    button : {
        borderWidth: 1,
        borderColor: colors.black(),
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 10,
        justifyContent:'center',
        alignItems:'center'
    },
    textbutton:{
        fontFamily : fontType['Pjs-SemiBold'],
        fontSize: 12,
    }
  });
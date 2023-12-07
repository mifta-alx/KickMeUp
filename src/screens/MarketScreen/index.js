import { View, StyleSheet } from 'react-native'
import React from 'react'
import { ListCategory, ListItem, Searchbar } from '../../components'
import { categoryItem, dataItem } from '../../../data'
import { colors } from '../../theme'

const MarketScreen = () => {
  return (
    <View style={styles.container}>
      <Searchbar/>
      <ListCategory data={categoryItem} filter={true}/>
      <ListItem data={dataItem} layoutType="vertical"/>
    </View>
  )
}

export default MarketScreen
const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor : colors.white()
  }
})
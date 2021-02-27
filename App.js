import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ImageComponent, StyleSheet, Text, View, Image } from 'react-native';
import Search from './screens/SearchScreen';
import Transaction from './screens/TransactionScreen';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';


export default function App() {
  return (
    <AppContainer/>
  );
}
const tabNavigator = createBottomTabNavigator({
  Transaction:{screen:Transaction},
  Search:{screen:Search}
},
{defaultNavigationOptions: ({navigation})=>({
  tabBarIcon: ({})=>{
    if(navigation.state.routeName==="Transaction"){
      return(
        <Image source={require("./assets/book.png")} style={{width: 40, height: 40}}/>
      )
    }
    else if(navigation.state.routeName==="Search"){
      return(
        <Image source={require("./assets/searchingbook.png")} style={{width: 40, height: 40}}/>
      )
    }
  }
})});
const AppContainer = createAppContainer(tabNavigator)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

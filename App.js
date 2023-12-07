import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Router from './src/navigation/Router';
import {SafeAreaView} from 'react-native';

const App = () => {
  return (
    <SafeAreaView
      style={{flex: 1}}
      forceInset={{top: 'always', bottom: 'always'}}>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;

import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  PersistGate, persistentStorePersistor, Provider, persistentStore,
} from 'fixit-common-data-store';
import AppStackNavigator from './navigators/appStackNavigator';
import SplashScreen from './screens/splashScreen';

const App = () : JSX.Element => (
  <Provider store={persistentStore}>
    <PersistGate loading={<SplashScreen />} persistor={persistentStorePersistor}>
      <NavigationContainer>
        <StatusBar />
        <AppStackNavigator />
      </NavigationContainer>
    </PersistGate>
  </Provider>
);

export default App;

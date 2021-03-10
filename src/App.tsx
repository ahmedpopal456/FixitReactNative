import React from 'react';
import {StatusBar} from 'react-native';
import AppStackNavigator from './navigators/appStackNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {
  PersistGate,
  persistentStorePersistor,
  Provider,
  store,
  rootContext,
  persistentStore,
} from 'fixit-common-data-store';
import SplashScreen from './screens/splashScreen';
import NotificationDispatcher from './components/notifications/NotificationDispatcher';

const App = (): JSX.Element => (
  // @ts-ignore
  <Provider store={store} context={rootContext}>
    <Provider store={persistentStore}>
      <PersistGate
        loading={<SplashScreen />}
        persistor={persistentStorePersistor}>
        <NavigationContainer>
          <StatusBar />
          <AppStackNavigator />
          <NotificationDispatcher />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  </Provider>
);

export default App;

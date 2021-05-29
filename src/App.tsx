import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  PersistGate,
  persistentStorePersistor,
  Provider,
  store,
  rootContext,
  persistentStore,
} from 'fixit-common-data-store';
import RootStackNavigator from './core/navigators/rootStackNavigator';
import SplashScreen from './screens/splashScreen';
import NotificationRenderer from './components/notifications/notificationRenderer';

const App = (): JSX.Element => {
  const navigationRef = React.useRef(null);
  return (
  // @ts-ignore
    <Provider store={store} context={rootContext}>
      <Provider store={persistentStore}>
        <PersistGate
          loading={<SplashScreen />}
          persistor={persistentStorePersistor}>
          <NavigationContainer ref={navigationRef}>
            <StatusBar />
            <NotificationRenderer navRef={navigationRef}/>
            <RootStackNavigator />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </Provider>);
};
export default App;

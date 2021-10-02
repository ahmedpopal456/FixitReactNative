import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  PersistGate,
  persistor,
  Provider,
  store,
} from 'fixit-common-data-store';
import RootStackNavigator from './core/navigators/rootStackNavigator';
import SplashScreen from './screens/splashScreen';
import NotificationRenderer from './components/notifications/notificationRenderer';
import './core/extensions/string.extensions';

const App = (): JSX.Element => {
  const navigationRef = React.useRef(null);
  return (
    <Provider store={store} >
      <PersistGate
        loading={<SplashScreen />}
        persistor={persistor}>
        <NavigationContainer ref={navigationRef}>
          <StatusBar />
          <NotificationRenderer navRef={navigationRef}/>
          <RootStackNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>);
};
export default App;

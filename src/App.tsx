import React from 'react';
import { LogBox, StatusBar } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { PersistGate, persistor, Provider, store } from './store';
import RootStackNavigator from './core/navigators/rootStackNavigator';
import SplashScreen from './screens/splashScreen';
import './core/extensions/string.extensions';
import { NotificationRenderer } from './components/notifications/notificationRenderer';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
LogBox.ignoreLogs(['Require cycle: node_modules/react-native/Libraries/Ne', 'new NativeEventEmitter()']);
const App = (): JSX.Element => {
  const navigationRef = React.useRef(null);
  return (
    <ActionSheetProvider>
      <Provider store={store}>
        <PersistGate loading={<SplashScreen />} persistor={persistor}>
          <NavigationContainer ref={navigationRef}>
            <StatusBar />
            <NotificationRenderer navRef={navigationRef} currentDisplayedRemoteMessageData={undefined} />
            <RootStackNavigator />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </ActionSheetProvider>
  );
};
export default App;

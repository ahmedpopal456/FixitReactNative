import React from 'react';
import { Text, View } from 'react-native';

function SplashScreen() : JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
    </View>
  );
}

export default SplashScreen;

import React from 'react';
import { Text, View } from 'react-native';

// These are just template pages for routing
const Test3 = (props: any) => (
  <View>
    <Text style={{ fontWeight: 'bold', fontSize: 30 }}>{props.route.params.notification.title}</Text>
    <Text>
      for plan update
      {'\n'}
      {'\n'}
      {JSON.stringify(props.route.params, null, 2)}
    </Text>
  </View>
);

export default Test3;

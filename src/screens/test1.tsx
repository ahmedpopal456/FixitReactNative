import React from 'react';
import { Text, View } from 'react-native';

// These are just template pages for routing
const Test1 = (props: any) => (
  <View>
    <Text style={{ fontWeight: 'bold', fontSize: 30 }}>{props.route.params.notification.title}</Text>
    <Text>
      for client request
      {'\n'}
      {'\n'}
      {JSON.stringify(props.route.params, null, 2)}
    </Text>
  </View>
);

export default Test1;

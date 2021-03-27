import { Button, Icon } from 'fixit-common-ui';
import React from 'react';
import { Text, View } from 'react-native';

// These are just template pages for routing
const Test2 = (props: any) => (
  <View>
    <Text style={{ fontWeight: 'bold', fontSize: 30 }}>{props.route.params.notification.title}</Text>
    <Button onPress={() => props.navigation.goBack()} color='transparent'>
      <Icon library='AntDesign' name='back' size={30} />
    </Button>
    <Text>
      for craftman response
      {'\n'}
      {'\n'}
      {JSON.stringify(props.route.params, null, 2)}
    </Text>
  </View>
);

export default Test2;

import React from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { Button, Icon, Tag } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';

function HomeScreen() : JSX.Element {
  return (
    <View style={{paddingTop:200}}>
        <View
        style={styles.content}
        >
        <TextInput
        style={{backgroundColor: 'white', borderRadius: 10, width: '80%', fontSize: 20, paddingHorizontal:20}}
        value="What needs Fixing?"
        />
        <Text>Most Popular Fixes</Text>
        <Tag>test</Tag>         
        </View>
    </View>
  );
}
const styles = StyleSheet.create({
    content: {
      alignItems: 'center',
    //   flex: 1,
      borderRadius: 25,
      backgroundColor: '#CDCDCD',
      height: 200, 
      paddingTop:30
    }
  });

export default HomeScreen;
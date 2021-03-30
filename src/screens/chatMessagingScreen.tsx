import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Button, Icon, NotificationBell } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store } from 'fixit-common-data-store';
// import { Widget } from 'react-chat-widget';
import { TextInput } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height - 95,
    width: '100%',
    backgroundColor: '#FFD14A',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  bodyContainer: {
    flex: 1,
    backgroundColor: 'white',
    flexGrow: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  input: {
    height: 50,
    width: 280,
    color:'white',
    marginRight:2.5,
    padding:10,
    backgroundColor: '#1D1F2A',
    borderRadius: 5,
    borderWidth: 1,
  },
  icons:{
    backgroundColor:'#1D1F2A', 
    borderRadius:5, 
    textAlign:'center',
    textAlignVertical:'center',
    height:50, 
    width:50, 
    margin:2.5
  },
});

export default class ChatMessagingScreen extends React.Component
<any, {
  chatSelected: boolean,
  activeMessages: [],
  matchedMessages: [], 
  profilePictureUrl: string
}> 

{
  constructor(props: any) {
    super(props);
    this.state = {
      chatSelected: true,
      //replace with messages after
      matchedMessages: store.getState().fixes.newFixes.newFixes,
      activeMessages: store.getState().fixes.newFixes.newFixes,
      profilePictureUrl: store.getState().profile.profile.profilePictureUrl,
    };
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topContainer}>
          <Button onPress={() => this.props.navigation.goBack()} color='transparent'>
            <Icon library='AntDesign' name='back' size={30} />
          </Button>
          <NotificationBell notifications={0} onPress={() => undefined} />
        </View>
        <View style={styles.bodyContainer}>
          {/* <View>
            <Widget/>
          </View> */}
          <View style ={{flexDirection:'row', alignItems:'center', margin:10, position: 'absolute', bottom:0}}>
            <TextInput style={styles.input} placeholderTextColor='white' placeholder="Enter your message..."></TextInput>
            <TouchableOpacity>
              <Icon library='AntDesign' name='picture' color='accent' size={45}  style={styles.icons}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon library='AntDesign' name='arrowright' color='accent' size={45} style={styles.icons}/> 
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
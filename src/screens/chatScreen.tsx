import React from 'react';
import { Text, View, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Button, Icon, NotificationBell } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store } from 'fixit-common-data-store';
import { ScrollView } from 'react-native-gesture-handler';

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

  messageContainer:{
    borderBottomColor: 'grey', 
    borderBottomWidth: 0.5, 
    borderRadius: 50,
    flexDirection: 'row',
    alignContent: 'center',
    padding: 10, 
    margin: 10,
    marginBottom: 15
  },
  titleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1D1F2A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderRadius: 150 / 2,
    marginBottom:10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    paddingLeft: 10,
    paddingBottom: 10,
    fontSize: 20
  }
});

export default class ChatScreen extends React.Component
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

  renderActiveMessages(){
    return (
      <ScrollView></ScrollView>
    );
  }

  renderMatchMessages(){
    return (
      <ScrollView></ScrollView>
    );
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
        <Text style={styles.title}>Chats</Text>
        <View style = {styles.bodyContainer}>
          <View style= {styles.titleContainer}>
            <Button 
            style = {{backgroundColor:this.state.chatSelected ? 'white' : 'black', borderTopLeftRadius: 20, width:195}}
            onPress={() => this.setState({ chatSelected: true })}
            outline={!this.state.chatSelected}
            >
            <Text style={{color: this.state.chatSelected ? 'black' : 'white'}}>
              Active
            </Text>
            </Button>
            <Button 
            style = {{backgroundColor:this.state.chatSelected ? 'black' : 'white', borderTopRightRadius: 20, width:195}}
            onPress={() => this.setState({ chatSelected: false })}
            outline={!!this.state.chatSelected}
            >
            <Text style={{color: this.state.chatSelected ? 'white' : 'black'}}>
              Matched
            </Text>
            </Button> 
          </View>
          <View style={styles.messageContainer}>
          {this.state.profilePictureUrl
              ? <View style={styles.image}>
                <Image
                  style={styles.image}
                  source={{ uri: this.state.profilePictureUrl }}
                />
              </View>
              : 
              <View style={styles.image}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatProfile')}>
                  <Text>Image not found</Text>
                </TouchableOpacity>
              </View>
          }
              <Icon library='AntDesign' name='mail' color='accent'/>
              <View style = {{flexDirection: 'column'}}>
                <Text style={{fontWeight : 'bold', paddingLeft: 5}}>Michael sent a message</Text>
                <Text style={{color:'gray', paddingLeft: 5}}>asfasdffsadasf</Text>
              </View>
              
              <Text style={{color:'gray', paddingLeft:20}}>Today</Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatMessage')}>
                <Icon library='AntDesign' name='right' color='grey'/>
              </TouchableOpacity>
              
              {/* /*to get the messages ?      */}
              {/* {this.state.chatSelected
                ? <View style={{ width: '100%', height: '100%' }}>
                    {((this.state.activeMessages && this.state.activeConversations.length === 0))
                      ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <Text>You currently have no active messages.</Text>
                        </View>
                      : this.renderActiveConversations()
                    }
                  </View>
                : <View style={{ width: '100%', height: '100%' }}>
                    {((this.state.matchedConversations && this.state.matchedConversations.length === 0))
                      ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <Text>You currently have no matches.</Text>
                        </View>
                      : this.renderMatchConversations()
                    }
                  </View>
              } */}
          </View>
        </View>
        

      </SafeAreaView>
    );
  }
}

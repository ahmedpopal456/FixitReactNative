import React from 'react';
import {
  Text, View, StyleSheet, Dimensions, RefreshControl, TouchableOpacity, Alert,
} from 'react-native';
import {
  Avatar, Button, colors, Icon, NotificationBell,
} from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { PersistentState, persistentStore, connect } from 'fixit-common-data-store';
import ChatService from '../../../core/services/chat/chatService';
import { ConversationModel } from '../models/chatModel';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height - 95,
    width: '100%',
    backgroundColor: colors.accent,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: colors.white,
    flexGrow: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  messageContainer: {
    borderBottomColor: colors.grey,
    borderBottomWidth: 0.5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.dark,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    paddingLeft: 10,
    paddingBottom: 10,
    fontSize: 20,
  },
});

interface ChatScreenState {
  activeSelected: boolean,
  activeConversations: ConversationModel[],
  matchedConversations: ConversationModel[],
  refreshing: boolean
}

class ChatScreen extends React.Component<any, ChatScreenState> {
  userId: string;

  chatService: ChatService;

  constructor(props: any) {
    super(props);
    this.state = {
      activeSelected: true,
      activeConversations: [],
      matchedConversations: [],
      refreshing: false,
    };
    const { userId } = persistentStore.getState().user;
    this.userId = userId || '';
    this.chatService = new ChatService(this.userId);
  }

  async fetchConversations(): Promise<void> {
    const response = await this.chatService.getConversations();
    const active: ConversationModel[] = [];
    const matched: ConversationModel[] = [];
    response.forEach((conversation) => {
      if (conversation.lastMessage == null) {
        matched.unshift(conversation);
      } else {
        active.unshift(conversation);
      }
    });
    this.setState({
      activeConversations: active,
      matchedConversations: matched,
    });
  }

  async componentDidMount() : Promise<void> {
    await this.fetchConversations();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.unseenNotificationsNumber != this.props.unseenNotificationsNumber) {
      this.fetchConversations();
    }
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.fetchConversations().then(() => {
      this.setState({ refreshing: false });
    });
  }

  renderActiveConversations() {
    return (
      <ScrollView
        refreshControl={<RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh.bind(this)} />}>
        {this.state.activeConversations.length === 0
          ? <>
            <Text
              style={{
                marginTop: 50,
                color: colors.grey,
                textAlign: 'center',
              }}>There are currently no active conversations</Text>
          </>
          : <>{this.state.activeConversations.map((conversation) => {
            const otherUser = conversation.participants.find((participant) => participant.user.id != this.userId)?.user;
            const { lastMessage } = conversation;
            const date = new Date(lastMessage.createdTimestampsUtc * 1000);
            const today = new Date();
            let lastMessageTime;
            if (date.getDate() === today.getDate()
            && date.getMonth() === today.getMonth()
            && date.getFullYear() === today.getFullYear()) {
              lastMessageTime = 'Today';
            } else {
              lastMessageTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            }
            return (
              <TouchableOpacity
                key={conversation.id}
                onPress={() => this.props.navigation.navigate('ChatMessage', { conversation })}>
                <View style={styles.messageContainer}>
                  <View style={{ flex: 2.2 }}>
                    <Avatar image={otherUser?.profilePictureUrl}></Avatar>
                  </View>
                  <View style={{ flexDirection: 'column', flex: 5 }}>
                    <Text style={{ fontWeight: 'bold', flex: 1 }}>
                      <Icon library='MaterialCommunityIcons' name='chat-processing' color='orange' size={15}/>
                      {' '}{otherUser?.firstName} {otherUser?.lastName} sent you a message
                    </Text>
                    <Text style={{ color: 'gray', flex: 1 }} numberOfLines={2}>{lastMessage.message}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', flex: 3, justifyContent: 'flex-end' }}>
                    <Text style={{ color: 'gray', fontSize: 16 }}>{lastMessageTime}</Text>
                    <Icon library='MaterialCommunityIcons' name='chevron-right' color='grey' />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
          </>}
      </ScrollView>
    );
  }

  renderMatchedConversations() {
    return (
      <ScrollView
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)} />}>
        {this.state.matchedConversations.map((conversation) => {
          const otherUser = conversation.participants.find((participant) => participant.user.id !== this.userId)?.user;
          const date = new Date(conversation.createdTimestampsUtc * 1000);
          const createdTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
          return (
            <TouchableOpacity
              key={conversation.id} onPress={() => this.props.navigation.navigate('ChatMessage', { conversation })}>
              <View style={styles.messageContainer}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatProfile')} style={{ flex: 2.2 }}>
                  <Avatar image={otherUser?.profilePictureUrl}></Avatar>
                </TouchableOpacity>
                <View style={{ flexDirection: 'column', flex: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Text style={{ color: 'gray', fontSize: 16 }}>matched on {createdTime}</Text>
                    <Icon library='MaterialCommunityIcons' name='chevron-right' color='grey' />
                  </View>
                  <Text style={{ fontSize: 18 }}>
                    {otherUser?.firstName} {otherUser?.lastName}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topContainer}>
          <Button onPress={() => this.props.navigation.goBack()} color='transparent'>
            <Icon library='AntDesign' name='back' size={30} />
          </Button>
          <NotificationBell
            notifications={this.props.unseenNotificationsNumber}
            onPress={() => this.props.navigation.navigate('Fixes', {
              screen: 'Notifications',
            })}
          />
        </View>
        <Text style={styles.title}>Chats</Text>
        <View style = {styles.bodyContainer}>
          <View style= {styles.titleContainer}>
            <Button
              testID='activeMsg'
              style = {{
                backgroundColor:
                this.state.activeSelected ? colors.dark : colors.white,
                borderTopLeftRadius: 20,
                flex: 1,
              }}
              onPress={() => this.setState({ activeSelected: true })}
              outline={!this.state.activeSelected}
            >
              <Text style={{ color: this.state.activeSelected ? colors.white : colors.dark }}>
              Active
              </Text>
            </Button>
            <Button
              testID='matchedMsg'
              style = {{
                backgroundColor: this.state.activeSelected ? colors.white : colors.dark,
                borderTopRightRadius: 20,
                flex: 1,
              }}
              onPress={() => this.setState({ activeSelected: false })}
              outline={!!this.state.activeSelected}
            >
              <Text style={{ color: this.state.activeSelected ? colors.dark : colors.white }}>
              Matched
              </Text>
            </Button>
          </View>
          {this.state.activeSelected
            ? this.renderActiveConversations()
            : this.renderMatchedConversations()
          }
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: PersistentState) {
  return {
    unseenNotificationsNumber: state.unseenNotificationsNumber,
  };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default connect(mapStateToProps)(ChatScreen);

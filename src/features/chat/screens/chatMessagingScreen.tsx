import React from 'react';
import {
  Text, View, StyleSheet, Dimensions, ViewStyle,
} from 'react-native';
import {
  Avatar, Button, Icon, NotificationBell, colors,
} from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect, StoreState, store } from 'fixit-common-data-store';
// import { Widget } from 'react-chat-widget';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { ConversationModel, MessageModel, ParticipantModel } from '../models/chatModel';
import SignalRService from '../../../core/services/chat/signalRService';
import config from '../../../core/config/appConfig';

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
    backgroundColor: 'white',
    flexGrow: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },

  input: {
    height: 50,
    color: 'white',
    marginRight: 2.5,
    padding: 10,
    backgroundColor: colors.dark,
    borderRadius: 5,
    borderWidth: 1,
    flex: 5.6,
  },
  buttons: {
    backgroundColor: colors.dark,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 50,
    width: 50,
    margin: 2.5,
    flex: 1,
  },
  headerContainer: {
    height: 80,
    flexDirection: 'row',
  },
  headerInformation: {
    flex: 5,
    padding: 10,
  },
  headerAvatar: {
    flex: 1,
  },
  messageContainer: {
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'row',
  },
  messageAvatar: {
  },
  messageBox: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 20,
    flexShrink: 1,
  },
});

interface ChatMessagingScreenState {
  conversation: ConversationModel,
  messages: MessageModel[],
  message: string
}

class ChatMessagingScreen extends React.Component<any, ChatMessagingScreenState> {
  scrollRef: React.RefObject<ScrollView>;

  userId: string;

  signalRService: SignalRService;

  selfParticipant: ParticipantModel;

  otherParticipant: ParticipantModel;

  constructor(props: any) {
    super(props);
    this.state = {
      conversation: this.props.route.params.conversation,
      messages: [],
      message: '',
    };

    this.scrollRef = React.createRef();
    const { userId } = store.getState().user;
    this.userId = userId || '';
    this.signalRService = new SignalRService(this.userId, this.state.conversation.id);

    this.selfParticipant = this.getParticipant(true);
    this.otherParticipant = this.getParticipant(false);

    this.signalRService.buildConnection()
      .then(() => {
        this.signalRService.getConnection()?.on(config.newMessageChannel, this.onNewMessage.bind(this));
        this.signalRService.getConnection()?.onclose(() => console.log('disconnected'));
        console.log('connecting...');
        this.signalRService.getConnection()?.start()
          .then(() => {
            console.log('connected!');
          })
          .catch(console.error);
      })
      .catch(console.error);
  }

  getParticipant(isSelf: boolean) : ParticipantModel {
    const participantNeeded = this.state.conversation.participants.find(
      (participant) => (isSelf ? participant.user.id === this.userId : participant.user.id !== this.userId),
    );
    if (participantNeeded == null) {
      throw new Error('cannot find user');
    }
    return participantNeeded;
  }

  async componentDidMount() : Promise<void> {
    const response = await this.signalRService.getMessages();
    this.setState({
      messages: response,
    });
    setTimeout(() => {
      setTimeout(() => { this.scrollRef?.current?.scrollToEnd({ animated: false }); });
    });
  }

  componentWillUnmount() {
    this.signalRService.getConnection()?.stop();
  }

  async onNewMessage(message: any) {
    // convert new message object properties to camel case
    const camelMessage = toCamel(message);
    console.log(camelMessage);
    if (camelMessage.conversationId === this.state.conversation.id) {
      this.setState({
        messages: this.state.messages.concat([camelMessage.message]),
      });
    }
  }

  renderMessages = () : JSX.Element => (
    <>
      {this.state.messages.map((message) => {
        const isSelf = message.createdByUser.id === this.userId;
        return (
          <View key={message.id}>
            {isSelf
              ? <><View style={[styles.messageContainer, messageContainer(isSelf)]}>
                <View style={[styles.messageBox, messageBox(isSelf)]}>
                  <Text>{message.message}</Text>
                </View>
                <View style={styles.messageAvatar}>
                  <Avatar style={{ width: 32, height: 32, backgroundColor: colors.grey }}></Avatar>
                </View>
              </View></>
              : <><View key={message.id} style={[styles.messageContainer, messageContainer(isSelf)]}>
                <View style={styles.messageAvatar}>
                  <Avatar style={{ width: 32, height: 32, backgroundColor: colors.grey }}></Avatar>
                </View>
                <View style={[styles.messageBox, messageBox(isSelf)]}>
                  <Text style={{ color: colors.white }}>{message.message}</Text>
                </View>
              </View></>
            }
          </View>
        );
      })}
    </>
  )

  renderNoMessage = (firstName: string, lastName: string): JSX.Element => (
    <View style={{ paddingTop: 10 }}>
      <Icon
        library='Ionicons' name='chatbubbles-outline'
        color='grey' size={140} style={{ alignSelf: 'center' }}/>
      <Text
        style={{ color: colors.grey, textAlign: 'center' }}>
            You do not have any messages with {firstName} {lastName}...
      </Text>
      <Text
        style={{ color: colors.grey, textAlign: 'center' }}>
            Start chatting now!
      </Text>
    </View>
  )

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.bodyContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.headerInformation}>
              <Text style={{ textAlign: 'right', color: colors.grey }}>
                {/* last seen at {otherParticipant.lastRead} */}
              </Text>
              <Text style={{ textAlign: 'right', fontSize: 20 }}>
                {this.otherParticipant.user.firstName} {this.otherParticipant.user.lastName}
              </Text>
            </View>
            <View style={styles.headerAvatar}>
              <Avatar image={this.otherParticipant.user.profilePictureUrl}></Avatar>
            </View>
          </View>

          <ScrollView
            ref = {this.scrollRef}
            style={{ marginBottom: 50 }}
            onContentSizeChange={
              () => {
                setTimeout(() => { this.scrollRef?.current?.scrollToEnd({ animated: false }); });
              }}>
            {this.state.messages.length !== 0
              ? this.renderMessages()
              : this.renderNoMessage(this.otherParticipant.user.firstName, this.otherParticipant.user.lastName)}
          </ScrollView>

          <View style ={{
            flexDirection: 'row', alignItems: 'center', margin: 5, position: 'absolute', bottom: 0, left: 0, right: 0,
          }}>
            <TextInput
              style={styles.input}
              placeholderTextColor='white'
              placeholder="Enter your message..."
              onChangeText={(text) => this.setState({ message: text })} value={this.state.message}
              onSubmitEditing={() => {
                this.signalRService.sendMessage(this.selfParticipant.user,
                  this.otherParticipant.user, this.state.message); this.setState({ message: '' });
              }}></TextInput>
            <Button style={styles.buttons}>
              <Icon library='FontAwesome' name='image' color='accent' size={20}/>
            </Button>
            <Button
              style={styles.buttons}
              onPress={() => {
                this.signalRService.sendMessage(this.selfParticipant.user,
                  this.otherParticipant.user, this.state.message); this.setState({ message: '' });
              }}>
              <Icon library='FontAwesome' name='send' color='accent' size={20}/>
            </Button>
          </View>

        </View>
      </SafeAreaView>
    );
  }
}

function messageContainer(isSelf: boolean): ViewStyle {
  return isSelf
    ? { justifyContent: 'flex-end' }
    : { justifyContent: 'flex-start' };
}

function messageBox(isSelf: boolean): ViewStyle {
  return isSelf
    ? { borderTopLeftRadius: 10, backgroundColor: colors.light }
    : { borderTopRightRadius: 10, backgroundColor: colors.dark };
}

function toCamel(o: any) {
  const newO : any = {}; let newKey; let value;
  if (o instanceof Array) {
    return o.map((item) => {
      if (typeof item === 'object') {
        value = toCamel(item);
      }
      return item;
    });
  }

  Object.keys(o).forEach((key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (o.hasOwnProperty(key)) {
      newKey = (key.charAt(0).toLowerCase() + key.slice(1) || key).toString();
      value = o[key];
      if (value instanceof Array || (value !== null && value.constructor === Object)) {
        value = toCamel(value);
      }

      newO[newKey] = value;
    }
  });
  return newO;
}
function mapStateToProps(state: StoreState) {
  return {
    unseenNotificationsNumber: state.persist.unseenNotificationsNumber,
  };
}

export default connect(mapStateToProps)(ChatMessagingScreen);

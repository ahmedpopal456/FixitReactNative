import React, { FunctionComponent, useState } from 'react';
import {
  Text, View, StyleSheet, Dimensions, ViewStyle,
} from 'react-native';
import {
  Button, Icon, colors,
} from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StoreState, useSelector,
} from 'fixit-common-data-store';
// import { Widget } from 'react-chat-widget';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import useAsyncEffect from 'use-async-effect';
import { Avatar } from 'react-native-elements';
import { ConversationModel, MessageModel } from '../models/chatModel';
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

const ChatMessagingScreen : FunctionComponent<any> = (props) => {
  const scrollRef: React.RefObject<ScrollView> = React.createRef();
  const user = useSelector((storeState: StoreState) => storeState.user);
  const [conversation] = useState<ConversationModel>(props.route.params.conversation);
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [message, setMessage] = useState<string>('');

  const signalRService: SignalRService = new SignalRService(user.userId as string, conversation.id);

  const getParticipant = (isSelf: boolean) => {
    const participantNeeded = conversation.participants.find(
      (participant) => (isSelf ? participant.user.id === user.userId : participant.user.id !== user.userId),
    );
    if (participantNeeded == null) {
      throw new Error('cannot find user');
    }
    return participantNeeded;
  };

  const selfParticipant = getParticipant(true);
  const otherParticipant = getParticipant(false);

  useAsyncEffect(async () => {
    const response = await signalRService.getMessages();
    setMessages(response);
    setTimeout(() => {
      setTimeout(() => { scrollRef?.current?.scrollToEnd({ animated: false }); });
    });
    signalRService.buildConnection()
      .then(() => {
        signalRService.getConnection()?.on(config.newMessageChannel,
          (incomingMessage) => {
            onNewMessage(incomingMessage);
          });
        signalRService.getConnection()?.start();
      });

    return () => {
      signalRService.getConnection()?.stop();
    };
  }, []);

  const onNewMessage = async (newMessage: any) => {
    const camelMessage = toCamel(newMessage);

    if (camelMessage.conversationId === conversation.id) {
      const backupMessages = messages;
      backupMessages.push(camelMessage.message);
      setMessages(backupMessages);
    }
  };

  const renderMessages = () : JSX.Element => (
    <>
      {messages.map((mess) => {
        const isSelf = mess.createdByUser.id === user.userId;
        return (
          <View key={mess.id}>
            {isSelf
              ? <><View style={[styles.messageContainer, messageContainer(isSelf)]}>
                <View style={[styles.messageBox, messageBox(isSelf)]}>
                  <Text>{mess.message}</Text>
                </View>
                <View style={styles.messageAvatar}>
                  <Avatar
                    size="medium"
                    rounded
                    icon={{ name: 'user', color: '#FFD14A', type: 'font-awesome' }}
                  />
                </View>
              </View></>
              : <><View key={mess.id} style={[styles.messageContainer, messageContainer(isSelf)]}>
                <View style={styles.messageAvatar}>
                  <Avatar
                    size="medium"
                    rounded
                    icon={{ name: 'user', color: '#FFD14A', type: 'font-awesome' }}
                  />
                </View>
                <View style={[styles.messageBox, messageBox(isSelf)]}>
                  <Text style={{ color: colors.white }}>{mess.message}</Text>
                </View>
              </View></>
            }
          </View>
        );
      })}
    </>
  );

  const renderNoMessage = (firstName: string, lastName: string): JSX.Element => (
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
  );

  const render = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.headerInformation}>
            <Text style={{ textAlign: 'right', color: colors.grey }}>
              {/* last seen at {otherParticipant.lastRead} */}
            </Text>
            <Text style={{ textAlign: 'right' }}>
              {otherParticipant?.user.firstName} {otherParticipant?.user.lastName}
            </Text>
          </View>
        </View>

        <ScrollView
          ref = {scrollRef}
          style={{ marginBottom: 50 }}
          onContentSizeChange={
            () => {
              setTimeout(() => { scrollRef?.current?.scrollToEnd({ animated: false }); });
            }}>
          {messages.length !== 0
            ? renderMessages()
            : renderNoMessage(otherParticipant?.user.firstName as string, otherParticipant?.user.lastName as string)}
        </ScrollView>

        <View style ={{
          flexDirection: 'row', alignItems: 'center', margin: 5, position: 'absolute', bottom: 0, left: 0, right: 0,
        }}>
          <TextInput
            style={styles.input}
            placeholderTextColor='white'
            placeholder="Enter your message..."
            onChangeText={(text) => setMessage(text)}
            value={message}
            onSubmitEditing={() => {
              signalRService.sendMessage(
                selfParticipant.user,
                otherParticipant.user,
                message,
              );
              setMessage('');
            }}>
          </TextInput>
          <Button style={styles.buttons}>
            <Icon library='FontAwesome' name='image' color='accent' size={20}/>
          </Button>
          <Button
            style={styles.buttons}
            onPress={() => {
              signalRService.sendMessage(
                selfParticipant.user,
                otherParticipant.user,
                message,
              );
              setMessage('');
            }}>
            <Icon library='FontAwesome' name='send' color='accent' size={20}/>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
  return render();
};

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

export default ChatMessagingScreen;
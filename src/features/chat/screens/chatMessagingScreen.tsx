import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Dimensions, ViewStyle, RefreshControl } from 'react-native';
import { Button, Icon, colors } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoreState, useSelector } from 'fixit-common-data-store';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import useAsyncEffect from 'use-async-effect';
import { Avatar } from 'react-native-elements';
import { ConversationModel, ConversationMessageModel } from '../models/chatModels';
import SignalRService, { SignalRConnectionOptions } from '../../../core/services/chat/signalRService';
import ChatService from '../../../core/services/chat/chatService';

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
  messageAvatar: {},
  messageBox: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 20,
    flexShrink: 1,
  },
});
export interface ConversationMessageState {
  messages: ConversationMessageModel[];
  length: number;
}
const signalRService = new SignalRService();

const ChatMessagingScreen: FunctionComponent<any> = (props) => {
  const scrollRef: React.RefObject<ScrollView> = React.createRef();
  const user = useSelector((storeState: StoreState) => storeState.user);
  const [conversation] = useState<ConversationModel>(props.route.params.conversation);
  const [messagesState, setMessages] = useState<ConversationMessageState>({} as any);
  const [message, setMessage] = useState<string>('');
  const [newMessage, setNewMessage] = useState<ConversationMessageModel>({} as any);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const chatService: ChatService = new ChatService(user.userId as string);
  signalRService.setGroup(user.userId as string, conversation.id);

  const onNewMessage = useCallback<(receivedMessage: ConversationMessageModel) => void>(
    (receivedMessage) => {
      const jsonMessage = toCamel(receivedMessage);
      setNewMessage(jsonMessage as ConversationMessageModel);
      setMessage('');
    },
    [messagesState],
  );

  const getParticipant = (isSelf: boolean) => {
    const participantNeeded = conversation.participants.find((participant) =>
      isSelf ? participant.user.id === user.userId : participant.user.id !== user.userId,
    );
    if (participantNeeded == null) {
      throw new Error('cannot find user');
    }
    return participantNeeded;
  };

  const selfParticipant = getParticipant(true);
  const otherParticipant = getParticipant(false);

  // TODO: Add paging, so that more than 1000 items get shown
  useEffect(() => {
    onRefresh();
    setTimeout(() => {
      setTimeout(() => {
        scrollRef?.current?.scrollToEnd({ animated: false });
      });
    });

    return () => {
      signalRService.leaveGroup();
    };
  }, []);

  useAsyncEffect(async () => {
    await signalRService.initializeGetConnectionInfoListener(onNewMessage, {
      rejoinGroupOnHubStart: true,
    } as SignalRConnectionOptions);
  }, []);

  useAsyncEffect(async () => {
    messagesState.messages?.push(newMessage);
    setMessages(messagesState);
  }, [newMessage]);

  const onRefresh = () => {
    setRefreshing(true);
    chatService.getMessages(conversation.id, 1, 1000).then((data) => {
      setMessages({
        messages: data.reverse(),
        length: data.length,
      });
      setRefreshing(false);
    });
  };

  const renderMessages = (): JSX.Element => (
    <>
      {messagesState.messages?.map((mess) => {
        const isSelf = mess.createdByUser.id === user.userId;
        return (
          <View key={mess.createdTimestampUtc}>
            {isSelf ? (
              <>
                <View style={[styles.messageContainer, messageContainer(isSelf)]}>
                  <View style={[styles.messageBox, messageBox(isSelf)]}>
                    <Text>{mess.message}</Text>
                  </View>
                  <View style={styles.messageAvatar}>
                    <Avatar
                      size="medium"
                      rounded
                      icon={{
                        name: 'user',
                        color: '#FFD14A',
                        type: 'font-awesome',
                      }}
                    />
                  </View>
                </View>
              </>
            ) : (
              <>
                <View key={mess.createdTimestampUtc} style={[styles.messageContainer, messageContainer(isSelf)]}>
                  <View style={styles.messageAvatar}>
                    <Avatar
                      size="medium"
                      rounded
                      icon={{
                        name: 'user',
                        color: '#FFD14A',
                        type: 'font-awesome',
                      }}
                    />
                  </View>
                  <View style={[styles.messageBox, messageBox(isSelf)]}>
                    <Text style={{ color: colors.white }}>{mess.message}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        );
      })}
    </>
  );

  const renderNoMessage = (firstName: string, lastName: string): JSX.Element => (
    <View style={{ paddingTop: 10 }}>
      <Icon library="Ionicons" name="chatbubbles-outline" color="grey" size={140} style={{ alignSelf: 'center' }} />
      <Text style={{ color: colors.grey, textAlign: 'center' }}>
        You do not have any messages with {firstName} {lastName}...
      </Text>
      <Text style={{ color: colors.grey, textAlign: 'center' }}>Start chatting now!</Text>
    </View>
  );

  const render = () => (
    <View style={styles.container}>
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh.bind(this)}
              size={1}
              colors={[colors.orange]}></RefreshControl>
          }
          ref={scrollRef}
          style={{ marginBottom: 50 }}
          onContentSizeChange={() => {
            setTimeout(() => {
              scrollRef?.current?.scrollToEnd({ animated: false });
            });
          }}>
          {messagesState.length !== 0
            ? renderMessages()
            : renderNoMessage(otherParticipant?.user.firstName as string, otherParticipant?.user.lastName as string)}
        </ScrollView>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            margin: 5,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          <TextInput
            style={styles.input}
            placeholderTextColor="white"
            placeholder="Enter your message..."
            onChangeText={setMessage}
            value={message}
            onSubmitEditing={() => {
              signalRService.sendMessage(conversation.id, {
                message,
                sentByUser: selfParticipant.user,
                attachments: [],
              });
            }}></TextInput>
          <Button style={styles.buttons}>
            <Icon library="FontAwesome" name="image" color="accent" size={20} />
          </Button>
          <Button
            style={styles.buttons}
            onPress={() => {
              signalRService.sendMessage(conversation.id, {
                message,
                sentByUser: selfParticipant.user,
                attachments: [],
              });
            }}>
            <Icon library="FontAwesome" name="send" color="accent" size={20} />
          </Button>
        </View>
      </View>
    </View>
  );
  return render();
};

function messageContainer(isSelf: boolean): ViewStyle {
  return isSelf ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' };
}

function messageBox(isSelf: boolean): ViewStyle {
  return isSelf
    ? { borderTopLeftRadius: 10, backgroundColor: colors.light }
    : { borderTopRightRadius: 10, backgroundColor: colors.dark };
}

function toCamel(o: any) {
  let newO;
  let origKey;
  let newKey;
  let value;
  if (o instanceof Array) {
    return o.map((value) => {
      if (typeof value === 'object') {
        value = toCamel(value);
      }
      return value;
    });
  }
  newO = {};
  // eslint-disable-next-line no-restricted-syntax
  for (origKey in o) {
    if (o.hasOwnProperty(origKey)) {
      newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
      value = o[origKey];
      if (value instanceof Array || (value !== null && value.constructor === Object)) {
        value = toCamel(value);
      }
      newO[newKey] = value;
    }
  }

  return newO;
}

export default ChatMessagingScreen;

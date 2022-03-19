import React, { FunctionComponent, useState } from 'react';
import { Text, View, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Button, colors, Icon } from 'fixit-common-ui';
import { ScrollView } from 'react-native-gesture-handler';
import { StoreState, useSelector, store } from '../../../store';
import useAsyncEffect from 'use-async-effect';
import { Avatar } from 'react-native-elements';
import ChatService from '../../../store/services/chatService';
import { ConversationModel } from '../../../store/models/chat/chatModels';
import config from '../../../core/config/appConfig';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: colors.accent,
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

const ChatScreen: FunctionComponent<any> = (props) => {
  const [activeSelected, setActiveSelected] = useState<boolean>(true);
  const [activeConversations, setActiveConversations] = useState<ConversationModel[]>([]);
  const [matchedConversations, setMatchedConversations] = useState<ConversationModel[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const user = useSelector((storeState: StoreState) => storeState.user);
  const notifications = useSelector((storeState: StoreState) => storeState.notifications.notifications);
  const userConversations = useSelector((storeState: StoreState) => storeState.chat.userConversations);
  const userConversationMessages = useSelector(
    (storeState: StoreState) => storeState.chat.selectedConversationMessages,
  );

  const chatService: ChatService = new ChatService(user.userId as string, config, store);

  useAsyncEffect(async () => {
    await onRefreshAsync();
  }, []);

  useAsyncEffect(async () => {
    const active: ConversationModel[] = [];
    const matched: ConversationModel[] = [];
    userConversations?.conversations?.forEach((conversation) => {
      if (conversation.lastMessage == null) {
        matched.unshift(conversation);
      } else {
        active.unshift(conversation);
      }
    });

    setActiveConversations(active);
    setMatchedConversations(matched);
    setRefreshing(false);
  }, [userConversations]);

  useAsyncEffect(async () => {
    await onRefreshAsync();
  }, [notifications]);

  useAsyncEffect(async () => {
    await onRefreshAsync();
  }, [userConversationMessages]);

  const onRefreshAsync = async () => {
    setRefreshing(true);
    await chatService.getConversations();
  };

  const renderActiveConversations = () => (
    <>
      {refreshing ? (
        <></>
      ) : activeConversations.length === 0 ? (
        <>
          <Text
            style={{
              marginTop: 50,
              color: colors.grey,
              textAlign: 'center',
            }}>
            There are currently no active conversations
          </Text>
        </>
      ) : (
        <>
          {activeConversations.map((conversation) => {
            const otherUser = conversation.participants.find(
              (participant) => participant.user.id !== user.userId,
            )?.user;
            const { lastMessage } = conversation;
            const date = new Date(lastMessage.createdTimestampUtc);
            const today = new Date();
            let lastMessageTime;
            if (
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear()
            ) {
              lastMessageTime = 'Today';
            } else {
              lastMessageTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            }
            return (
              <TouchableOpacity
                key={conversation.id}
                onPress={() => props.navigation.navigate('ChatMessage', { conversation })}>
                <View style={styles.messageContainer}>
                  <View style={{ flex: 2.2 }}>
                    <Avatar size="medium" rounded icon={{ name: 'user', color: '#FFD14A', type: 'font-awesome' }} />
                  </View>
                  <View style={{ flexDirection: 'column', flex: 5 }}>
                    <Text style={{ fontWeight: 'bold', flex: 1 }}>
                      <Icon library="MaterialCommunityIcons" name="chat-processing" color="orange" size={15} />{' '}
                      {otherUser?.firstName} {otherUser?.lastName} sent you a message
                    </Text>
                    <Text style={{ color: 'gray', flex: 1 }} numberOfLines={2}>
                      {lastMessage.message}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', flex: 3, justifyContent: 'flex-end' }}>
                    <Text style={{ color: 'gray', fontSize: 16 }}>{lastMessageTime}</Text>
                    <Icon library="MaterialCommunityIcons" name="chevron-right" color="grey" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </>
      )}
    </>
  );

  const renderMatchedConversations = () => (
    <>
      {matchedConversations.map((conversation) => {
        const otherUser = conversation.participants.find((participant) => participant.user.id !== user.userId)?.user;
        const date = new Date(conversation.createdTimestampUtc * 1000);
        const createdTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        return (
          <TouchableOpacity
            key={conversation.id}
            onPress={() => props.navigation.navigate('ChatMessage', { conversation })}>
            <View style={styles.messageContainer}>
              <TouchableOpacity onPress={() => props.navigation.navigate('ChatProfile')} style={{ flex: 2.2 }}>
                <Avatar size="medium" rounded icon={{ name: 'user', color: '#FFD14A', type: 'font-awesome' }} />
              </TouchableOpacity>
              <View style={{ flexDirection: 'column', flex: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Text style={{ color: 'gray', fontSize: 16 }}>matched on {createdTime}</Text>
                  <Icon library="MaterialCommunityIcons" name="chevron-right" color="grey" />
                </View>
                <Text style={{ fontSize: 18 }}>
                  {otherUser?.firstName} {otherUser?.lastName}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </>
  );

  const render = () => (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <View style={styles.titleContainer}>
          <Button
            testID="activeMsg"
            style={{
              backgroundColor: activeSelected ? colors.white : colors.dark,
              borderTopLeftRadius: 20,
              flex: 1,
            }}
            onPress={() => setActiveSelected(true)}
            outline={!activeSelected}>
            <Text style={{ color: activeSelected ? colors.dark : colors.white }}>Active</Text>
          </Button>
          <Button
            testID="matchedMsg"
            style={{
              backgroundColor: activeSelected ? colors.dark : colors.white,
              borderTopRightRadius: 20,
              flex: 1,
            }}
            onPress={() => setActiveSelected(false)}
            outline={!!activeSelected}>
            <Text style={{ color: activeSelected ? colors.white : colors.dark }}>Matched</Text>
          </Button>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefreshAsync.bind(this)}
              colors={[colors.orange]}
              size={1}
            />
          }>
          {activeSelected ? renderActiveConversations() : renderMatchedConversations()}
        </ScrollView>
      </View>
    </View>
  );

  return render();
};

export default ChatScreen;

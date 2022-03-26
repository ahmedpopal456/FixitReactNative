import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ViewStyle,
  RefreshControl,
  TouchableOpacity,
  Platform,
  Keyboard,
  Image,
} from 'react-native';
import { Button, Icon, colors } from 'fixit-common-ui';
import { store, StoreState, useSelector } from '../../../store';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import useAsyncEffect from 'use-async-effect';
import { Avatar } from 'react-native-elements';
import {
  ConversationModel,
  ConversationMessageModel,
  ConversationMessageAttachmentModel,
} from '../../../store/models/chat/chatModels';
import SignalRService, { SignalRConnectionOptions } from '../../../core/services/chat/signalRService';
import ChatService from '../../../store/services/chatService';
import config from '../../../core/config/appConfig';
import { PUSH_MESSAGE_TO_CONVERSATION, RESET_MESSAGES_FROM_CONVERSATION } from '../../../store/slices/chatSlice';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CameraAndImage } from '../../../components/CameraAndImage';
import { Asset } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { DeletableCameraAssets } from '../../../components/DeletableCameraAssets';
import FileManagementService, { UploadFileResponse } from '../../../core/services/file/fileManagementService';
import { FixitError } from '../../../common/FixitError';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height - 95,
    width: '100%',
    backgroundColor: colors.accent,
  },
  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
  input: {
    height: 50,
    color: 'white',
    backgroundColor: colors.dark,
    borderRadius: 5,
    borderWidth: 1,
    flex: 5.6,
    textAlignVertical: 'center',
    textAlign: 'left',
    paddingLeft: 10,
    margin: 5,
  },
  buttons: {
    backgroundColor: colors.dark,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 50,
    width: 50,
    flex: 1,
  },
  headerContainer: {
    height: 80,
    flexDirection: 'row',
  },
  headerInformation: {
    flex: 2,
    marginTop: 50,
    flexDirection: 'row',
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
const fileManagementService = new FileManagementService();

const ChatMessagingScreen: FunctionComponent<any> = (props) => {
  const { conversationId, conversation: paramsConversation } = props.route.params;
  const scrollRef = useRef<ScrollView>(null);
  const user = useSelector((storeState: StoreState) => storeState.user);
  const userConversationMessages = useSelector(
    (storeState: StoreState) => storeState.chat.selectedConversationMessages,
  );
  const navigation = useNavigation();
  const [assets, setAssets] = useState<Array<Asset & { isUploaded: boolean }>>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [newMessage, setNewMessage] = useState<ConversationMessageModel>({} as any);
  const [conversation] = useState<ConversationModel>(paramsConversation);
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});
  const [assetToFile, setAssetToFile] = useState<{ [key: string]: string }>({});
  const chatService: ChatService = new ChatService(user.userId as string, config, store);
  const [scrollHeight, setScrollHeight] = useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = useState<Array<UploadFileResponse>>([]);
  signalRService.setGroup(user.userId as string, conversation.id);

  const onNewMessage = useCallback<(receivedMessage: ConversationMessageModel) => void>(
    (receivedMessage) => {
      const jsonMessage = toCamel(receivedMessage);
      setNewMessage(jsonMessage as ConversationMessageModel);
      setMessage('');
    },
    [userConversationMessages],
  );

  useEffect(() => {
    return () => {
      store.dispatch(RESET_MESSAGES_FROM_CONVERSATION());
      signalRService.leaveGroup();
    };
  }, []);

  useAsyncEffect(async () => {
    await signalRService.initializeGetConnectionInfoListener(onNewMessage, {
      rejoinGroupOnHubStart: true,
    } as SignalRConnectionOptions);
  }, []);

  useAsyncEffect(async () => {
    await onRefreshAsync();
  }, []);

  useAsyncEffect(async () => {
    if (newMessage.attachments) {
      setTimeout(() => {
        store.dispatch(PUSH_MESSAGE_TO_CONVERSATION(newMessage));
      }, 300);
    }
  }, [newMessage]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      scrollRef?.current?.scrollTo({ y: scrollHeight });
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      scrollRef?.current?.scrollTo({ y: scrollHeight });
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [scrollHeight]);

  const uploadFiles = async () => {
    const tempAssets = [...assets];
    let updateAssetToFile = assetToFile;
    const tempUploadedFiles = [...uploadedFiles];
    let i = tempAssets.length;

    while (i--) {
      try {
        if (!tempAssets[i].isUploaded) {
          const uri = tempAssets[i].uri as string;
          setIsUploading({
            ...isUploading,
            [uri]: true,
          });

          const uploadedFile = await fileManagementService.uploadFile(conversationId, tempAssets[i], 'conversations');
          tempAssets[i].isUploaded = true;
          updateAssetToFile = {
            ...updateAssetToFile,
            [tempAssets[i].uri as string]: uploadedFile.fileCreatedId,
          };
          tempUploadedFiles.push(uploadedFile);
          let updateisUploading = isUploading;
          delete updateisUploading[uri];
          setIsUploading({
            ...updateisUploading,
          });
        }
      } catch (e: any & FixitError) {
        tempAssets.splice(i, 1);
      }
    }
    setUploadedFiles(tempUploadedFiles);
    setAssetToFile(updateAssetToFile);
    setAssets(tempAssets);
  };

  useAsyncEffect(async () => {
    if (conversationId) {
      await uploadFiles();
    }
  }, [assets.length]);

  const onRefreshAsync = async () => {
    setRefreshing(true);
    await chatService.getMessages(conversation.id, 1, 1000);
    setRefreshing(false);
  };

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

  const renderMessages = (): JSX.Element => (
    <>
      {userConversationMessages.messages?.map((mess) => {
        const isSelf = mess?.createdByUser?.id === user.userId;
        return (
          <View key={`${mess.createdTimestampUtc}-view-1`}>
            {isSelf ? (
              <View style={[styles.messageContainer, messageContainer(isSelf)]} key={`${mess.id}-view-2`}>
                <View style={{ flexDirection: 'column' }}>
                  {mess?.message ? (
                    <View style={[styles.messageBox, messageBox(isSelf)]} key={`${mess.id}-view-3`}>
                      <Text>{mess?.message}</Text>
                    </View>
                  ) : (
                    <></>
                  )}
                  {mess?.attachments ? (
                    <View key={`${mess.createdTimestampUtc}-attachments-view-4`} style={{ flexDirection: 'column' }}>
                      {mess?.attachments?.map((attachment) => {
                        return (
                          <Image
                            key={attachment.fileId}
                            resizeMode="cover"
                            resizeMethod="scale"
                            style={{
                              width: 100,
                              height: 100,
                              margin: 2,
                              borderRadius: 10,
                            }}
                            source={{ uri: decodeURIComponent(attachment.attachmentUrl) }}
                          />
                        );
                      })}
                    </View>
                  ) : (
                    <></>
                  )}
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
            ) : (
              <View style={[styles.messageContainer, messageContainer(isSelf)]} key={`${mess.id}-view-2`}>
                <View style={styles.messageAvatar} key={`${mess.id}-view-3`}>
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
                <View style={{ flexDirection: 'column' }}>
                  {mess?.message ? (
                    <View style={[styles.messageBox, messageBox(isSelf)]}>
                      <Text style={{ color: colors.white }}>{mess?.message}</Text>
                    </View>
                  ) : (
                    <></>
                  )}
                  {mess?.attachments ? (
                    <View key={`${mess.createdTimestampUtc}-attachments-view-4`} style={{ flexDirection: 'column' }}>
                      {mess?.attachments?.map((attachment) => {
                        return (
                          <Image
                            key={attachment.fileId}
                            resizeMode="cover"
                            resizeMethod="scale"
                            style={{
                              width: 100,
                              height: 100,
                              margin: 2,
                              borderRadius: 10,
                            }}
                            source={{ uri: decodeURIComponent(attachment.attachmentUrl) }}
                          />
                        );
                      })}
                      ;
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
              </View>
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
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled">
          <View style={styles.headerInformation}>
            <TouchableOpacity style={{ flex: 1, alignSelf: 'center' }} onPress={() => navigation.goBack()}>
              <Icon name={'chevron-left'} size={30} />
            </TouchableOpacity>
            <Text style={{ justifyContent: 'flex-end', fontSize: 20, alignSelf: 'center' }}>
              {otherParticipant?.user.firstName} {otherParticipant?.user.lastName}
            </Text>
          </View>
          <View
            style={{
              flex: assets.length > 0 ? 10 : 18,
              flexDirection: 'column',
            }}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefreshAsync.bind(this)}
                  size={1}
                  colors={[colors.orange]}
                />
              }
              ref={scrollRef}
              contentContainerStyle={{ justifyContent: 'flex-end', flexDirection: 'column', flexGrow: 1 }}
              onContentSizeChange={(_width, height) => {
                setScrollHeight(height);
                scrollRef?.current?.scrollTo({
                  y: height,
                  animated: true,
                });
              }}>
              {userConversationMessages.messages?.length !== 0
                ? renderMessages()
                : renderNoMessage(
                    otherParticipant?.user.firstName as string,
                    otherParticipant?.user.lastName as string,
                  )}
            </ScrollView>
          </View>
          <View>
            <DeletableCameraAssets
              id={conversationId}
              assets={assets}
              setAssets={setAssets}
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              assetToFile={assetToFile}
              setassetToFile={setAssetToFile}
              isUploading={isUploading}
              type={'conversations'}
            />
          </View>
          <View
            style={{
              flex: Platform.OS === 'ios' ? 2 : 3,
              flexDirection: 'row',
            }}>
            <TextInput
              style={styles.input}
              placeholderTextColor="white"
              placeholder="Enter your message..."
              onChangeText={setMessage}
              value={message}
            />
            <View style={{ width: 63, height: 63 }}>
              <CameraAndImage assets={assets} setAssets={setAssets} setErrorMessage={setErrorMessage} />
            </View>
            <Button
              style={styles.buttons}
              onPress={() => {
                if (message || uploadedFiles) {
                  let attachments: Array<ConversationMessageAttachmentModel> = [];
                  uploadedFiles.forEach((uploadedFile) => {
                    const attachment: ConversationMessageAttachmentModel = {
                      attachmentThumbnailUrl: '',
                      attachmentUrl: uploadedFile.imageUrl.url,
                      fileId: uploadedFile.fileCreatedId,
                    };
                    attachments.push(attachment);
                  });
                  signalRService.sendMessage(conversation.id, {
                    message,
                    sentByUser: selfParticipant.user,
                    attachments,
                  });

                  setAssets([]);
                  setUploadedFiles([]);
                }
              }}>
              <Icon library="FontAwesome" name="send" color="accent" size={20} />
            </Button>
          </View>
        </KeyboardAwareScrollView>
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
  let newO: any;
  let origKey;
  let newKey;
  let value;
  if (o instanceof Array) {
    return o.map((mappedValue) => {
      if (typeof mappedValue === 'object') {
        value = toCamel(mappedValue);
      }
      return mappedValue;
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

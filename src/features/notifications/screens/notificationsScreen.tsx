import React, { FunctionComponent, PropsWithChildren } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  Pressable,
  RefreshControl,
} from 'react-native';
import { Button, colors, Icon } from 'fixit-common-ui';
import {
  StoreState,
  store,
  useSelector,
  notificationsActions,
  NotificationDocument,
  FixesModel,
  NotificationsService,
  NotificationTypes,
  NotificationStatus,
} from '../../../store';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Avatar, Divider, Overlay } from 'react-native-elements';
import useAsyncEffect from 'use-async-effect';
import config from '../../../core/config/appConfig';
import { useState } from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    height: Dimensions.get('window').height - 95,
    width: '100%',
    backgroundColor: '#FFD14A',
  },
  bodyContainer: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  textContainer: {
    width: '80%',
  },
  title: {
    fontSize: 20,
    alignSelf: 'center',
  },
  seenNotif: {
    fontSize: 18,
    fontWeight: 'normal',
  },
  unseenNotif: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 50 / 2,
    overflow: 'hidden',
  },
});

export interface NotificationsScreenWithNavigationProps extends PropsWithChildren<any> {
  navigation: NavigationProp<ParamListBase, string>;
}

const notificationService = new NotificationsService(config, store);

const NotificationsScreen: FunctionComponent<NotificationsScreenWithNavigationProps> = (props) => {
  const notifications = useSelector((storeState: StoreState) => storeState.notifications.notifications);
  const user = useSelector((storeState: StoreState) => storeState.user);
  const [visible, setVisible] = useState(true);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  //TODO: Add paging to screen
  const pageSize = 100000;
  const [isRefreshing, setRefreshState] = useState<boolean>(false);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentSelectedNotification, setCurrentSelectedNotification] = useState<NotificationDocument>({});

  useAsyncEffect(async () => {
    await onRefresh();
  }, []);

  const onRefresh = async () => {
    setRefreshState(true);
    await notificationService.getNotificationsPaginated(user.userId as string, 1, pageSize);
    setRefreshState(false);
  };

  const onPressNotification = (item: NotificationDocument) => {
    const action = item.payload.action;
    if (action === NotificationTypes.NewConversation || action === NotificationTypes.NewMessage) {
      props.navigation.navigate('Chat');
    } else {
      props.navigation.navigate('Home');
    }
    store.dispatch(notificationsActions.DISPLAY_NOTIFICATION(item));
  };

  const renderItem = ({ item }: { item: NotificationDocument }): JSX.Element => {
    const isFixClientRequest = item.payload.action === NotificationTypes.FixClientRequest;
    const fix = item.payload.systemPayload as FixesModel;
    const firstName = isFixClientRequest ? fix?.createdByClient?.firstName : fix?.assignedToCraftsman?.firstName;
    const lastName = isFixClientRequest ? fix?.createdByClient?.lastName : fix?.assignedToCraftsman?.lastName;
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingBottom: 10,
        }}>
        <Icon
          style={{
            marginRight: 15,
            marginTop: 10,
          }}
          library="FontAwesome5"
          name="bell"
          color={'dark'}
          size={20}
        />
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            onPressNotification(item);
          }}
          style={{ width: '75%' }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.message?.trimEllip(35)}</Text>
          <Text style={{ fontSize: 12, color: 'grey' }}>
            {firstName} {lastName}
          </Text>
          <Text style={{ fontSize: 12, color: 'grey' }}>
            {new Date(item.createdTimestampUtc * 1000).toLocaleDateString('en-US')}
          </Text>
          <Divider style={{ marginTop: 15 }} orientation="horizontal" />
        </TouchableOpacity>
        <Button
          onPress={() => {
            setCurrentSelectedNotification(item);
            setIsModalVisible(true);
          }}
          color="white">
          <Icon library="FontAwesome5" name="ellipsis-h" color={'dark'} size={15} />
        </Button>
      </View>
    );
  };

  const render = () => {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={() => props.navigation.goBack()} color="accent">
            <Icon library="AntDesign" name="back" />
          </Button>
          <Text style={styles.title}>Notifications</Text>
        </View>
        <View style={styles.bodyContainer}>
          {!notifications || notifications?.notifications?.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <Text>You have no notifications</Text>
            </View>
          ) : (
            <FlatList
              refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} size={1} colors={[colors.orange]} />
              }
              data={notifications?.notifications}
              renderItem={renderItem}
              keyExtractor={(item: NotificationDocument) => item.id as string}
            />
          )}
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(false);
          }}>
          <TouchableOpacity
            style={{
              height: '15%',
              marginTop: 'auto',
              backgroundColor: 'white',
              elevation: 10,
              zIndex: 10,
              borderRadius: 10,
            }}
            activeOpacity={1}
            onPressOut={() => setIsModalVisible(false)}>
            <View
              style={{
                flex: 1,
              }}>
              <View>
                <TouchableOpacity
                  style={{ flexDirection: 'row', padding: 20, alignItems: 'center' }}
                  onPress={() => {
                    notificationService.deleteNotificationsByIds(user.userId as string, [
                      currentSelectedNotification.id,
                    ]);
                    setIsModalVisible(false);
                    onRefresh();
                  }}>
                  <Button color="light" onPress={() => {}}>
                    <Icon library="FontAwesome5" name="trash" color={'dark'} size={15} />
                  </Button>
                  <Text>Remove this notification</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };

  return render();
};

export default NotificationsScreen;

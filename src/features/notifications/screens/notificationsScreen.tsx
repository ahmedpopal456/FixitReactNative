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
import { useActionSheet } from '@expo/react-native-action-sheet';

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
  const { showActionSheetWithOptions } = useActionSheet();

  //TODO: Add paging to screen
  const pageSize = 100000;
  const [isRefreshing, setRefreshState] = useState<boolean>(false);

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

  const notificationItemResolver = (notificationDocument: NotificationDocument) => {
    switch (notificationDocument.payload?.action) {
      case NotificationTypes.FixClientRequest:
      case NotificationTypes.FixCraftsmanResponse:
        const isFixClientRequest = notificationDocument.payload.action === NotificationTypes.FixClientRequest;
        const fix = notificationDocument.payload.systemPayload as FixesModel;
        const firstName = isFixClientRequest ? fix?.createdByClient?.firstName : fix?.assignedToCraftsman?.firstName;
        const lastName = isFixClientRequest ? fix?.createdByClient?.lastName : fix?.assignedToCraftsman?.lastName;
        return {
          title: notificationDocument.message,
          subtitle: `${firstName} ${lastName}`,
          date: new Date(notificationDocument.createdTimestampUtc * 1000).toLocaleDateString('en-US'),
        };
      case NotificationTypes.NewMessage:
        return {
          title: notificationDocument?.title,
          subtitle: notificationDocument?.message,
          date: new Date(notificationDocument.createdTimestampUtc * 1000).toLocaleDateString('en-US'),
        };
      case NotificationTypes.NewConversation:
        return {
          title: notificationDocument?.title,
          subtitle: notificationDocument?.message,
          date: new Date(notificationDocument.createdTimestampUtc * 1000).toLocaleDateString('en-US'),
        };
      case NotificationTypes.FixAccepted:
        return {
          title: notificationDocument?.title,
          subtitle: notificationDocument?.message,
          date: new Date(notificationDocument.createdTimestampUtc * 1000).toLocaleDateString('en-US'),
        };
      default:
        break;
    }
  };

  const renderItem = ({ item }: { item: NotificationDocument }): JSX.Element => {
    const itemInfo = notificationItemResolver(item);
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
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{itemInfo?.title?.trimEllip(35)}</Text>
          <Text style={{ fontSize: 12, color: 'grey' }}>{itemInfo?.subtitle}</Text>
          <Text style={{ fontSize: 12, color: 'grey' }}>{itemInfo?.date}</Text>
          <Divider style={{ marginTop: 15 }} orientation="horizontal" />
        </TouchableOpacity>
        <Button
          onPress={() => {
            OnPressNotificationEllipsis(item.id);
          }}
          color="white">
          <Icon library="FontAwesome5" name="ellipsis-h" color={'dark'} size={15} />
        </Button>
      </View>
    );
  };

  const OnPressNotificationEllipsis = async (notificationId: string) => {
    showActionSheetWithOptions(
      {
        options: ['Remove Notification', 'Cancel'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 1,
        userInterfaceStyle: 'dark',
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          await notificationService.deleteNotificationsByIds(user.userId as string, [notificationId]);
          onRefresh();
        } else if (buttonIndex === 1) {
          // Do nothing
        } else if (buttonIndex === 2) {
          // Do nothing
        }
      },
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
      </View>
    );
  };
  return render();
};

export default NotificationsScreen;

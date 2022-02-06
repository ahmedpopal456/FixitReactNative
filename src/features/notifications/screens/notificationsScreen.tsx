import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Button, Icon } from 'fixit-common-ui';
import {
  persistentActions,
  NotificationModel,
  StoreState,
  store,
  useSelector,
  notificationActions,
  FixesModel,
} from 'fixit-common-data-store';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import NotificationTypes from '../models/notificationTypes';
import { ReceivedNotification } from 'react-native-push-notification';

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

const NotificationsScreen: FunctionComponent<NotificationsScreenWithNavigationProps> = (props) => {
  const notifications = useSelector((storeState: StoreState) => storeState.persist.notifications);
  const unseenNotificationsNumber = useSelector(
    (storeState: StoreState) => storeState.persist.unseenNotificationsNumber,
  );
  const onPressNotification = (item: any) => {
    const currentNotifications: Array<NotificationModel> = [...notifications];

    const index = currentNotifications.findIndex(
      (currentNotification) => currentNotification.remoteMessage.id === item.remoteMessage.id,
    );
    if (!item.visited) {
      currentNotifications[index] = {
        remoteMessage: currentNotifications[index].remoteMessage,
        fix: currentNotifications[index].fix,
        visited: true,
      };

      store.dispatch(persistentActions.default.setNotifications(currentNotifications, unseenNotificationsNumber - 1));
    }

    const action = item?.data?.action;
    if (action === NotificationTypes.NEW_CONVERSATION || action === NotificationTypes.NEW_MESSAGE) {
      props.navigation.navigate('Chat');
    } else {
      props.navigation.navigate('Home');
    }
    if (item.remoteMessage && item.remoteMessage.id && item.remoteMessage.title) {
      store.dispatch(notificationActions.displayNotification({ messages: [item.remoteMessage] }));
    }
  };

  const renderItem = ({ item }: { item: NotificationModel }): JSX.Element => {
    const isFixClientRequest = item.remoteMessage?.data?.action === 'FixClientRequest';
    const firstName = isFixClientRequest
      ? item.fix?.createdByClient?.firstName
      : item.fix.assignedToCraftsman.firstName;
    const lastName = isFixClientRequest ? item.fix?.createdByClient?.lastName : item.fix.assignedToCraftsman.lastName;
    return (
      <TouchableOpacity
        onPress={() => {
          onPressNotification(item);
        }}
        style={styles.notificationItem}>
        <View style={[styles.image, { marginRight: 10 }]}>
          <Avatar
            size={50}
            rounded
            title={`${firstName?.charAt(0)}${lastName?.charAt(0)}`}
            titleStyle={{ color: 'black' }}
            activeOpacity={0.7}
            avatarStyle={{ resizeMode: 'cover', backgroundColor: '#EEEEEE', opacity: 0.75 }}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={item.visited ? styles.seenNotif : styles.unseenNotif}>{`${firstName} ${lastName}`}</Text>
          <Text>{item.fix.details?.category}</Text>
        </View>
      </TouchableOpacity>
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
          {!notifications || notifications.length === 0 ? (
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
              data={notifications}
              renderItem={renderItem}
              keyExtractor={(item: NotificationModel) => item.remoteMessage.id as string}
            />
          )}
        </View>
      </View>
    );
  };

  return render();
};

export default NotificationsScreen;

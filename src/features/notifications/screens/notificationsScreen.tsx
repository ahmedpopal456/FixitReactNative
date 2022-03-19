import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Button, Icon } from 'fixit-common-ui';
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
import { Avatar } from 'react-native-elements';
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

  //TODO: Add paging to screen
  const pageSize = 100000;
  const [, setRefreshState] = useState<boolean>(false);

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
          <Text
            style={
              item.status === NotificationStatus.READ ? styles.seenNotif : styles.unseenNotif
            }>{`${firstName} ${lastName}`}</Text>
          <Text>{fix?.details?.category}</Text>
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

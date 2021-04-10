import React from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, Dimensions, FlatList, Image,
} from 'react-native';
import { Button, Icon } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  persistentStore, persistentActions, PersistentState, connect, NotificationModel,
} from 'fixit-common-data-store';
import { Rating } from 'react-native-ratings';
import NotificationActions from '../models/notifications/notificationActionsEnum';
import notificationHandler from '../handlers/notificationHandler';
import defaultProfilePic from '../assets/defaultProfileIcon.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height - 95,
    width: '100%',
    backgroundColor: '#FFD14A',
  },
  bodyContainer: {
    flex: 1,
    padding: 10,
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
    paddingLeft: 10,
    paddingBottom: 10,
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
    backgroundColor: 'red',
  },
});

class NotificationsScreen extends React.Component
<any> {
  onPressNotification = (item: any) => {
    const notifications: NotificationModel[] = [...this.props.notifications];
    const index = notifications.findIndex((el) => el.messageId === item.messageId);
    if (!item.visited) {
      notifications[index] = { ...notifications[index], visited: true };

      persistentStore.dispatch(persistentActions.default.setNotificationList(
        { notifications }, this.props.unseenNotificationsNumber - 1,
      ));
    }
    var action = item?.data?.action;
    if (action == 'NewMessage' || action == 'NewConversation') {
      this.props.navigation.navigate('Chat');
    } else {
      this.props.navigation.navigate('Home');
    }
    notificationHandler.getInstance().displayNotification(item);
  };

  renderItem = ({ item }: any) : JSX.Element => (
    <TouchableOpacity
      onPress={() => { this.onPressNotification(item); }}
      style={styles.notificationItem}
    >
      <View style={[styles.image, { marginRight: 10 }]}>
        <Image source={defaultProfilePic} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={item.visited ? styles.seenNotif : styles.unseenNotif}>
          {item.notification.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Button onPress={() => this.props.navigation.goBack()} color='accent'>
          <Icon library='AntDesign' name='back' />
        </Button>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.bodyContainer}>
          {this.props.notifications.length === 0
            ? <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
              <Text>You have no notification</Text>
            </View>
            : <FlatList
              data={this.props.notifications}
              renderItem={this.renderItem}
              keyExtractor={(item: any) => item.messageId}
            />
          }
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: PersistentState) {
  return {
    notifications: state.notificationList.notifications,
    unseenNotificationsNumber: state.unseenNotificationsNumber,
  };
}

export default connect(mapStateToProps)(NotificationsScreen);

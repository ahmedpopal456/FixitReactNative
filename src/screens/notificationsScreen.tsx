import React from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, Dimensions, FlatList,
} from 'react-native';
import { Button, Icon } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  persistentStore, persistentActions, PersistentState, connect, NotificationModel,
} from 'fixit-common-data-store';
import NotificationActions from '../models/notifications/notificationActionsEnum';

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
    fontWeight: 'normal',
  },
  unseenNotif: {
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
  onPressNotification = (item: {
    visited: boolean; messageId: number; requestSummary: { Action: number; };
  }) => {
    const notifications: NotificationModel[] = [...this.props.notifications];
    const index = notifications.findIndex((el) => el.messageId === item.messageId);
    if (!item.visited) {
      notifications[index] = { ...notifications[index], visited: true };

      persistentStore.dispatch(persistentActions.default.setNotificationList(
        { notifications }, this.props.unseenNotificationsNumber - 1,
      ));
    }

    // TODO: Navigate to proper screens
    switch (item.requestSummary.Action) {
      case NotificationActions.FIX_CLIENT_REQUEST: {
        return this.props.navigation.navigate('Test1', notifications[index]);
      }
      case NotificationActions.FIX_CRAFTSMAN_RESPONSE: {
        return this.props.navigation.navigate('Test2', notifications[index]);
      }
      case NotificationActions.FIX_PLAN_UPDATE: {
        return this.props.navigation.navigate('Test3', notifications[index]);
      }
      case NotificationActions.FIX_PROGRESS_UPDATE:
        return null;
      case NotificationActions.MESSAGE_ENTRY:
        return null;
      case NotificationActions.RATING_UPDATE:
        return null;
      default:
        return null;
    }
  };

  renderItem = ({ item }: any) : JSX.Element => (
    <TouchableOpacity
      onPress={() => { this.onPressNotification(item); }}
      style={styles.notificationItem}
    >
      <View style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={item.visited ? styles.seenNotif : styles.unseenNotif}>
          {item.notification.title}
        </Text>
        <Text style={{ color: 'gray' }}>
          {item.body}
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
          <FlatList
            data={this.props.notifications}
            renderItem={this.renderItem}
            keyExtractor={(item: any) => item.messageId}
          />
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

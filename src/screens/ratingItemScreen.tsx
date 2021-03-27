import React from 'react';
import {
  Text, View, StyleSheet, SafeAreaView, Dimensions,
} from 'react-native';
import { Button, Icon, NotificationBell } from 'fixit-common-ui';
import { connect, PersistentState } from 'fixit-common-data-store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height - 95,
    width: '100%',
    backgroundColor: '#FFD14A',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bodyContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoContainer: {
    padding: 5,
    flexDirection: 'row',
  },
  ratingContainer: {
    flex: 1,
    padding: 5,
  },
  title: {
    paddingLeft: 10,
    paddingBottom: 10,
    fontSize: 20,
  },
  textName: {
    fontWeight: 'bold',
  },
  image: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    backgroundColor: 'red',
  },
});

const RatingItemScreen = (props: {
  navigation: {
    goBack: () => void;
    navigate: (arg0: string) => void;
  },
  route: {
    params: {
      firstName: string;
      lastName: string;
      score: number;
      comment: string;
    };
  },
  unseenNotificationsNumber: number,
}): JSX.Element => (
  <SafeAreaView style={styles.container}>
    <View style={styles.topContainer}>
      <Button onPress={() => props.navigation.goBack()} color='transparent'>
        <Icon library='AntDesign' name='back' size={30} />
      </Button>
      <NotificationBell
        notifications={props.unseenNotificationsNumber}
        onPress={() => props.navigation.navigate('Notifications')}
      />
    </View>
    <Text style={styles.title}>Your Ratings</Text>
    <View style={styles.bodyContainer}>
      <View style={styles.infoContainer}>
        <View style={styles.image} />
        <View style={styles.ratingContainer}>
          <Text style={styles.textName}>
            {props.route.params.firstName} {props.route.params.lastName}
          </Text>
          <Text>{props.route.params.score}</Text>
          <Text>{props.route.params.comment}</Text>
        </View>
      </View>
    </View>
  </SafeAreaView>
);

function mapStateToProps(state: PersistentState) {
  return {
    userId: state.user.userId,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    unseenNotificationsNumber: state.unseenNotificationsNumber,
  };
}

export default connect(mapStateToProps)(RatingItemScreen);

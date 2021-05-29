import React from 'react';
import {
  Text, View, StyleSheet, SafeAreaView, Dimensions, Image,
} from 'react-native';
import { Button, Icon, NotificationBell } from 'fixit-common-ui';
import { connect, PersistentState } from 'fixit-common-data-store';
import { Rating } from 'react-native-ratings';
import defaultProfilePic from '../../../common/assets/defaultProfileIcon.png';

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
    flexDirection: 'column',
  },
  ratingContainer: {
    padding: 5,
  },
  title: {
    paddingLeft: 10,
    paddingBottom: 10,
    fontSize: 20,
  },
  textName: {
    fontSize: 16,
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.image, { marginRight: 10 }]}>
            <Image source={defaultProfilePic} style={styles.image} />
          </View>
          <Text style={styles.textName}>
            {props.route.params.firstName} {props.route.params.lastName}
          </Text>
        </View>
        <View testID='ratingItemDetails' style={styles.ratingContainer}>
          <Rating
            style={{ alignSelf: 'flex-start', marginVertical: 5, marginLeft: -5 }}
            type='custom'
            ratingColor={'#FFD14A'}
            ratingBackgroundColor={'gray'}
            tintColor={'white'}
            readonly={true}
            startingValue={props.route.params.score}
            ratingCount={5}
            imageSize={20}
          />
          <Text style={{ marginVertical: 10 }}>{props.route.params.comment}</Text>
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

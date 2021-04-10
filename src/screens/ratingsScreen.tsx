import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Button, Icon, NotificationBell } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  store, RatingsService, ConfigFactory, connect, PersistentState,
} from 'fixit-common-data-store';
import { RatingsOfUserModel } from 'fixit-common-data-store/src/models/ratings/ratingsModel';
import { Rating } from 'react-native-ratings';
import defaultProfilePic from '../assets/defaultProfileIcon.png';

const ratingsService = new RatingsService(new ConfigFactory(), store);

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
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  title: {
    paddingLeft: 10,
    paddingBottom: 10,
    fontSize: 20,
  },
  infoContainer: {
    padding: 10,
  },
  ratingItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  textContainer: {
    width: '80%',
  },
  textName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 30 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

class RatingsScreen extends React.Component
<any, {
  ratingsId: string;
  averageRating: number;
  ratings: [];
  ratingsOfUser: RatingsOfUserModel,
}> {
  constructor(props: any) {
    super(props);
    this.state = {
      ratingsId: store.getState().ratings.ratingsId,
      averageRating: store.getState().ratings.averageRating,
      ratings: store.getState().ratings.ratings,
      ratingsOfUser: store.getState().ratings.ratingsOfUser,
    };
  }

  async componentDidMount() : Promise<void> {
    const response = await ratingsService.getUserRatingsAverage(
      this.props.userId,
    );
    this.setState({
      ratingsId: response.ratings.id,
      averageRating: response.ratings.averageRating,
      ratings: response.ratings.ratings,
      ratingsOfUser: response.ratings.ratingsOfUser,
    });
  }

  renderItem = ({ item } : any) : JSX.Element => (
    <TouchableOpacity
      onPress={() => this.props.navigation.navigate('RatingItem', {
        firstName: item.reviewedByUser.firstName,
        lastName: item.reviewedByUser.lastName,
        score: item.score,
        comment: item.comment,
      })}
      style={styles.ratingItem}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={[styles.image, { marginRight: 10 }]}>
          <Image source={defaultProfilePic} style={styles.image} />
        </View>
        <Text style={styles.textName}>
          {item.reviewedByUser.firstName} {item.reviewedByUser.lastName}
        </Text>
      </View>
      <Rating
        style={{ alignSelf: 'flex-start', marginVertical: 5, marginLeft: -5 }}
        type='custom'
        ratingColor={'#FFD14A'}
        ratingBackgroundColor={'gray'}
        tintColor={'white'}
        readonly={true}
        startingValue={this.state.averageRating}
        ratingCount={5}
        imageSize={20}
      />
      <Text style={{ fontWeight: 'bold', marginVertical: 5 }}>
        {new Date(item.createdTimestampUtc * 1000).toLocaleDateString()}
      </Text>
      <Text numberOfLines={2} style={{ marginVertical: 5 }}>{item.comment}</Text>
    </TouchableOpacity>
  );

  render() : JSX.Element {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topContainer}>
          <Button onPress={() => this.props.navigation.goBack()} color='transparent'>
            <Icon library='AntDesign' name='back' size={30} />
          </Button>
          <NotificationBell
            notifications={this.props.unseenNotificationsNumber}
            onPress={() => this.props.navigation.navigate('Notifications')}
          />
        </View>
        <Text style={styles.title}>Your Ratings</Text>
        <View style={styles.bodyContainer}>
          {this.state.ratings && this.state.ratings.length > 0 ? (
            <FlatList
              style={{ width: '100%' }}
              data={this.state.ratings}
              renderItem={this.renderItem}
              keyExtractor={(item : any) => item.id}
            />
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: PersistentState) {
  return {
    userId: state.user.userId,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    unseenNotificationsNumber: state.unseenNotificationsNumber,
  };
}

export default connect(mapStateToProps)(RatingsScreen);

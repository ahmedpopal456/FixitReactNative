import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Button, Icon, NotificationBell } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  store, RatingsService, ConfigFactory, connect, PersistentState,
} from 'fixit-common-data-store';
import { RatingsOfUserModel } from 'fixit-common-data-store/src/models/ratings/ratingsModel';

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
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  textContainer: {
    width: '80%',
  },
  textName: {
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

  // TODO: Get userId from the store
  //       Replace userId string with : this.props.userId
  async componentDidMount() : Promise<void> {
    const response = await ratingsService.getUserRatingsAverage(
      '858e2783-b80b-48e6-b895-3c88bf0808a9',
    );
    this.setState({
      ratingsId: response.ratings.id,
      averageRating: response.ratings.averageRating,
      ratings: response.ratings,
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
      <View style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.textName}>
          {item.reviewedByUser.firstName} {item.reviewedByUser.lastName}
        </Text>
        <Text>{item.score}</Text>
        <Text numberOfLines={2}>{item.comment}</Text>
      </View>
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

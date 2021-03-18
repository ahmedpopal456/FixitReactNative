import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Button, Icon } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store, RatingsService, ConfigFactory } from 'fixit-common-data-store';

const ratingsService = new RatingsService(new ConfigFactory());

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

export default class RatingsScreen extends React.Component
<unknown, {
  ratingsId: string;
  averageRating: number;
  ratings: [];
  ratingsOfUser: Record<string, unknown> }
> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      ratingsId: store.getState().ratings.ratings.ratingsId,
      averageRating: store.getState().ratings.ratings.averageRating,
      ratings: store.getState().ratings.ratings.ratings,
      ratingsOfUser: store.getState().ratings.ratings.ratingsOfUser,
    };
  }

  // TODO: Get userId from the store
  async componentDidMount() {
    const response = await ratingsService.getUserRatingsAverage(
      '858e2783-b80b-48e6-b895-3c88bf0808a9',
    );
    this.setState({
      ratingsId: response.ratings.id,
      averageRating: response.ratings.averageRating,
      ratings: response.ratings.ratings,
      ratingsOfUser: response.ratings.ratingsOfUser,
    });
  }

  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => this.props.navigation.navigate('RatingItem', {
        firstName: item.reviewedByUser.firstName,
        lastName: item.reviewedByUser.lastName,
        score: item.score,
        comment: item.comment,
      })
      }
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

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Button onPress={() => this.props.navigation.goBack()} color="accent">
          <Icon library="AntDesign" name="back" size={30} />
        </Button>
        <Text style={styles.title}>Your Ratings</Text>
        <View style={styles.bodyContainer}>
          {this.state.ratings && this.state.ratings.length > 0 ? (
            <FlatList
              data={this.state.ratings}
              renderItem={this.renderItem}
              keyExtractor={(item) => item.id}
            />
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
}

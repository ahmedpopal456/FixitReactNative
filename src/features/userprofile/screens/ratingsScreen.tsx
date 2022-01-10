import React, { FunctionComponent } from 'react';
import { Text, View, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store, RatingsService, ConfigFactory, StoreState, useSelector } from 'fixit-common-data-store';
import { Rating } from 'react-native-ratings';
import useAsyncEffect from 'use-async-effect';
import { Avatar } from 'react-native-elements';

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
    alignItems: 'center',
    justifyContent: 'flex-start',
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

const RatingsScreen: FunctionComponent<any> = (props) => {
  const user = useSelector((storeState: StoreState) => storeState.user);
  const ratings = useSelector((storeState: StoreState) => storeState.ratings);

  useAsyncEffect(async () => {
    try {
      await ratingsService.getUserRatingsAverage(user.userId as string);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const renderItem = ({ item }: any): JSX.Element => (
    <TouchableOpacity
      onPress={() =>
        props.navigation.navigate('RatingItem', {
          firstName: item.reviewedByUser.firstName,
          lastName: item.reviewedByUser.lastName,
          score: item.score,
          comment: item.comment,
        })
      }
      testID="ratingItem"
      style={styles.ratingItem}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Avatar size="small" rounded icon={{ name: 'user', color: '#FFD14A', type: 'font-awesome' }} />
        <Text style={styles.textName}>
          {item.reviewedByUser.firstName} {item.reviewedByUser.lastName}
        </Text>
      </View>
      <Rating
        style={{ alignSelf: 'flex-start', marginVertical: 5, marginLeft: -5 }}
        type="custom"
        ratingColor={'#FFD14A'}
        ratingBackgroundColor={'gray'}
        tintColor={'white'}
        readonly={true}
        startingValue={ratings?.averageRating}
        ratingCount={5}
        imageSize={20}
      />
      <Text style={{ fontStyle: 'italic', marginVertical: 5 }}>
        Reviewed on {new Date(item.createdTimestampUtc * 1000).toLocaleDateString()}
      </Text>
      <Text numberOfLines={2} style={{ marginVertical: 5 }}>
        {item.comment}
      </Text>
    </TouchableOpacity>
  );

  const render = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <Button onPress={() => props.navigation.goBack()} color="transparent">
          <Icon library="AntDesign" name="back" size={30} />
        </Button>
        <Text style={styles.title}>Ratings</Text>
      </View>
      <View style={styles.bodyContainer}>
        {ratings?.ratings && ratings?.ratings.length > 0 ? (
          <FlatList
            style={{ width: '100%' }}
            data={ratings?.ratings}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );

  return render();
};

export default RatingsScreen;

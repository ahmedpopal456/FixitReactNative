import React, { FunctionComponent, useState } from 'react';
import { Text, View, StyleSheet, Dimensions, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Button, colors, Icon } from 'fixit-common-ui';
import { store, RatingsService, StoreState, useSelector } from '../../../store';
import { Rating } from 'react-native-ratings';
import useAsyncEffect from 'use-async-effect';
import { Avatar } from 'react-native-elements';
import config from '../../../core/config/appConfig';
import { ScrollView } from 'react-native-gesture-handler';

const ratingsService = new RatingsService(config, store);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
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
    flexGrow: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 20,
    alignSelf: 'center',
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
  const [refreshState, setRefreshState] = useState<boolean>(false);

  useAsyncEffect(async () => {
    onRefresh();
  }, []);

  const onRefresh = async () => {
    setRefreshState(true);
    try {
      await ratingsService.getUserRatingsAverage(user.userId as string);
    } catch (e) {
      console.log(e);
    }
    setRefreshState(false);
  };

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
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={() => props.navigation.goBack()} color="transparent">
          <Icon library="AntDesign" name="back" size={30} />
        </Button>
        <Text style={styles.title}>Ratings</Text>
      </View>
      <ScrollView
        style={styles.bodyContainer}
        refreshControl={
          <RefreshControl refreshing={refreshState} onRefresh={onRefresh} size={1} colors={[colors.orange]} />
        }>
        {ratings?.ratings && ratings?.ratings.length > 0 ? (
          <FlatList
            style={{ width: '100%' }}
            data={ratings?.ratings}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id}
          />
        ) : null}
      </ScrollView>
    </View>
  );

  return render();
};

export default RatingsScreen;

import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { Rating } from 'react-native-ratings';
import { Avatar } from 'react-native-elements';
import { Button, Icon } from 'fixit-common-ui';

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
  };
  route: {
    params: {
      firstName: string;
      lastName: string;
      score: number;
      comment: string;
    };
  };
  unseenNotificationsNumber: number;
}): JSX.Element => (
  <SafeAreaView style={styles.container}>
    <View style={styles.topContainer}>
      <Button onPress={() => props.navigation.goBack()} color="transparent">
        <Icon library="AntDesign" name="back" size={30} />
      </Button>
    </View>
    <View style={styles.bodyContainer}>
      <View style={styles.infoContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar size="small" rounded icon={{ name: 'user', color: '#FFD14A', type: 'font-awesome' }} />
          <Text style={styles.textName}>
            {props.route.params.firstName} {props.route.params.lastName}
          </Text>
        </View>
        <View testID="ratingItemDetails" style={styles.ratingContainer}>
          <Rating
            style={{ alignSelf: 'flex-start', marginVertical: 5, marginLeft: -5 }}
            type="custom"
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

export default RatingItemScreen;

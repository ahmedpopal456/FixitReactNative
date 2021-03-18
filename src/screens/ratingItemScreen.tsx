import React from 'react';
import {
  Text, View, StyleSheet, SafeAreaView, Dimensions,
} from 'react-native';
import { Button, Icon } from 'fixit-common-ui';

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
  navigation: { goBack: () => void; };
  route: {
    params: {
      firstName: React.ReactNode;
      lastName: React.ReactNode;
      score: React.ReactNode;
      comment: React.ReactNode;
    };
  };
}) : JSX.Element => (
  <SafeAreaView style={styles.container}>
    <Button onPress={() => props.navigation.goBack()} color='accent'>
      <Icon library='AntDesign' name='back' size={30} />
    </Button>
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

export default RatingItemScreen;

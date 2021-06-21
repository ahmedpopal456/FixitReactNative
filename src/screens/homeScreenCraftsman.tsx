/* eslint-disable no-nested-ternary */
import React, {
  useEffect, useState, FunctionComponent, lazy, Suspense,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text, View, StyleSheet, Dimensions, TouchableOpacity, ImageBackground,
} from 'react-native';
import { DonutChart, Tag } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  store, FixesService, ConfigFactory, StoreState, RatingsService, useSelector,
} from 'fixit-common-data-store';
import axios from 'axios';
import useAsyncEffect from 'use-async-effect';
import { ScrollView } from 'react-native-gesture-handler';
import SwipeableFlatList from '../components/listViews/swipeableFlatList';
import bgImage from '../common/assets/background-right.png';
import Calendar from '../components/calendar/calendar';
import image from '../common/assets/bedroom.jpg';
import SplashScreen from './splashScreen';

const fixesService = new FixesService(new ConfigFactory(), store);
const ratingsService = new RatingsService(new ConfigFactory(), store);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFD14A',
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: 'white',
    flexGrow: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  fixContainer: {
    flexDirection: 'row',
    width: Dimensions.get('window').width - 35,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 5,
    marginRight: 5,
    marginBottom: 7,
    elevation: 3,
  },
  detail: {
    backgroundColor: '#1D1F2A',
    paddingHorizontal: 5,
    borderWidth: 1,
    height: 30,
    width: 100,
    borderRadius: 4,
    marginTop: 5,
  },
  loadingMessage: {
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 90,
  },
});

interface HomeScreenClientState {
  fixSelected: boolean,
  showPending: boolean,
  showProgress: boolean,
  showReview: boolean,
  showCompleted: boolean,
  showTerminated: boolean,
  suggestedTags: any,
  isLoading: boolean
}

const initialState : HomeScreenClientState = {
  fixSelected: true,
  showPending: true,
  showProgress: true,
  showReview: true,
  showCompleted: true,
  showTerminated: true,
  suggestedTags: [''],
  isLoading: true,
};

const HomeScreenCraftsman: FunctionComponent = () => {
  const navigation = useNavigation();

  const [state, setState] = useState<HomeScreenClientState>(initialState);

  const newFixes = useSelector((storeState: StoreState) => storeState.fixes.newFixesState);
  const pendingFixes = useSelector((storeState: StoreState) => storeState.fixes.pendingFixesState);

  const user = useSelector((storeState:StoreState) => storeState.user);

  useAsyncEffect(async () => {
    await fixesService.getNewFixes(user.userId);
    await fixesService.getPendingFixes(user.userId);
    await ratingsService.getUserRatingsAverage(user.userId);

    const suggestedTags = [''];
    axios
      .get('https://fixit-dev-fms-api.azurewebsites.net/api/tags/5')
      .then((res) => {
        let i;
        for (i = 0; i < res.data.length; i += 1) {
          suggestedTags.push(res.data[i].name);
        }
        if (i > -1) {
          suggestedTags.splice(0, 1);
        }
        setState((prevState : HomeScreenClientState) => ({
          ...prevState,
          suggestedTags,
        }));
      });
  }, []);

  const renderPendingFixItems = ({ item }: any): JSX.Element => (
    <View style={styles.fixContainer}>
      <View style={{ padding: 10 }}>
        <DonutChart
          value={75}
          radius={50}
          strokeWidth={7}
          color='yellow'
          textColor='dark'
        />
      </View>
      <View style={{ width: 200, paddingVertical: 5, margin: 7 }}>
        <Text style={{ fontWeight: 'bold' }}>{item.details.name}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Text
            style={{ color: '#8B8B8B' }}>
              Started {new Date(item.schedule[0].startTimestampUtc * 1000).toDateString()} for
          </Text>
          <Text
            style={{ color: '#8B8B8B', textDecorationLine: 'underline' }}>
            {item.createdByClient.firstName} {item.createdByClient.lastName}
          </Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Fixes', {
          screen: 'FixOverview',
          params: { fix: item },
        })}>
          <View style={styles.detail}>
            <Text style={{ color: '#FFD14A', alignSelf: 'center', marginTop: 3 }}>See Details</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFixRequestItems = ({ item }: any): JSX.Element => (
    <View style={styles.fixContainer}>
      <View>
        <ImageBackground
          source={image}
          imageStyle={{
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}
          style={{
            width: 120,
            height: 141,
            justifyContent: 'flex-start',
          }}
        />
      </View>
      <View style={{ width: 200, paddingVertical: 5, margin: 7 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{item.details.name}</Text>
        <Text >
          {new Date(item.schedule[0].startTimestampUtc * 1000).toDateString()}
           - {new Date(item.schedule[0].endTimestampUtc * 1000).toDateString()}
        </Text>
        <Text
          style={{ color: '#8B8B8B', textDecorationLine: 'underline' }}>
          {item.createdByClient.firstName} {item.createdByClient.lastName}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Fixes', {
          screen: 'FixOverview',
          params: { fix: item },
        })}>
          <View style={styles.detail}>
            <Text style={{ color: '#FFD14A', alignSelf: 'center', marginTop: 3 }}>See Details</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>);

  const render = () : JSX.Element => {
    const renderFallback = pendingFixes.isLoading || newFixes.isLoading;
    const isFixesToShowEmpty = pendingFixes.fixes.length <= 0 && newFixes.fixes.length <= 0;

    const showPendingFixes = (pendingFixes.fixes.length > 0
      ? <SwipeableFlatList
        title={'Your Pending Requests'}
        navigationProps ={{ title: 'Fixes', navigation }}
        data={pendingFixes.fixes}
        renderItem={renderPendingFixItems}>
      </SwipeableFlatList> : null);

    const showNewFixes = (newFixes.fixes.length > 0
      ? <SwipeableFlatList
        title={'Your On-Going Fix Requests'}
        navigationProps ={{ title: 'Fixes', navigation }}
        data={newFixes.fixes}
        renderItem={renderFixRequestItems}>
      </SwipeableFlatList> : null);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.bodyContainer}>
          <ImageBackground
            source={bgImage}
            imageStyle={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
            style={{
              width: '100%',
              height: '100%',
              flex: 1,
              flexGrow: 100,
            }}
          >
            <ScrollView>
              {renderFallback
                ? <View style={{ height: 100 }}>
                  <SplashScreen/>
                </View> : isFixesToShowEmpty
                  ? <View style={{ height: 100 }}>
                    <Text style={styles.loadingMessage}> No fix information available...</Text>
                  </View> : [
                    showPendingFixes,
                    showNewFixes,
                  ]}
              <Text style={{ marginLeft: 15 }}>Your Availabilities</Text>
              <View style={{ margin: 15 }}>
                <Calendar
                  startDate={new Date(1617823188 * 1000)}
                  endDate={new Date(1619551189 * 1000)}
                  canUpdate={false}
                />
              </View>
              <Text style={{ marginLeft: 15, marginTop: 15 }}>Your Tags</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 15 }}>
                {state.suggestedTags.map((tag: any) => (tag ? (
                  <View
                    key={tag}
                    style={{
                      flexGrow: 0,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Tag backgroundColor={'dark'} textColor={'light'}>
                      {tag}
                    </Tag>
                  </View>
                ) : null))}
              </View>
            </ScrollView>
          </ImageBackground>
        </View>
      </SafeAreaView>);
  };
  return render();
};

export default HomeScreenCraftsman;

import React from 'react';
import {
  Text, View, StyleSheet, Dimensions, TouchableOpacity, ImageBackground,
} from 'react-native';
import { NotificationBell, DonutChart, Tag } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  store, FixesService, ConfigFactory, FixesModel, PersistentState, connect, RatingsService,
} from 'fixit-common-data-store';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { Rating } from 'react-native-ratings';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import bgImage from '../assets/background-right.png';
import image from '../assets/bedroom.jpg';
import Calendar from '../components/calendar';

const fixesService = new FixesService(new ConfigFactory(), store);
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
  pagination: {
    width: 5,
    height: 5,
    marginRight: 1,
  },
});

class HomeScreenCraftsman extends React.Component
<any, {
  fixSelected: boolean,
  showPending: boolean,
  showProgress: boolean,
  showReview: boolean,
  showCompleted: boolean,
  showTerminated: boolean,
  newFixes: Array<FixesModel>,
  pendingFixes: Array<FixesModel>,
  inProgressFixes: Array<FixesModel>,
  inReviewFixes: Array<FixesModel>,
  completedFixes: Array<FixesModel>,
  terminatedFixes: Array<FixesModel>,
  suggestedTags:any,
  averageRating:number
}> {
  constructor(props: any) {
    super(props);
    this.state = {
      fixSelected: true,
      showPending: true,
      showProgress: true,
      showReview: true,
      showCompleted: true,
      showTerminated: true,
      newFixes: store.getState().fixes.newFixes,
      pendingFixes: store.getState().fixes.pendingFixes,
      inProgressFixes: store.getState().fixes.inProgressFixes,
      inReviewFixes: store.getState().fixes.inReviewFixes,
      completedFixes: store.getState().fixes.completedFixes,
      terminatedFixes: store.getState().fixes.terminatedFixes,
      averageRating: store.getState().ratings.averageRating,
      suggestedTags: [''],
    };
  }

  async componentDidMount() {
    const newFixResponse = await fixesService.getNewFixes(this.props.userId);
    const pendingFixResponse = await fixesService.getPendingFixes(this.props.userId);
    const inProgresFixResponse = await fixesService.getInProgressFixes(this.props.userId);
    const inReviewFixResponse = await fixesService.getInReviewFixes(this.props.userId);
    const completedFixResponse = await fixesService.getCompletedFixes(this.props.userId);
    const terminatedFixResponse = await fixesService.getTerminatedFixes(this.props.userId);
    const responseRatings = await ratingsService.getUserRatingsAverage(this.props.userId);
    this.setState({
      newFixes: newFixResponse,
      pendingFixes: pendingFixResponse,
      inProgressFixes: inProgresFixResponse,
      inReviewFixes: inReviewFixResponse,
      completedFixes: completedFixResponse,
      terminatedFixes: terminatedFixResponse,
      averageRating: responseRatings.ratings.averageRating,
    });

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
        this.setState({ suggestedTags });
      });
  }

renderOngoingFixes = ({ item }: any): JSX.Element => (
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
      <Text style={{ fontWeight: 'bold' }}>{item.details[0].name}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Text style={{ color: '#8B8B8B' }}>Started {new Date(item.schedule[0].startTimestampUtc * 1000).toDateString()} for </Text>
        <Text style={{ color: '#8B8B8B', textDecorationLine: 'underline' }}>{item.createdByClient.firstName} {item.createdByClient.lastName}</Text>
      </View>

      <TouchableOpacity onPress={() => this.props.navigation.navigate('Fixes', {
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

renderFixRequests = ({ item }: any): JSX.Element => (
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
      <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{item.details[0].name}</Text>
      <Text >
        {new Date(item.schedule[0].startTimestampUtc * 1000).toDateString()}
        -
        {new Date(item.schedule[0].endTimestampUtc * 1000).toDateString()}</Text>
      <Text style={{ color: '#8B8B8B', textDecorationLine: 'underline' }}>{item.createdByClient.firstName} {item.createdByClient.lastName}</Text>
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Fixes', {
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

render() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <View style={{ flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'column' }}>
              <Text style={{
                marginTop: 15, marginLeft: 15, marginRight: 262, fontSize: 15,
              }}>Hello,</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ marginLeft: 15, fontSize: 25, fontWeight: 'bold' }}>{this.props.firstName}</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Ratings')}>
                  <Rating
                    style={{ marginLeft: 15, marginTop: 10 }}
                    type='custom'
                    ratingColor={'white'}
                    ratingBackgroundColor={'gray'}
                    tintColor={'#FFD14A'}
                    readonly={true}
                    startingValue={this.state.averageRating}
                    ratingCount={5}
                    imageSize={20}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <NotificationBell
              notifications={this.props.unseenNotificationsNumber}
              onPress={() => this.props.navigation.navigate('Notifications')}
            />
          </View>

          <View style={{ flexDirection: 'row' }}>

          </View>
        </View>
      </View>
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
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ marginTop: 15, marginLeft: 15 }}>Your Fix Requests</Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Fixes', {
                screen: 'Fixes',
              })}>
                <Text style={{ marginTop: 15, marginLeft: 195, color: 'grey' }}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginLeft: 15, marginRight: 15 }}>
              {/* body of each section */}
              <SwiperFlatList
                style={{ marginBottom: 25 }}
                showPagination
                paginationActiveColor='black'
                paginationStyleItem={styles.pagination}
                nestedScrollEnabled={true}
                data={this.state.newFixes}
                renderItem={this.renderFixRequests}
                keyExtractor={(item:any) => item.id}
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ marginTop: 15, marginLeft: 15 }}>Your Ongoing Fixes</Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Fixes', {
                screen: 'Fixes',
              })}>
                <Text style={{ marginTop: 15, marginLeft: 195, color: 'grey' }}>See All</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginLeft: 15, marginRight: 15 }}>
              {/* body of each section */}
              <SwiperFlatList
                style={{ marginBottom: 25 }}
                showPagination
                paginationActiveColor='black'
                paginationStyleItem={styles.pagination}
                nestedScrollEnabled={true}
                data={this.state.pendingFixes}
                renderItem={this.renderOngoingFixes}
                keyExtractor={(item:any) => item.id}
              />
            </View>
            <Text style={{ marginLeft: 15 }}>Your Availabilities</Text>
            <View style={{ margin: 15 }}>
              <Calendar
                startDate={new Date(1617823188 * 1000)}
                endDate = {new Date(1619551189 * 1000)}
                canUpdate={false}
              />
            </View>
            <Text style={{ marginLeft: 15, marginTop: 15 }}>Your Tags</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 15 }}>
              {this.state.suggestedTags.map((tag: any) => (tag ? (
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
    </SafeAreaView>
  );
}
}

function mapStateToProps(state: PersistentState) {
  return {
    userId: state.user.userId,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    role: state.user.role,
    unseenNotificationsNumber: state.unseenNotificationsNumber,
  };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default connect(mapStateToProps)(HomeScreenCraftsman);

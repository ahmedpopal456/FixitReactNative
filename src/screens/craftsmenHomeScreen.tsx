import React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { Button, Icon, NotificationBell, DonutChart } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store, FixesService, ConfigFactory, FixesModel, PersistentState, connect } from 'fixit-common-data-store';
import { ScrollView } from 'react-native-gesture-handler';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import bgImage from '../assets/background-right.png';
import image from '../assets/bedroom.png';
import {Rating} from 'react-native-ratings';

const fixesService = new FixesService(new ConfigFactory(), store);

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
  input: {
    height: 50,
    width: 280,
    color:'white',
    marginRight:2.5,
    padding:10,
    backgroundColor: '#1D1F2A',
    borderRadius: 5,
    borderWidth: 1,
  },
  icons:{
    backgroundColor:'#1D1F2A', 
    borderRadius:5, 
    textAlign:'center',
    textAlignVertical:'center',
    height:50, 
    width:50, 
    margin:2.5
  },
  fixContainer: {
    flexDirection: 'row',
    width: Dimensions.get('window').width-35,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 5,
    marginRight:5,
    marginBottom:7,
    elevation: 3,
  },
  detail: {
    backgroundColor: '#1D1F2A',
    paddingHorizontal: 5,
    borderWidth: 1,
    height:30,
    width:100,
    borderRadius: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 2,
  },
  subtitle: {
    color: 'gray',
  },
  pagination:{
    width:5,
    height:5,
    marginRight:1
  }
});

class CraftsmanHomeScreen extends React.Component
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
}> 

{
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
    };
  }

  async componentDidMount() {
    const newFixResponse = await fixesService.getNewFixes('8b418766-4a99-42a8-b6d7-9fe52b88ea93');
    const pendingFixResponse = await fixesService.getPendingFixes('8b418766-4a99-42a8-b6d7-9fe52b88ea93');
    const inProgresFixResponse = await fixesService.getInProgressFixes('8b418766-4a99-42a8-b6d7-9fe52b88ea93');
    const inReviewFixResponse = await fixesService.getInReviewFixes('8b418766-4a99-42a8-b6d7-9fe52b88ea93');
    const completedFixResponse = await fixesService.getCompletedFixes('8b418766-4a99-42a8-b6d7-9fe52b88ea93');
    const terminatedFixResponse = await fixesService.getTerminatedFixes('8b418766-4a99-42a8-b6d7-9fe52b88ea93');
    this.setState({
      newFixes: newFixResponse,
      pendingFixes: pendingFixResponse,
      inProgressFixes: inProgresFixResponse,
      inReviewFixes: inReviewFixResponse,
      completedFixes: completedFixResponse,
      terminatedFixes: terminatedFixResponse,
    });
  }

renderOngoingFixes = ({ item }: any): JSX.Element =>  (
    <View style={styles.fixContainer}>
      <View style={{ padding:10}}>
        <DonutChart
                  value={50}
                  radius={50}
                  strokeWidth={7}                 
                  color='yellow'
                  textColor='dark'
        />
      </View>   
      <View style={{ width: 200, paddingVertical: 5, margin:7 }}>
        <Text>
          {item.assignedToCraftsman == null
            ? 'Not assigned'
            : `${item.assignedToCraftsman.firstName} ${item.assignedToCraftsman.lastName}`
          }
        </Text>       
        <Text style={{ fontWeight: 'bold' }}>{item.details[0].name}</Text>
        <Text style={{ color: '#8B8B8B' }}>{item.details[0].category}</Text>
        <TouchableOpacity>
          <View style={styles.detail}>
            <Text style={{color: '#FFD14A', alignSelf:'center', marginTop:3}}>See Details</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

renderUpcomingFixes = ({ item }: any): JSX.Element =>  (
    <View style={styles.fixContainer}>
      <View style={{ padding:10}}>
        <ImageBackground
          source={image}
          style={{
            width:75,
            height:75,
            margin:10
          }}
        />
      </View>   
      <View style={{ width: 200, paddingVertical: 5, margin:7 }}>
        <Text>
          {item.assignedToCraftsman == null
            ? 'Not assigned'
            : `${item.assignedToCraftsman.firstName} ${item.assignedToCraftsman.lastName}`
          }
        </Text>       
        <Text style={{ fontWeight: 'bold' }}>{item.details[0].name}</Text>
        <Text style={{ color: '#8B8B8B' }}>{item.details[0].category}</Text>
        <TouchableOpacity>
          <View style={styles.detail}>
            <Text style={{color: '#FFD14A', alignSelf:'center', marginTop:3}}>See Details</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

render() {
    return (
      <SafeAreaView style={styles.container}>
      {console.log(this.state)}
      <View style={styles.topContainer}>
        <Button onPress={() => this.props.navigation.goBack()} color='transparent'>
          <Icon library='AntDesign' name='back' size={30} />
        </Button>
        <NotificationBell
          notifications={this.props.unseenNotificationsNumber}
          onPress={() => this.props.navigation.navigate('Notifications')}
        />
      </View>
      <View style={styles.bodyContainer}>
            <ImageBackground
          source={bgImage}
          imageStyle={{
            borderTopLeftRadius:20,
            borderTopRightRadius:20
          }}
          style={{
            width: '100%',
            height: '100%',
            flex:1,
            flexGrow:100,
          }}
        >
            <View style={{flexDirection: 'row'}}>
              <Text style={{marginTop:15, marginLeft: 15}}>Your rating:</Text>
              <Rating 
                style={{marginTop:15, marginLeft:15}}
                type='star'
                ratingColor={'#FFD14A'}
                readonly={true}
                ratingCount={5}
                imageSize={20}
              />
            </View>
            <Text style={{marginTop:15, marginLeft: 15}}>Your Ongoing Fixes</Text>
            <View style={{marginLeft:15, marginRight: 15}}>
                  {/* body of each section */}
                  <SwiperFlatList
                    style={{marginBottom:25}}
                    showPagination
                    paginationActiveColor='black'
                    paginationStyleItem={styles.pagination}
                    nestedScrollEnabled={true}
                    data={this.state.pendingFixes}
                    renderItem={this.renderOngoingFixes}  
                    keyExtractor={(item) => item.id}
                  />
              </View>
              <Text style={{ marginLeft: 15}}>Your Upcoming Fixes</Text>
              <View style={{marginLeft:15, marginRight: 15}}>
                  {/* body of each section */}
                  <SwiperFlatList
                    style={{marginBottom:25}}      
                    showPagination      
                    nestedScrollEnabled={true}
                    paginationStyleItem={styles.pagination}
                    paginationActiveColor='black'
                    data={this.state.newFixes}
                    renderItem={this.renderUpcomingFixes}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                  />
              </View>
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
export default connect(mapStateToProps)(CraftsmanHomeScreen);
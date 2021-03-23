import React from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, Dimensions, ScrollView, FlatList, LogBox,
} from 'react-native';
import { Button, Icon, NotificationBell } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store, FixesService, ConfigFactory } from 'fixit-common-data-store';

const fixesService = new FixesService(new ConfigFactory());

// TODO: Remove when fixed:
//       ScrollView + FlatList = Nested VirtualizedList
//       because FlatList is a ScrollView and RN doesn't like that
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
]);

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
  topCycleContainer: {
    flexDirection: 'row',
  },
  bodyContainer: {
    flex: 1,
    flexGrow: 100,
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  fixContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 5,
    paddingRight: 10,
    elevation: 3,
    // Below is for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 100 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statusBar: {
    flex: 0.2,
    height: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
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
  arrow: {
    backgroundColor: '#1D1F2A',
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default class FixesScreen extends React.Component<any, {
  fixSelected: boolean,
  showPending: boolean,
  showProgress: boolean,
  showReview: boolean,
  showCompleted: boolean,
  showTerminated: boolean,
  newFixes: [],
  pendingFixes: [],
  inProgressFixes: [],
  inReviewFixes: [],
  completedFixes: [],
  terminatedFixes: [],
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
      newFixes: store.getState().fixes.newFixes.newFixes,
      pendingFixes: store.getState().fixes.pendingFixes.pendingFixes,
      inProgressFixes: store.getState().fixes.inProgressFixes.inProgressFixes,
      inReviewFixes: store.getState().fixes.inReviewFixes.inReviewFixes,
      completedFixes: store.getState().fixes.completedFixes.completedFixes,
      terminatedFixes: store.getState().fixes.terminatedFixes.terminatedFixes,
    };
  }

  // TODO: Get userId from store
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

  getStatusColor = (status: number) => {
    switch (status) {
      case 0: // new
        return { backgroundColor: '#1D1F2A' };
      case 1: // pending
        return { backgroundColor: '#FF0000' };
      case 2: // in progress
        return { backgroundColor: '#008000' };
      case 3: // in review
        return { backgroundColor: '#003380' };
      case 4: // completed
        return { backgroundColor: '#4F0080' };
      case 5: // terminated
        return { backgroundColor: '#FF0000' };
      default: // new or other
        return { backgroundColor: '#1D1F2A' };
    }
  }

  renderFixes() {
    return (
      <ScrollView nestedScrollEnabled={true}>
        { this.state.pendingFixes && this.state.pendingFixes.length === 0
          ? null
          : <View style={{ margin: 5 }}>
            {/* Section Title */}
            <View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Pending</Text>
                <TouchableOpacity
                  onPress={() => this.setState({ showPending: !this.state.showPending })}
                >
                  {this.state.showPending
                    ? <Icon library='AntDesign' name='caretdown' />
                    : <Icon library='AntDesign' name='caretup' />
                  }
                </TouchableOpacity>
              </View>
              <Text style={styles.subtitle}>The fix plan is still in progress.</Text>
            </View>
            {this.state.showPending
              ? <View>
                {/* body of each section */}
                <FlatList
                  nestedScrollEnabled={true}
                  data={this.state.pendingFixes}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => item.id}
                />
              </View>
              : null
            }
          </View>
        }

        { this.state.inProgressFixes && this.state.inProgressFixes.length === 0
          ? null
          : <View style={{ margin: 5 }}>
            {/* Section Title */}
            <View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>In Progress</Text>
                <TouchableOpacity
                  onPress={() => this.setState({ showProgress: !this.state.showProgress })}
                >
                  {this.state.showProgress
                    ? <Icon library='AntDesign' name='caretdown' />
                    : <Icon library='AntDesign' name='caretup' />
                  }
                </TouchableOpacity>
              </View>
              <Text style={styles.subtitle}>These fixes are under way.</Text>
            </View>
            {this.state.showProgress
              ? <View style={{ justifyContent: 'center' }}>
                {/* body of each section */}
                <FlatList
                  nestedScrollEnabled={true}
                  data={this.state.inProgressFixes}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => item.id}
                />
              </View>
              : null
            }
          </View>
        }

        { this.state.inReviewFixes && this.state.inReviewFixes.length === 0
          ? null
          : <View style={{ margin: 5 }}>
            {/* Section Title */}
            <View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>In Review</Text>
                <TouchableOpacity
                  onPress={() => this.setState({ showReview: !this.state.showReview })}
                >
                  {this.state.showReview
                    ? <Icon library='AntDesign' name='caretdown' />
                    : <Icon library='AntDesign' name='caretup' />
                  }
                </TouchableOpacity>
              </View>
              <Text style={styles.subtitle}>You need to approve the completion of the fix.</Text>
            </View>
            {this.state.showReview
              ? <View>
                {/* body of each section */}
                <FlatList
                  nestedScrollEnabled={true}
                  data={this.state.inReviewFixes}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => item.id}
                />
              </View>
              : null
            }
          </View>
        }

        { this.state.completedFixes && this.state.completedFixes.length === 0
          ? null
          : <View style={{ margin: 5 }}>
            {/* Section Title */}
            <View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Completed</Text>
                <TouchableOpacity
                  onPress={() => this.setState({ showCompleted: !this.state.showCompleted })}
                >
                  {this.state.showCompleted
                    ? <Icon library='AntDesign' name='caretdown' />
                    : <Icon library='AntDesign' name='caretup' />
                  }
                </TouchableOpacity>
              </View>
            </View>
            {this.state.showCompleted
              ? <View>
                {/* body of each section */}
                <FlatList
                  nestedScrollEnabled={true}
                  data={this.state.completedFixes}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => item.id}
                />
              </View>
              : null
            }
          </View>
        }

        { this.state.terminatedFixes && this.state.terminatedFixes.length === 0
          ? null
          : <View style={{ margin: 5 }}>
            {/* Section Title */}
            <View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Terminated</Text>
                <TouchableOpacity
                  onPress={() => this.setState({ showTerminated: !this.state.showTerminated })}
                >
                  {this.state.showTerminated
                    ? <Icon library='AntDesign' name='caretdown' />
                    : <Icon library='AntDesign' name='caretup' />
                  }
                </TouchableOpacity>
              </View>
              <Text style={styles.subtitle}>Abandoned Fixes.</Text>
            </View>
            {this.state.showTerminated
              ? <View>
                {/* body of each section */}
                <FlatList
                  nestedScrollEnabled={true}
                  data={this.state.terminatedFixes}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => item.id}
                />
              </View>
              : null
            }
          </View>
        }
      </ScrollView>
    );
  }

  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => undefined} style={styles.fixContainer}>
      <View style={[styles.statusBar, this.getStatusColor(item.status)]}></View>
      <View style={{ width: 200, paddingVertical: 5 }}>
        <Text>
          {item.assignedToCraftsman == null
            ? 'Not assigned'
            : `${item.assignedToCraftsman.firstName} ${item.assignedToCraftsman.lastName}`
          }
        </Text>
        <Text style={{ fontWeight: 'bold' }}>{item.details[0].name}</Text>
        <Text style={{ color: '#8B8B8B' }}>{item.details[0].category}</Text>
      </View>
      <View style={styles.arrow}>
        <Icon library='AntDesign' name='arrowright' color='accent' />
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topContainer}>
          <Button onPress={() => this.props.navigation.goBack()} color='transparent'>
            <Icon library='AntDesign' name='back' size={30} />
          </Button>
          <NotificationBell notifications={0} onPress={() => undefined} />
        </View>
        <View style={styles.topCycleContainer}>
          <Button // fixSelected = true
            onPress={() => this.setState({ fixSelected: true })}
            width={100}
            shape='circle'
            padding={0}
            outline={!this.state.fixSelected}
          >
            <Text
              style={{
                fontSize: 20,
                color: this.state.fixSelected ? '#FFD14A' : '#1D1F2A',
              }}
            >
              Fixes
            </Text>
          </Button>
          <Button // fixSelected = false
            onPress={() => this.setState({ fixSelected: false })}
            width={150}
            shape='circle'
            padding={0}
            outline={!!this.state.fixSelected}
          >
            <Text
              style={{
                fontSize: 20,
                color: this.state.fixSelected ? '#1D1F2A' : '#FFD14A',
              }}
            >
              Fix Requests
            </Text>
          </Button>
        </View>

        <View style={styles.bodyContainer}>
          {this.state.fixSelected
            ? <View style={{ width: '100%', height: '100%' }}>
              {((this.state.pendingFixes && this.state.pendingFixes.length === 0)
                && (this.state.inProgressFixes && this.state.inProgressFixes.length === 0)
                && (this.state.inReviewFixes && this.state.inReviewFixes.length === 0)
                && (this.state.completedFixes && this.state.completedFixes.length === 0)
                && (this.state.terminatedFixes && this.state.terminatedFixes.length === 0))
                ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text>You have no on-going fixes.</Text>
                </View>
                : this.renderFixes()
              }
            </View>
            : <View style={{ width: '100%', height: '100%' }}>
              {(this.state.newFixes && this.state.newFixes.length === 0)
                ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text>You have no fix requests.</Text>
                </View>
                : <FlatList
                  nestedScrollEnabled={true}
                  data={this.state.newFixes}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => item.id}
                />
              }
            </View>
          }
        </View>
      </SafeAreaView>
    );
  }
}

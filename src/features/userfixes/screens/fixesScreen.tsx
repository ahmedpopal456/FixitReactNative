import React, { FunctionComponent, useState } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, Dimensions, ScrollView, FlatList, LogBox,
} from 'react-native';
import { Button, Icon } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  store, FixesService, ConfigFactory, connect, StoreState, FixesModel, useSelector,
} from 'fixit-common-data-store';
import useAsyncEffect from 'use-async-effect';

const fixesService = new FixesService(new ConfigFactory(), store);

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

const FixesScreen: FunctionComponent<any> = (props) => {
  const [fixSelected, setFixSelected] = useState<boolean>(true);
  const [showPending, setShowPending] = useState<boolean>(true);
  const [showProgress, setShowProgress] = useState<boolean>(true);
  const [showReview, setShowReview] = useState<boolean>(true);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [showTerminated, setShowTerminated] = useState<boolean>(true);

  const user = useSelector((storeState: StoreState) => storeState.user);
  const newFixes = useSelector((storeState: StoreState) => storeState.fixes.newFixesState);
  const pendingFixes = useSelector((storeState: StoreState) => storeState.fixes.pendingFixesState);
  const inProgressFixes = useSelector((storeState: StoreState) => storeState.fixes.inProgressFixesState);
  const inReviewFixes = useSelector((storeState: StoreState) => storeState.fixes.inReviewFixesState);
  const completedFixes = useSelector((storeState: StoreState) => storeState.fixes.completedFixesState);
  const terminatedFixes = useSelector((storeState: StoreState) => storeState.fixes.terminatedFixesState);

  useAsyncEffect(async () => {
    await fixesService.getNewFixes(user.userId as string);
    await fixesService.getPendingFixes(user.userId as string);
    await fixesService.getInProgressFixes(user.userId as string);
    await fixesService.getInReviewFixes(user.userId as string);
    await fixesService.getCompletedFixes(user.userId as string);
    await fixesService.getTerminatedFixes(user.userId as string);
  }, []);

  const getStatusColor = (status: number) => {
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
  };

  const renderFixes = () => (
    <ScrollView nestedScrollEnabled={true}>
      { !pendingFixes || !pendingFixes.fixes.length
        ? null
        : <View style={{ margin: 5 }}>
          {/* Section Title */}
          <View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Pending</Text>
              <TouchableOpacity
                onPress={() => setShowPending(!showPending)}
              >
                {showPending
                  ? <Icon library='AntDesign' name='caretdown' />
                  : <Icon library='AntDesign' name='caretup' />
                }
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>The fix plan is still in progress.</Text>
          </View>
          {showPending
            ? <View>
              {/* body of each section */}
              <FlatList
                nestedScrollEnabled={true}
                data={pendingFixes.fixes}
                renderItem={renderItem}
                keyExtractor={(item: any) => item.id}
              />
            </View>
            : null
          }
        </View>
      }

      { !inProgressFixes || !inProgressFixes.fixes.length
        ? null
        : <View style={{ margin: 5 }}>
          {/* Section Title */}
          <View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>In Progress</Text>
              <TouchableOpacity
                onPress={() => setShowProgress(!showProgress)}
              >
                {showProgress
                  ? <Icon library='AntDesign' name='caretdown' />
                  : <Icon library='AntDesign' name='caretup' />
                }
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>These fixes are under way.</Text>
          </View>
          {showProgress
            ? <View style={{ justifyContent: 'center' }}>
              {/* body of each section */}
              <FlatList
                nestedScrollEnabled={true}
                data={inProgressFixes.fixes}
                renderItem={renderItem}
                keyExtractor={(item: any) => item.id}
              />
            </View>
            : null
          }
        </View>
      }

      { !inReviewFixes || !inReviewFixes.fixes.length
        ? null
        : <View style={{ margin: 5 }}>
          {/* Section Title */}
          <View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>In Review</Text>
              <TouchableOpacity
                onPress={() => setShowReview(!showReview)}
              >
                {showReview
                  ? <Icon library='AntDesign' name='caretdown' />
                  : <Icon library='AntDesign' name='caretup' />
                }
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>You need to approve the completion of the fix.</Text>
          </View>
          {showReview
            ? <View>
              {/* body of each section */}
              <FlatList
                nestedScrollEnabled={true}
                data={inReviewFixes.fixes}
                renderItem={renderItem}
                keyExtractor={(item: any) => item.id}
              />
            </View>
            : null
          }
        </View>
      }

      { !completedFixes || !completedFixes.fixes.length
        ? null
        : <View style={{ margin: 5 }}>
          {/* Section Title */}
          <View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Completed</Text>
              <TouchableOpacity
                onPress={() => setShowCompleted(!showCompleted)}
              >
                {showCompleted
                  ? <Icon library='AntDesign' name='caretdown' />
                  : <Icon library='AntDesign' name='caretup' />
                }
              </TouchableOpacity>
            </View>
          </View>
          {showCompleted
            ? <View>
              {/* body of each section */}
              <FlatList
                nestedScrollEnabled={true}
                data={completedFixes.fixes}
                renderItem={renderItem}
                keyExtractor={(item: any) => item.id}
              />
            </View>
            : null
          }
        </View>
      }

      { !terminatedFixes || !terminatedFixes.fixes.length
        ? null
        : <View style={{ margin: 5 }}>
          {/* Section Title */}
          <View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Terminated</Text>
              <TouchableOpacity
                onPress={() => setShowTerminated(!showTerminated)}
              >
                {showTerminated
                  ? <Icon library='AntDesign' name='caretdown' />
                  : <Icon library='AntDesign' name='caretup' />
                }
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>Abandoned Fixes.</Text>
          </View>
          {showTerminated
            ? <View>
              {/* body of each section */}
              <FlatList
                nestedScrollEnabled={true}
                data={terminatedFixes.fixes}
                renderItem={renderItem}
                keyExtractor={(item: any) => item.id}
              />
            </View>
            : null
          }
        </View>
      }
    </ScrollView>
  );

  const renderItem = ({ item } : any) : JSX.Element => (
    <TouchableOpacity
      onPress={() => {
        if (item.status !== 0) { // Not Fix Request
          // TODO: Extract the navigate string into an enum, same elsewhere
          props.navigation.navigate('FixOverview', { fix: item });
        }
      }}
      style={styles.fixContainer}
    >
      <View style={[styles.statusBar, getStatusColor(item.status)]}></View>
      <View style={{ width: 200, paddingVertical: 5 }}>
        <Text>
          {item.assignedToCraftsman == null
            ? 'Not assigned'
            : `${item.assignedToCraftsman.firstName} ${item.assignedToCraftsman.lastName}`
          }
        </Text>
        <Text style={{ fontWeight: 'bold' }}>{item.details.name}</Text>
        <Text style={{ color: '#8B8B8B' }}>{item.details.category}</Text>
      </View>
      <View style={styles.arrow}>
        <Icon library='AntDesign' name='arrowright' color='accent' />
      </View>
    </TouchableOpacity>
  );

  const render = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.topCycleContainer}>
        <Button
          testID='fixesBtn'
          onPress={() => setFixSelected(true)}
          width={100}
          shape='circle'
          padding={0}
          outline={!fixSelected}
        >
          <Text
            style={{
              fontSize: 20,
              color: fixSelected ? '#FFD14A' : '#1D1F2A',
            }}
          >
              Fixes
          </Text>
        </Button>
        <Button
          testID='fixRequestsBtn'
          onPress={() => setFixSelected(false)}
          width={150}
          shape='circle'
          padding={0}
          outline={fixSelected}
        >
          <Text
            style={{
              fontSize: 20,
              color: fixSelected ? '#1D1F2A' : '#FFD14A',
            }}
          >
              Fix Requests
          </Text>
        </Button>
      </View>

      <View style={styles.bodyContainer}>
        {fixSelected
          ? <View style={{ width: '100%', height: '100%' }}>
            {((pendingFixes && pendingFixes.fixes.length === 0)
                && (inProgressFixes && inProgressFixes.fixes.length === 0)
                && (inReviewFixes && inReviewFixes.fixes.length === 0)
                && (completedFixes && completedFixes.fixes.length === 0)
                && (terminatedFixes && terminatedFixes.fixes.length === 0))
              ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>You have no on-going fixes.</Text>
              </View>
              : renderFixes()
            }
          </View>
          : <View style={{ width: '100%', height: '100%' }}>
            {(newFixes && newFixes.fixes.length === 0)
              ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>You have no fix requests.</Text>
              </View>
              : <FlatList
                nestedScrollEnabled={true}
                data={newFixes.fixes}
                renderItem={renderItem}
                keyExtractor={(item: any) => item.id}
              />
            }
          </View>
        }
      </View>
    </SafeAreaView>
  );

  return render();
};

export default FixesScreen;

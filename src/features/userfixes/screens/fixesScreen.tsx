import React, { FunctionComponent, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, LogBox, RefreshControl } from 'react-native';
import { Button, Icon, colors } from 'fixit-common-ui';
import { store, FixesService, StoreState, useSelector, FixesModel } from '../../../store';
import useAsyncEffect from 'use-async-effect';
import { useNavigation } from '@react-navigation/native';
import NavigationEnum from '../../../common/enums/navigationEnum';
import config from '../../../core/config/appConfig';

const fixesService = new FixesService(config, store);

// TODO: Remove when fixed:
//       ScrollView + FlatList = Nested VirtualizedList
//       because FlatList is a ScrollView and RN doesn't like that
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexShrink: 1,
    flexDirection: 'column',
    overflow: 'scroll',
    backgroundColor: colors.accent,
  },
  topCycleContainer: {
    flexDirection: 'row',
  },
  bodyContainer: {
    flex: 1,
    flexGrow: 1,
    padding: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  fixContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    marginVertical: 5,
    paddingRight: 10,
    elevation: 3,
    shadowColor: 'grey',
    shadowOpacity: 0.25,
  },
  statusBar: {
    flex: 0.1,
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
    color: colors.grey,
  },
  arrow: {
    backgroundColor: colors.dark,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
});

const FixesScreen: FunctionComponent<any> = () => {
  const navigation = useNavigation<any>();
  const [fixSelected, setFixSelected] = useState<boolean>(true);
  const [showPending, setShowPending] = useState<boolean>(true);
  const [showProgress, setShowProgress] = useState<boolean>(true);
  const [showReview, setShowReview] = useState<boolean>(true);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [showTerminated, setShowTerminated] = useState<boolean>(true);
  const [refreshState, setRefreshState] = useState<boolean>(false);

  const user = useSelector((storeState: StoreState) => storeState.user);
  const newFixes = useSelector((storeState: StoreState) => storeState.fixes.newFixesState);
  console.log(newFixes.fixes[0]);
  const pendingFixes = useSelector((storeState: StoreState) => storeState.fixes.pendingFixesState);
  const inProgressFixes = useSelector((storeState: StoreState) => storeState.fixes.inProgressFixesState);
  const inReviewFixes = useSelector((storeState: StoreState) => storeState.fixes.inReviewFixesState);
  const completedFixes = useSelector((storeState: StoreState) => storeState.fixes.completedFixesState);
  const terminatedFixes = useSelector((storeState: StoreState) => storeState.fixes.terminatedFixesState);
  const updatedFixState = useSelector((storeState: StoreState) => storeState.fixes.updateFixState);
  const terminatedByCraftsmanFixes = useSelector(
    (storeState: StoreState) => storeState.fixes.terminatedByCraftsmanFixesState,
  );
  const terminatedByClientFixes = useSelector(
    (storeState: StoreState) => storeState.fixes.terminatedByClientFixesState,
  );

  useAsyncEffect(async () => {
    await onRefresh();
  }, [user.userId, updatedFixState.fix]);

  const onRefresh = async () => {
    setRefreshState(true);
    if (user.userId) {
      await fixesService.getNewFixes(user.userId);
      await fixesService.getPendingFixes(user.userId);
      await fixesService.getInProgressFixes(user.userId);
      await fixesService.getInReviewFixes(user.userId);
      await fixesService.getCompletedFixes(user.userId);
      await fixesService.getTerminatedFixes(user.userId);
      await fixesService.getTerminatedByCraftsman(user.userId);
      await fixesService.getTerminatedByClient(user.userId);
    }
    setRefreshState(false);
  };

  const renderFixes = ({ item }: { item: FixesModel }): JSX.Element => {
    const getStatusColor = (status: number) => {
      switch (status) {
        case 0: // new
          return { backgroundColor: colors.yellow };
        case 1: // pending
          return { backgroundColor: colors.notification };
        case 2: // in progress
          return { backgroundColor: '#008000' };
        case 3: // in review
          return { backgroundColor: '#003380' };
        case 4: // completed
          return { backgroundColor: '#4F0080' };
        case 5: // terminated
          return { backgroundColor: colors.notification };
        case 6: // terminated by client
          return { backgroundColor: colors.light };
        case 7: // terminated by craftsman
          return { backgroundColor: colors.orange };
        default:
          // new or other
          return { backgroundColor: colors.dark };
      }
    };

    return (
      <TouchableOpacity
        onPress={() => {
          const tags: Array<string> = [];
          item.tags.forEach((tag) => {
            tags.push(tag.name);
          });

          navigation.navigate(NavigationEnum.FIX, {
            fix: item,
            title: 'Fix',
            id: 'fixes_screen',
          });
        }}
        style={styles.fixContainer}>
        <View style={[styles.statusBar, getStatusColor(item.status)]}></View>
        <View style={{ flex: 0.9, padding: 10 }}>
          {user.role === 0 ? (
            item.assignedToCraftsman ? (
              <Text>{`${item.assignedToCraftsman.firstName} ${item.assignedToCraftsman.lastName}`}</Text>
            ) : (
              <></>
            )
          ) : item.createdByClient ? (
            <Text>{`${item.createdByClient.firstName} ${item.assignedToCraftsman.lastName}`}</Text>
          ) : (
            <></>
          )}
          <Text style={{ fontWeight: 'bold' }}>{item.details.name}</Text>
          <Text style={{ color: '#7B7B7B' }}>{item.details.category}</Text>
          <Text style={{ color: '#BBBBBB' }}>
            {`${user.role === 0 ? 'Request sent on' : 'Request received on'}`}:{' '}
            {new Date(item.createdTimestampUtc * 1000).toLocaleDateString().split('T')[0]}
          </Text>
        </View>
        <View style={styles.arrow}>
          <Icon library="AntDesign" name="arrowright" color="accent" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderFixesState = () => {
    const fixStates = [];
    if (pendingFixes && pendingFixes.fixes.length) {
      fixStates.push({
        fixTitle: 'Pending',
        fixSubtitle: 'The fix plan is still in progress.',
        fixData: pendingFixes.fixes,
        setShowFix: setShowPending,
        shouldShowFix: showPending,
      });
    }

    if (inProgressFixes && inProgressFixes.fixes.length) {
      fixStates.push({
        fixTitle: 'In Progress',
        fixSubtitle: 'These fixes are under way.',
        fixData: inProgressFixes.fixes,
        setShowFix: setShowProgress,
        shouldShowFix: showProgress,
      });
    }
    if (inReviewFixes && inReviewFixes.fixes.length) {
      fixStates.push({
        fixTitle: 'In Review',
        fixSubtitle: 'You need to approve the completion of the fix.',
        fixData: inReviewFixes.fixes,
        setShowFix: setShowReview,
        shouldShowFix: showReview,
      });
    }
    if (completedFixes && completedFixes.fixes.length) {
      fixStates.push({
        fixTitle: 'Completed',
        fixSubtitle: 'All tasks are completed.',
        fixData: completedFixes.fixes,
        setShowFix: setShowCompleted,
        shouldShowFix: showCompleted,
      });
    }

    if (terminatedFixes && terminatedFixes.fixes.length) {
      fixStates.push({
        fixTitle: 'Terminated',
        fixSubtitle: 'Abandoned Fixes.',
        fixData: terminatedFixes.fixes,
        setShowFix: setShowTerminated,
        shouldShowFix: showTerminated,
      });
    }

    if (terminatedByClientFixes && terminatedByClientFixes.fixes.length) {
      fixStates.push({
        fixTitle: 'Terminated by client',
        fixSubtitle: 'Abandoned Fixes.',
        fixData: terminatedByClientFixes.fixes,
        setShowFix: setShowTerminated,
        shouldShowFix: showTerminated,
      });
    }
    if (terminatedByCraftsmanFixes && terminatedByCraftsmanFixes.fixes.length) {
      fixStates.push({
        fixTitle: 'Terminated by craftsman',
        fixSubtitle: 'Abandoned Fixes.',
        fixData: terminatedByCraftsmanFixes.fixes,
        setShowFix: setShowTerminated,
        shouldShowFix: showTerminated,
      });
    }

    return (
      <FlatList
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl refreshing={refreshState} onRefresh={onRefresh} size={1} colors={[colors.orange]} />
        }
        data={fixStates}
        renderItem={(fixState) => {
          return (
            <View key={`${fixState.item.fixTitle}_${fixState.item.fixSubtitle}`} style={{ margin: 5 }}>
              {/* Section Title */}
              <View>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{fixState.item.fixTitle}</Text>
                  <TouchableOpacity onPress={() => fixState.item.setShowFix(!fixState.item.shouldShowFix)}>
                    {fixState.item.shouldShowFix ? (
                      <Icon library="AntDesign" name="caretdown" />
                    ) : (
                      <Icon library="AntDesign" name="caretup" />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={styles.subtitle}>{fixState.item.fixSubtitle}</Text>
              </View>
              {fixState.item.shouldShowFix ? (
                <View>
                  {/* body of each section */}
                  <FlatList
                    data={fixState.item.fixData}
                    renderItem={renderFixes}
                    keyExtractor={(item: FixesModel) => item.id}
                  />
                </View>
              ) : null}
            </View>
          );
        }}
      />
    );
  };

  const render = () => (
    <View style={styles.container}>
      <View style={styles.topCycleContainer}>
        <Button
          testID="fixesBtn"
          onPress={() => setFixSelected(true)}
          width={100}
          shape="circle"
          padding={0}
          outline={!fixSelected}>
          <Text
            style={{
              fontSize: 20,
              color: fixSelected ? colors.accent : colors.dark,
            }}>
            Fixes
          </Text>
        </Button>
        <Button
          testID="fixRequestsBtn"
          onPress={() => setFixSelected(false)}
          width={150}
          shape="circle"
          padding={0}
          outline={fixSelected}>
          <Text
            style={{
              fontSize: 20,
              color: fixSelected ? colors.dark : colors.accent,
            }}>
            Fix Requests
          </Text>
        </Button>
      </View>

      <View style={styles.bodyContainer}>
        {fixSelected ? (
          <View style={{ width: '100%', height: '100%' }}>
            {pendingFixes &&
            pendingFixes.fixes.length === 0 &&
            inProgressFixes &&
            inProgressFixes.fixes.length === 0 &&
            inReviewFixes &&
            inReviewFixes.fixes.length === 0 &&
            completedFixes &&
            completedFixes.fixes.length === 0 &&
            terminatedFixes &&
            terminatedFixes.fixes.length === 0 ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>You have no on-going fixes.</Text>
              </View>
            ) : (
              renderFixesState()
            )}
          </View>
        ) : (
          <View style={{ width: '100%', height: '100%' }}>
            {newFixes && newFixes.fixes.length === 0 ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>You have no fix requests.</Text>
              </View>
            ) : (
              <FlatList
                refreshControl={
                  <RefreshControl refreshing={refreshState} onRefresh={onRefresh} size={1} colors={[colors.orange]} />
                }
                data={newFixes.fixes
                  .slice()
                  .sort((fixA, fixB) => fixB?.createdTimestampUtc - fixA?.createdTimestampUtc)}
                renderItem={renderFixes}
                keyExtractor={(item: FixesModel) => item.id}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );

  return render();
};

export default FixesScreen;

/* eslint-disable no-nested-ternary */
import React, { useState, FunctionComponent } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, ImageBackground, RefreshControl } from 'react-native';
import { colors, DonutChart, Tag } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store, FixesService, ConfigFactory, StoreState, RatingsService, useSelector } from 'fixit-common-data-store';
import useAsyncEffect from 'use-async-effect';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import SwipeableFlatList from '../../components/lists/swipeableFlatList';
import bgImage from '../../common/assets/background-right.png';
import image from '../../common/assets/bedroom.jpg';
import ProgressIndicatorFactory from '../../components/progressIndicators/progressIndicatorFactory';

const fixesService = new FixesService(new ConfigFactory(), store);
const ratingsService = new RatingsService(new ConfigFactory(), store);

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexGrow: 100,
  },
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
  fixContainerView: {
    width: 200,
    paddingVertical: 5,
    margin: 7,
  },
  fixContainerText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  fixContainerDetailsView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fixContainerFinePrints: {
    color: '#8B8B8B',
  },
  fixContainerDetailsButton: {
    color: '#FFD14A',
    alignSelf: 'center',
    marginTop: 3,
  },
  tagsContainer: {
    flexGrow: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagsContainerView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 15,
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
  spinner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 30,
  },
  loadingMessage: {
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 90,
  },
  headers: {
    marginLeft: 15,
    marginTop: 15,
  },
});

const HomeScreenCraftsman: FunctionComponent = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const [refreshState, setRefreshState] = useState<boolean>(false);

  const inProgressFixes = useSelector((storeState: StoreState) => storeState.fixes.inProgressFixesState);
  const pendingFixes = useSelector((storeState: StoreState) => storeState.fixes.pendingFixesState);
  const popularFixTags = useSelector((storeState: StoreState) => storeState.fixes.topFixTagsState);

  const user = useSelector((storeState: StoreState) => storeState.user);

  useAsyncEffect(async () => {
    await onRefresh();
  }, []);

  const onRefresh = async () => {
    setRefreshState(true);
    await fixesService.getInProgressFixes(user.userId as string);
    await fixesService.getPendingFixes(user.userId as string);
    await ratingsService.getUserRatingsAverage(user.userId as string);
    await fixesService.getPopularFixTags('5');
    setRefreshState(false);
  };

  const renderPendingFixItems = ({ item }: any): JSX.Element => (
    <View style={styles.fixContainer}>
      <View style={{ padding: 10 }}>
        <DonutChart value={75} radius={50} strokeWidth={7} color="yellow" textColor="dark" />
      </View>
      <View style={styles.fixContainerView}>
        <Text style={styles.fixContainerText}>{item.details.name}</Text>
        <View style={styles.fixContainerDetailsView}>
          <Text style={styles.fixContainerFinePrints}>
            Started {new Date(item.schedule[0].startTimestampUtc * 1000).toDateString()} for
          </Text>
          <Text style={styles.fixContainerFinePrints}>
            {item.createdByClient.firstName} {item.createdByClient.lastName}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Fixes', {
              screen: 'FixOverview',
              params: { fix: item },
            })
          }
        >
          <View style={styles.detail}>
            <Text style={styles.fixContainerDetailsButton}>See Details</Text>
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
      <View style={styles.fixContainerView}>
        <Text style={styles.fixContainerText}>{item.details.name}</Text>
        <Text>
          {new Date(item.schedule[0].startTimestampUtc * 1000).toDateString()}-{' '}
          {new Date(item.schedule[0].endTimestampUtc * 1000).toDateString()}
        </Text>
        <Text style={styles.fixContainerFinePrints}>
          {item.createdByClient.firstName} {item.createdByClient.lastName}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Fixes', {
              screen: 'FixOverview',
              params: { fix: item },
            })
          }
        >
          <View style={styles.detail}>
            <Text style={styles.fixContainerDetailsButton}>See Details</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const render = (): JSX.Element => {
    const renderFixesFallback: boolean = pendingFixes.isLoading || inProgressFixes.isLoading;
    const isFixesToShowEmpty: boolean = pendingFixes.fixes.length <= 0 && inProgressFixes.fixes.length <= 0;
    const renderTagsFallback: boolean = popularFixTags.isLoading;
    const isTagsToShowEmpty: boolean = popularFixTags.tags.length <= 0;

    const showPendingFixes =
      pendingFixes.fixes.length > 0 ? (
        <SwipeableFlatList
          title={'Pending'}
          navigationProps={{ title: 'Fixes', navigation }}
          data={pendingFixes.fixes}
          renderItem={renderPendingFixItems}
        ></SwipeableFlatList>
      ) : null;

    const showNewFixes =
      inProgressFixes.fixes.length > 0 ? (
        <SwipeableFlatList
          title={'On-Going'}
          navigationProps={{ title: 'Fixes', navigation }}
          data={inProgressFixes.fixes}
          renderItem={renderFixRequestItems}
        ></SwipeableFlatList>
      ) : null;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.bodyContainer}>
          <ImageBackground
            source={bgImage}
            imageStyle={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
            style={styles.background}
          >
            <ScrollView>
              <Text style={styles.headers}>Your Fixes</Text>
              {renderFixesFallback ? (
                <View style={styles.spinner}>
                  <ProgressIndicatorFactory
                    type="indeterminate"
                    children={{
                      indicatorType: 'circular',
                      color: colors.orange,
                    }}
                  />
                </View>
              ) : isFixesToShowEmpty ? (
                <View style={{ height: 100 }}>
                  <Text style={styles.loadingMessage}> {t('home.craftsman.fixes.notavailable')}</Text>
                </View>
              ) : (
                [showPendingFixes, showNewFixes]
              )}

              <Text style={styles.headers}>Popular Tags</Text>
              {renderTagsFallback ? (
                <View style={styles.spinner}>
                  <ProgressIndicatorFactory
                    type="indeterminate"
                    children={{
                      indicatorType: 'linear',
                      color: colors.orange,
                    }}
                  />
                </View>
              ) : isTagsToShowEmpty ? (
                <View style={{ height: 100 }}>
                  <Text style={styles.loadingMessage}> Tags Information Unavailable...</Text>
                </View>
              ) : (
                <View style={styles.tagsContainerView}>
                  {popularFixTags.tags.map((tag: any) =>
                    tag ? (
                      <View key={tag.name} style={styles.tagsContainer}>
                        <Tag backgroundColor={'dark'} textColor={'light'}>
                          {tag.name}
                        </Tag>
                      </View>
                    ) : null
                  )}
                </View>
              )}
            </ScrollView>
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  };
  return render();
};

export default HomeScreenCraftsman;

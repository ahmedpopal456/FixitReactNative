import React, { FunctionComponent } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  ImageSourcePropType,
} from 'react-native';
import { colors, DonutChart, Tag } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  store,
  FixesService,
  StoreState,
  RatingsService,
  useSelector,
  FixesModel,
  Schedule,
  TagModel,
} from '../../store';
import useAsyncEffect from 'use-async-effect';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import SwipeableFlatList from '../../components/lists/swipeableFlatList';
import bgImage from '../../common/assets/background-right.png';
import ProgressIndicatorFactory from '../../components/progressIndicators/progressIndicatorFactory';
import NavigationEnum from '../../common/enums/navigationEnum';
import config from '../../core/config/appConfig';
import { Divider } from 'react-native-elements';
import ImageModal from 'react-native-image-modal';
import FastImage from 'react-native-fast-image';

const fixesService = new FixesService(config, store);
const ratingsService = new RatingsService(config, store);

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
    height: 125,
    width: Dimensions.get('window').width - 35,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 5,
    marginRight: 5,
    marginBottom: 7,
    elevation: 3,
  },
  fixContainerView: {
    width: 300,
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

interface Item {
  item: FixesModel;
}

const HomeScreenCraftsman: FunctionComponent = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const inProgressFixes = useSelector((storeState: StoreState) => storeState.fixes.inProgressFixesState);
  const pendingFixes = useSelector((storeState: StoreState) => storeState.fixes.pendingFixesState);
  const popularFixTags = useSelector((storeState: StoreState) => storeState.fixes.topFixTagsState);
  const user = useSelector((storeState: StoreState) => storeState.user);
  const { width, height } = Dimensions.get('screen');

  useAsyncEffect(async () => {
    await onRefresh();
  }, [user.userId]);

  const onRefresh = async () => {
    if (user.userId) {
      await fixesService.getInProgressFixes(user.userId);
      await fixesService.getPendingFixes(user.userId);
      await ratingsService.getUserRatingsAverage(user.userId);
    }
    await fixesService.getPopularFixTags('5');
  };

  const renderPendingFixItems = ({ item }: Item): JSX.Element => {
    let expectedDeliveryDate = 0;
    if (item.schedule.length === 1 && item.schedule[0].startTimestampUtc === item.schedule[0].endTimestampUtc) {
      expectedDeliveryDate = item.schedule[0].endTimestampUtc;
    } else if (item.schedule.length >= 1) {
      let tempExpectedDeliveryDate = 0;
      item.schedule.forEach((s: Schedule) => {
        if (s.endTimestampUtc > tempExpectedDeliveryDate) {
          tempExpectedDeliveryDate = s.endTimestampUtc;
        }
      });
      expectedDeliveryDate = tempExpectedDeliveryDate;
    }
    const sampleImage = item.images.length > 0 ? item.images[0] : null;
    return (
      <View key={item.id} style={styles.fixContainer}>
        {!!sampleImage ? (
          <View>
            <ImageModal
              key={`${sampleImage.id}`}
              modalImageStyle={{ minHeight: height, minWidth: width }}
              modalImageResizeMode={FastImage.resizeMode.contain}
              resizeMode="cover"
              imageBackgroundColor={colors.white}
              style={{
                width: 125,
                height: 125,
                margin: 2,
                borderRadius: 10,
                borderColor: colors.grey,
                borderWidth: 0.3,
              }}
              source={{
                uri: decodeURIComponent(sampleImage.url),
              }}
            />
          </View>
        ) : (
          <></>
        )}
        <View style={styles.fixContainerView}>
          <Text style={styles.fixContainerFinePrints}>
            {item.createdByClient.firstName} {item.createdByClient.lastName}
          </Text>
          <Text style={styles.fixContainerText}>{item.details.name}</Text>
          <Text>{`Deadline: ${new Date(expectedDeliveryDate * 1000).toISOString().split('T')[0]}`}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(NavigationEnum.FIX, {
                fix: item,
                title: 'Fix',
                id: 'fixes_screen',
              })
            }>
            <View style={styles.detail}>
              <Text style={styles.fixContainerDetailsButton}>See Details</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFixRequestItems = ({ item }: Item): JSX.Element => {
    let expectedDeliveryDate = 0;
    if (item.schedule.length === 1 && item.schedule[0].startTimestampUtc === item.schedule[0].endTimestampUtc) {
      expectedDeliveryDate = item.schedule[0].endTimestampUtc;
    } else if (item.schedule.length >= 1) {
      let tempExpectedDeliveryDate = 0;
      item.schedule.forEach((s: Schedule) => {
        if (s.endTimestampUtc > tempExpectedDeliveryDate) {
          tempExpectedDeliveryDate = s.endTimestampUtc;
        }
      });
      expectedDeliveryDate = tempExpectedDeliveryDate;
    }
    const sampleImage = item.images.length > 0 ? item.images[0] : null;
    return (
      <View key={item.id} style={styles.fixContainer}>
        {!!sampleImage ? (
          <View>
            <ImageBackground
              source={{ uri: sampleImage.url } as ImageSourcePropType}
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
        ) : (
          <></>
        )}
        <View style={styles.fixContainerView}>
          <Text style={styles.fixContainerFinePrints}>
            {item.createdByClient.firstName} {item.createdByClient.lastName}
          </Text>
          <Text style={styles.fixContainerText}>{item.details.name}</Text>
          <Text>{`Deadline: ${new Date(expectedDeliveryDate * 1000).toISOString().split('T')[0]}`}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(NavigationEnum.FIX, {
                fix: item,
                title: 'Fix',
                id: 'fixes_screen',
              })
            }>
            <View style={styles.detail}>
              <Text style={styles.fixContainerDetailsButton}>See Details</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const render = (): JSX.Element => {
    const renderFixesFallback: boolean = pendingFixes.isLoading || inProgressFixes.isLoading;
    const isFixesToShowEmpty: boolean = pendingFixes.fixes.length <= 0 && inProgressFixes.fixes.length <= 0;
    const renderTagsFallback: boolean = popularFixTags.isLoading;
    const isTagsToShowEmpty: boolean = popularFixTags.tags.length <= 0;

    const showPendingFixes =
      pendingFixes.fixes.length > 0 ? (
        <SwipeableFlatList
          key="pending"
          title={'Pending'}
          navigationProps={{ title: 'Fixes', navigation }}
          data={pendingFixes.fixes}
          renderItem={renderPendingFixItems}></SwipeableFlatList>
      ) : null;
    const showInProgressFixes =
      inProgressFixes.fixes.length > 0 ? (
        <SwipeableFlatList
          key="on-going"
          title={'On-Going'}
          navigationProps={{ title: 'Fixes', navigation }}
          data={inProgressFixes.fixes}
          renderItem={renderFixRequestItems}></SwipeableFlatList>
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
            style={styles.background}>
            <ScrollView>
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
                [showPendingFixes, showInProgressFixes]
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
                  <Text style={styles.loadingMessage}> Tags information inavailable...</Text>
                </View>
              ) : (
                <View style={styles.tagsContainerView}>
                  {popularFixTags.tags.map((tag: TagModel) =>
                    tag ? (
                      <View key={tag.name} style={styles.tagsContainer}>
                        <Tag backgroundColor={'dark'} textColor={'light'}>
                          {tag.name}
                        </Tag>
                      </View>
                    ) : null,
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

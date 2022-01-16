/* eslint-disable max-len */
import React, { FunctionComponent, useState } from 'react';
import { Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import { Button, colors, H1, H2, Icon, Spacer } from 'fixit-common-ui';
import { store, StoreState, useSelector, persistentActions, FixesModel } from 'fixit-common-data-store';
import { useNavigation } from '@react-navigation/native';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import FadeInAnimator from '../../../common/animators/fadeInAnimator';
import backArrowIcon from '../../../common/assets/back-icon.png';
import { NavigationProps } from '../../../common/types/navigationProps';
import NotificationService from '../../../core/services/notification/notificationService';
import config from '../../../core/config/appConfig';

export type FixSuggestChangesReviewProps = {
  fix: FixesModel;
  cost: string;
  comments: string;
};
const notificationService = new NotificationService(config.rawConfig.notificationApiUrl);

const FixSuggestChangesReview: FunctionComponent<NavigationProps<FixSuggestChangesReviewProps>> = (
  props: NavigationProps<FixSuggestChangesReviewProps>,
) => {
  const navigation = useNavigation();
  const { fix, cost, comments } = props.route.params;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { notifications, unseenNotificationsNumber } = useSelector((storeState: StoreState) => storeState.persist);

  const handleContinue = async (): Promise<void> => {
    const notificationBody = {
      message: 'Knock Knock',
      payload: {
        ...fix,
        assignedToCraftsman: {
          id: store.getState().user.userId,
          firstName: store.getState().user.firstName,
          lastName: store.getState().user.lastName,
        },
        craftsmanEstimatedCost: {
          cost,
          comment: comments,
        },
        schedule: fix.schedule,
      },
      action: 'FixCraftsmanResponse',
      recipients: [
        {
          id: fix.createdByClient.id,
          firstName: fix.createdByClient.firstName,
          lastName: fix.createdByClient.lastName,
        },
      ],
      Silent: false,
    };

    try {
      await notificationService.enqueue(notificationBody);

      const notificationsToSet = notifications.filter((notification) => {
        if (notification?.fix.id !== fix.id) {
          return notification;
        }
        return null;
      });

      let unseenNotificationsNumberUpdated = unseenNotificationsNumber;
      if (unseenNotificationsNumber > notificationsToSet.length) {
        unseenNotificationsNumberUpdated = notificationsToSet.length;
      }
      store.dispatch(persistentActions.default.setNotifications(notificationsToSet, unseenNotificationsNumberUpdated));
      navigation.navigate('HomeScreen');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <View
        style={{
          backgroundColor: colors.accent,
          padding: 20,
          paddingTop: 60,
          paddingBottom: 40,
          flex: 0,
          flexDirection: 'column',
          alignItems: 'flex-start',
          shadowColor: '#000',
          zIndex: 1,
          elevation: 1,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
          }}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}>
          <Image source={backArrowIcon} />
        </TouchableOpacity>
        <View
          style={{
            height: 60,
          }}>
          <H1>Suggest Changes</H1>
        </View>
      </View>
      <StyledPageWrapper>
        <ScrollView>
          <StyledContentWrapper>
            <H2>Timeline</H2>
            <View
              style={{
                height: 50,
                padding: 12,
                paddingLeft: 50,
                borderRadius: 4,
                backgroundColor: colors.primary,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                }}>
                {new Date(fix.schedule[0].startTimestampUtc * 1000).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {fix.schedule[0].startTimestampUtc !== fix.schedule[fix.schedule.length - 1].endTimestampUtc
                  ? ` - ${new Date(fix.schedule[fix.schedule.length - 1].endTimestampUtc * 1000).toLocaleDateString(
                      'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' },
                    )}`
                  : null}
              </Text>
            </View>
            <Icon
              library="FontAwesome5"
              name="calendar-week"
              color={'accent'}
              size={20}
              style={{
                marginTop: -35,
                marginLeft: 15,
              }}
            />
            <Spacer height={'40px'} />
            <H2>Fix estimated cost</H2>
            <View
              style={{
                height: 50,
                padding: 12,
                paddingLeft: 50,
                borderRadius: 4,
                backgroundColor: colors.primary,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                }}>
                {cost}
              </Text>
            </View>
            <Icon
              library="FontAwesome5"
              name="dollar-sign"
              color={'accent'}
              size={20}
              style={{
                marginTop: -35,
                marginLeft: 20,
                width: 15,
              }}
            />
            <Spacer height={'40px'} />
            <H2>Comments</H2>
            <View
              style={{
                padding: 12,
                borderRadius: 4,
                backgroundColor: colors.primary,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                }}>
                {comments}
              </Text>
            </View>
            <Spacer height={'15px'} />
            <Text
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 30,
                marginTop: 30,
              }}>
              Are you sure you want to suggest these changes? By tapping YES you commit to the Fix.
            </Text>
            <Button onPress={() => setModalOpen(true)} block>
              YES
            </Button>
          </StyledContentWrapper>
        </ScrollView>
      </StyledPageWrapper>
      <FadeInAnimator
        visible={modalOpen}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          elevation: modalOpen ? 98 : -1,
          zIndex: modalOpen ? 98 : -1,
        }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,1)',
            opacity: 0.5,
          }}></View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 200,
            backgroundColor: '#fff',
            padding: 15,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 30,
              marginTop: 30,
            }}>
            The client will receive the updated Fix Request based on your suggested changes. You will get a notification
            once the client captures a response.
          </Text>
          <Button
            onPress={() => {
              handleContinue();
            }}
            block>
            Ok
          </Button>
        </View>
      </FadeInAnimator>
    </>
  );
};

export default FixSuggestChangesReview;

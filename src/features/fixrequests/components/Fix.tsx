import React, { FunctionComponent, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Image } from 'react-native';
import { Button, Divider, H2, H3, Icon, P, Spacer, Tag } from 'fixit-common-ui';
import {
  FixRequestService,
  store,
  StoreState,
  FixRequestModel,
  useSelector,
  persistentActions,
  FixesService,
  FixesModel,
} from 'fixit-common-data-store';
import { useNavigation } from '@react-navigation/native';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import { FormNextPageArrows } from '../../../components/forms/index';
import FadeInAnimator from '../../../common/animators/fadeInAnimator';
import globalStyles from '../../../common/styles/globalStyles';
import Calendar from '../../../components/calendar/calendar';
import FixRequestHeader from './fixRequestHeader';
import { NavigationProps } from '../../../common/types/navigationProps';
import NavigationEnum from '../../../common/enums/navigationEnum';
import config from '../../../core/config/appConfig';
import { DeletableCameraAssets } from '../../../components/DeletableCameraAssets';

export type FixProps = {
  id: string;
  title: string;
  fix?: FixesModel;
};

const styles = StyleSheet.create({
  pairOfButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#1D1F2A',
    padding: 10,
    marginTop: 60,
    borderRadius: 7,
  },
});

interface Button {
  text: string;
  onClick(): void;
}

const fixesService = new FixesService(config, store);
// eslint-disable-next-line max-len
const Fix: FunctionComponent<NavigationProps<FixProps>> = (props: NavigationProps<FixProps>): JSX.Element => {
  const navigation = useNavigation();

  const { title, id } = props.route.params;
  let { fix } = props.route.params;

  const user = useSelector((storeState: StoreState) => storeState.user);

  const [submitFixModalOpen, setSubmitFixModalOpen] = useState<boolean>(false);
  const [rejectFixModalOpen, setRejectFixModalOpen] = useState<boolean>(false);
  const [acceptCraftsmanModalOpen, setAcceptCraftsmanModalOpen] = useState<boolean>(false);
  const { notifications, unseenNotificationsNumber } = useSelector((storeState: StoreState) => storeState.persist);

  const handleConfirm = (): void => {
    const fixRequestService = new FixRequestService(config, store);
    if (id === 'fix_request') {
      fixRequestService.publishFixRequest(fix as FixRequestModel);
    }
    setSubmitFixModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setSubmitFixModalOpen(false);
    navigation.navigate('HomeScreen');
  };

  const handleMakeOffer = (): void => {
    if (fix) {
      navigation.navigate(NavigationEnum.FIXSUGGESTCHANGES, {
        fix,
      });
    }
  };

  const handleReject = (): void => {
    setRejectFixModalOpen(true);
  };

  const handleRefuse = (): void => {
    const notificationsToSet = notifications.filter((notification) => {
      if (notification?.fix.id !== fix?.id) {
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
  };

  const matchWithCraftsman = (): void => {
    if (id === 'fix_craftsman_response') {
      const body: Partial<FixesModel> = {
        assignedToCraftsman: fix?.assignedToCraftsman,
        clientEstimatedCost: fix?.clientEstimatedCost,
        systemCalculatedCost: fix?.systemCalculatedCost,
        craftsmanEstimatedCost: fix?.craftsmanEstimatedCost,
        updatedByUser: {
          id: store.getState().user.userId,
          firstName: store.getState().user.firstName as string,
          lastName: store.getState().user.lastName as string,
          role: 1,
          userPrincipalName: '',
          savedAddresses: [],
          status: {
            status: 0,
            lastSeenTimestampUtc: new Date().getTime() / 1000,
          },
        },
      };

      fixesService
        .updateFixAssign(fix?.id as string, fix?.assignedToCraftsman?.id as string, body)
        .then(() => {
          setAcceptCraftsmanModalOpen(true);
          const notificationsToSet = notifications.filter((notification) => {
            if (notification?.fix.id !== fix?.id) {
              return notification;
            }
            return null;
          });
          let unseenNotificationsNumberUpdated = unseenNotificationsNumber;
          if (unseenNotificationsNumber > notificationsToSet.length) {
            unseenNotificationsNumberUpdated = notificationsToSet.length;
          }
          store.dispatch(
            persistentActions.default.setNotifications(notificationsToSet, unseenNotificationsNumberUpdated),
          );
        })
        .catch((error) => console.error(error));
    }
  };

  const updateFixStatus = async (fixStatus: number): Promise<void> => {
    let updateFix: FixesModel | null = await fixesService.getFix(fix?.id || '');
    const date = new Date();
    const utcTimestamp = Math.floor(date.getTime() / 1000);
    const body: Partial<FixesModel> = {
      updatedByUser: {
        id: user.userId,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role,
        savedAddresses: user.savedAddresses,
        status: { status: 0, lastSeenTimestampUtc: utcTimestamp },
        userPrincipalName: user.userPrincipalName as string,
      },
      clientEstimatedCost: updateFix.clientEstimatedCost,
      status: fixStatus,
      tags: updateFix.tags,
      details: updateFix.details,
      location: updateFix.location,
      schedule: updateFix.schedule,
    };
    if (updateFix.id) {
      updateFix = await fixesService.updateFix(updateFix.id, body);
      const { error } = store.getState().fixes.updateFixState;
      if (error) {
        throw new Error(error);
      }
      navigation.goBack();
    } else {
      throw new Error('Missing fix id');
    }
  };

  const BottomButtons = () => {
    if (id === 'fix_client_request') {
      return generatePairOfButton(
        { onClick: handleMakeOffer, text: 'Make an offer' },
        { onClick: handleReject, text: 'Reject' },
      );
    }
    if (id === 'fix_craftsman_response') {
      return generatePairOfButton(
        { onClick: matchWithCraftsman, text: 'Accept' },
        { onClick: handleRefuse, text: 'Reject' },
      );
    }

    if (id === 'fixes_screen') {
      switch (user.role) {
        case 0:
          switch (fix?.status) {
            case 1:
              return (
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#1D1F2A',
                    padding: 10,
                    marginTop: 60,
                    borderRadius: 7,
                    alignSelf: 'center',
                  }}>
                  <Button
                    onPress={() => {
                      updateFixStatus(6);
                    }}>
                    Cancel
                  </Button>
                </View>
              );
            case 7:
              return (
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#1D1F2A',
                    padding: 10,
                    marginTop: 60,
                    borderRadius: 7,
                    alignSelf: 'center',
                  }}>
                  <Button
                    onPress={() => {
                      updateFixStatus(5);
                    }}>
                    Accept craftsman cancellation
                  </Button>
                </View>
              );
            default:
              break;
          }
          break;
        case 1:
          switch (fix?.status) {
            // pending case
            case 1:
              return generatePairOfButton(
                {
                  // terminated by craftsman
                  onClick: () => {
                    updateFixStatus(7);
                  },
                  text: 'Cancel',
                },
                {
                  onClick: () => {
                    updateFixStatus(2);
                  },
                  text: 'Start',
                },
              );
            // in progress case
            case 2:
              return (
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#1D1F2A',
                    padding: 10,
                    marginTop: 60,
                    borderRadius: 7,
                    alignSelf: 'center',
                  }}>
                  <Button
                    onPress={() => {
                      updateFixStatus(4);
                    }}>
                    Complete
                  </Button>
                </View>
              );
            case 3:
              return (
                <View>
                  <Text> In Review </Text>
                </View>
              );
            case 4:
              return (
                <View>
                  <Text> Completed </Text>
                </View>
              );
            case 5:
              return (
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#1D1F2A',
                    padding: 10,
                    marginTop: 60,
                    borderRadius: 7,
                    alignSelf: 'center',
                  }}>
                  <Button
                    onPress={() => {
                      console.log('Abondoned fix');
                    }}>
                    Abondoned fix
                  </Button>
                </View>
              );
            case 7:
              return (
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#1D1F2A',
                    padding: 10,
                    marginTop: 60,
                    borderRadius: 7,
                    alignSelf: 'center',
                  }}>
                  <Button
                    onPress={() => {
                      console.log('cancelled fix');
                    }}>
                    Fix cancelled
                  </Button>
                </View>
              );
            default:
              break;
          }
          break;
        default:
          break;
      }
    }
    return null;
  };

  const generatePairOfButton = (buttonLeft: Button, buttonRight: Button) => (
    <View style={styles.pairOfButton}>
      <Button onPress={buttonLeft.onClick} width={150}>
        {buttonLeft.text}
      </Button>
      <Button onPress={buttonRight.onClick} width={150} color="accent">
        {buttonRight.text}
      </Button>
    </View>
  );

  const getFormNextPageArrows = () => {
    if (id === 'fix_request') {
      return (
        <FormNextPageArrows
          secondaryClickOptions={[
            {
              label: 'Submit Fixit Request',
              onClick: handleConfirm,
            },
          ]}
        />
      );
    }
    return null;
  };

  // #region Views
  const CategoryAndType = () => {
    if (fix?.status !== 2) {
      return (
        <>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignContent: 'space-between',
            }}>
            <View
              style={{
                flexGrow: 1,
              }}>
              <H3 style={globalStyles.boldTitle}>Category</H3>
              <P>{fix?.details.category as string}</P>
            </View>
            <View
              style={{
                flexGrow: 1,
              }}>
              <H3 style={globalStyles.boldTitle}>Type</H3>
              <P>{fix?.details.type as string}</P>
            </View>
          </View>
          <Divider />
        </>
      );
    }
    return <></>;
  };

  const JobDescription = () => (
    <>
      <H3 style={globalStyles.boldTitle}>Job Description</H3>
      <P>{fix?.details.description as string}</P>
      <Divider />
    </>
  );

  const Cost = () => {
    const StyledIcon = () => (
      <Icon
        library="FontAwesome5"
        name="dollar-sign"
        color={'dark'}
        size={20}
        style={{
          marginRight: 5,
        }}
      />
    );

    return (
      <>
        <H3 style={globalStyles.boldTitle}>{fix?.craftsmanEstimatedCost ? 'Estimated Cost' : 'Budget'}</H3>
        <Spacer height={'20px'} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}>
          {fix?.craftsmanEstimatedCost ? (
            <>
              <StyledIcon />
              <Text>{fix?.craftsmanEstimatedCost.cost}</Text>
            </>
          ) : (
            <>
              <StyledIcon />
              <Text>{fix?.clientEstimatedCost.minimumCost.toString()}</Text>
              <Text
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                }}>
                {' '}
                -{' '}
              </Text>
              <StyledIcon />
              <Text>{fix?.clientEstimatedCost.maximumCost.toString()}</Text>
            </>
          )}
        </View>
        <Divider />
      </>
    );
  };

  const Tags = () => {
    if (fix?.status !== 2) {
      return (
        <>
          <H3 style={globalStyles.boldTitle}> Tags</H3>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {fix?.tags?.map((tag: any) => (
              <View
                key={tag.name}
                style={{
                  flexGrow: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <Tag backgroundColor={'accent'} textColor={'dark'}>
                  {tag.name}
                </Tag>
              </View>
            ))}
          </View>
          <Divider />
        </>
      );
    }
    return <></>;
  };

  const Images = () => {
    return (
      <>
        <H3 style={globalStyles.boldTitle}>Images</H3>
        <View style={{ flexDirection: 'row', flexGrow: 1, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          <DeletableCameraAssets files={fix?.images} />
        </View>
        <Divider />
      </>
    );
  };

  const Location = () => (
    <>
      <H3 style={globalStyles.boldTitle}>Location</H3>
      <P
        style={{
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}>
        {fix?.location?.formattedAddress as string}
      </P>
      <Divider />
    </>
  );

  const ExpectedDeliveryDate = () => {
    if (fix?.status !== 2) {
      let expectedDeliveryDate = 0;
      if (fix?.schedule) {
        fix?.schedule.forEach((sch) => {
          if (expectedDeliveryDate < sch.endTimestampUtc) {
            expectedDeliveryDate = sch.endTimestampUtc;
          }
        });
      }
      const expectedDeliveryDateAsString = new Date(expectedDeliveryDate * 1000).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return (
        <>
          <H3 style={globalStyles.boldTitle}>Expected Delivery Date</H3>
          <P>{expectedDeliveryDateAsString}</P>
          <Divider />
        </>
      );
    }
    return <></>;
  };

  const Schedules = () => {
    const schedule = fix?.schedule || [];
    if (schedule.length === 1 && schedule[0].startTimestampUtc === schedule[0].endTimestampUtc) {
      return (
        <>
          <H3 style={globalStyles.boldTitle}>Schedules</H3>
          <P>Right away</P>
          <Divider />
        </>
      );
    }
    if (schedule.length >= 1) {
      return (
        <>
          <H3 style={globalStyles.boldTitle}>Schedules</H3>
          <Calendar parentSchedules={schedule || []} canUpdate={false} />
          <Divider />
        </>
      );
    }

    return null;
  };

  const Comments = () => {
    return (
      <>
        <>
          <H3 style={globalStyles.boldTitle}>Comments</H3>
          <P
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}>
            {fix?.craftsmanEstimatedCost?.comment
              ? fix?.craftsmanEstimatedCost.comment
              : 'No comments from the craftsman.'}
          </P>
          <Divider />
        </>
      </>
    );
  };
  // #endregion Views

  return (
    <>
      <FixRequestHeader showBackBtn={true} navigation={navigation} screenTitle={title} textHeight={30} />
      <StyledPageWrapper>
        <ScrollView>
          <StyledContentWrapper>
            <H2 style={globalStyles.boldTitle}>{fix?.details.name as string}</H2>
            <Spacer height={'40px'} />
            <CategoryAndType />
            <JobDescription />
            <Cost />
            {fix?.craftsmanEstimatedCost ? <Comments /> : <></>}
            <Location />
            <Images />
            <Schedules />
            <ExpectedDeliveryDate />
            <Tags />
            {BottomButtons()}
          </StyledContentWrapper>
        </ScrollView>
      </StyledPageWrapper>
      {getFormNextPageArrows()}
      <FadeInAnimator
        visible={submitFixModalOpen}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          elevation: submitFixModalOpen ? 98 : -1,
          zIndex: submitFixModalOpen ? 98 : -1,
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
            height: 160,
            backgroundColor: '#fff',
            padding: 15,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}>
          <H2>Fix Request Submitted!</H2>
          <P>You will soon receive a notification to select a craftsman.</P>
          <Button onPress={handleCloseModal} style={{ marginTop: 20 }}>
            Confirm
          </Button>
        </View>
      </FadeInAnimator>
      <FadeInAnimator
        visible={rejectFixModalOpen}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          elevation: rejectFixModalOpen ? 98 : -1,
          zIndex: rejectFixModalOpen ? 98 : -1,
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
            height: 180,
            backgroundColor: '#fff',
            padding: 15,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}>
          <H2>Are you sure you want to refuse this Fix Request?</H2>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              backgroundColor: '#1D1F2A',
              padding: 10,
              borderRadius: 7,
            }}>
            <Button onPress={() => setRejectFixModalOpen(false)} width={150}>
              Cancel
            </Button>
            <Button onPress={handleRefuse} width={150} color="accent">
              Refuse
            </Button>
          </View>
        </View>
      </FadeInAnimator>
      <FadeInAnimator
        visible={acceptCraftsmanModalOpen}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          elevation: acceptCraftsmanModalOpen ? 98 : -1,
          zIndex: acceptCraftsmanModalOpen ? 98 : -1,
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
            height: 180,
            backgroundColor: '#fff',
            padding: 15,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}>
          <H2>Congratulation, your Fix request is now underway!</H2>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              backgroundColor: '#1D1F2A',
              padding: 10,
              borderRadius: 7,
            }}>
            <Button onPress={() => navigation.navigate('HomeScreen')} width={150} color="accent">
              Ok
            </Button>
          </View>
        </View>
      </FadeInAnimator>
    </>
  );
};

export default Fix;

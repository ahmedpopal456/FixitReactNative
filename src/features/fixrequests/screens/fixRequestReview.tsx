import React, { FunctionComponent, useState } from 'react';
import { Text, View } from 'react-native';
import {
  Button,
  Divider,
  H2, H3, Icon, P, Spacer, Tag,
} from 'fixit-common-ui';
import {
  FixRequestService,
  store, StoreState, FixRequestModel, FixesModel, useSelector, TagModel, SectionModel, fixRequestActions, useDispatch,
} from 'fixit-common-data-store';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import StyledScrollView from '../../../components/styledElements/styledScrollView';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import { FormNextPageArrows } from '../../../components/forms/index';
import FadeInAnimator from '../../../common/animators/fadeInAnimator';
import globalStyles from '../../../common/styles/globalStyles';
import Calendar from '../../../components/calendar/calendar';
import FixRequestHeader from '../components/fixRequestHeader';

export type FixRequestReviewProps = {
  passedFix?: FixesModel;
  isFixCraftsmanResponseNotification?: boolean;
};

const FixRequestReview: FunctionComponent<FixRequestReviewProps> = (props: FixRequestReviewProps): JSX.Element => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const fixRequest = useSelector((storeState: StoreState) => ({
    category: storeState.fixTemplate.workCategory,
    type: storeState.fixTemplate.workType,
    unit: storeState.fixTemplate.fixUnit,
    description: storeState.fixTemplate.description,
    tags: storeState.fixTemplate.tags,
    name: storeState.fixTemplate.name,
    location: storeState.fixRequest.fixRequestObj.location,
    clientEstimatedCost: storeState.fixRequest.fixRequestObj.clientEstimatedCost,
    schedule: storeState.fixRequest.fixRequestObj.schedule,
    sections: storeState.fixTemplate.sections,
  }));

  const user = useSelector((storeState: StoreState) => storeState.user);
  const [submitFixModalOpen, setSubmitFixModalOpen] = useState<boolean>(false);
  const [rejectFixModalOpen, setRejectFixModalOpen] = useState<boolean>(false);
  const [acceptCraftsmanModalOpen, setAcceptCraftsmanModalOpen] = useState<boolean>(false);

  const handleConfirm = () : void => {
    const fixRequestService = new FixRequestService(store);

    const tags: Array<TagModel> = [];
    fixRequest.tags.forEach((tag) => {
      tags.push({ name: tag });
    });

    const updateSchedules = fixRequest.schedule;
    updateSchedules.forEach((updateSchedule, index) => {
      if (updateSchedule.startTimestampUtc === 0 || updateSchedule.endTimestampUtc === 0) {
        updateSchedules.splice(index, 1);
      }
    });

    dispatch(fixRequestActions.setFixRequestSchedules(updateSchedules));
    const fixRequestSections: Array<SectionModel> = [];
    fixRequest.sections.forEach((section) => {
      const fixRequestSection = {
        name: section.name,
        details: section.fields,
      };
      fixRequestSections.push(fixRequestSection);
    });

    const details = {
      name: fixRequest.name,
      description: fixRequest.description,
      category: fixRequest.category.name,
      type: fixRequest.type.name,
      unit: fixRequest.unit.name,
      sections: fixRequestSections,
    };

    const createdByClient = {
      id: user.userId,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
    };

    const updatedByUser = {
      id: user.userId,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
    };

    const fixRequestCreateRequest: FixRequestModel = {
      tags,
      details,
      location: fixRequest.location,
      createdByClient,
      updatedByUser,
      clientEstimatedCost: fixRequest.clientEstimatedCost,
      schedule: updateSchedules,
      status: 0,
    };

    fixRequestService.publishFixRequest(fixRequestCreateRequest);
    setSubmitFixModalOpen(true);
  };

  const handleCloseModal = () : void => {
    setSubmitFixModalOpen(false);
    navigation.navigate('HomeScreen');
  };

  const handleMakeOffer = () : void => {
    if (props.passedFix) {
      navigation.navigate('FixSuggestChanges', {
        passedFix: props.passedFix,
      });
    }
  };

  const goBack = () : void => {
    navigation.navigate('FixRequestScheduleStep');
  };

  const handleReject = () : void => {
    setRejectFixModalOpen(true);
  };

  const handleRefuse = () : void => {
    navigation.navigate('HomeScreen');
  };

  const matchWithCraftsman = () : void => {
    axios.put(
      `https://fixit-dev-fms-api.azurewebsites.net/api/fixes/${props.passedFix?.id}
        /users/${props.passedFix?.assignedToCraftsman.Id}/assign`,
      {
        assignedToCraftsman: {
          ...props.passedFix?.assignedToCraftsman,
        },
        ClientEstimatedCost: {
          ...props.passedFix?.clientEstimatedCost,
        },
        systemCalculatedCost: props.passedFix?.systemCalculatedCost,
        CraftsmanEstimatedCost: {
          ...props.passedFix?.craftsmanEstimatedCost,
        },
        UpdatedByUser: {
          Id: store.getState().user.userId,
          FirstName: store.getState().user.firstName,
          LastName: store.getState().user.lastName,
        },
      },
    )
      .then(() => setAcceptCraftsmanModalOpen(true))
      .catch((error) => console.error(error));
  };

  const getExpectedDeliveryDate = (): string => {
    let expectedDeliveryDate = 0;
    if (props.passedFix?.schedule) {
      props.passedFix.schedule.forEach((sch) => {
        if (expectedDeliveryDate < sch.endTimestampUtc) {
          expectedDeliveryDate = sch.endTimestampUtc;
        }
      });
    } else if (fixRequest.schedule) {
      fixRequest.schedule.forEach((sch) => {
        if (expectedDeliveryDate < sch.endTimestampUtc) {
          expectedDeliveryDate = sch.endTimestampUtc;
        }
      });
    }
    return new Date(expectedDeliveryDate * 1000).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <>
      {props.passedFix
        ? <FixRequestHeader
          showBackBtn={true}
          navigation={navigation}
          screenTitle="Fix Request"
          textHeight={30}/>
        : <FixRequestHeader
          showBackBtn={true}
          navigation={navigation}
          screenTitle="Review your Fixit Request"
          textHeight={30}
          backFunction={goBack}/>}
      <StyledPageWrapper>
        <StyledScrollView testID='styledScrollView'>
          <StyledContentWrapper>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              alignContent: 'space-between',
            }}>
              <View style={{
                flexGrow: 1,
              }}>
                <H3 style={globalStyles.boldTitle}>Category</H3>
                <P>{
                  props.passedFix
                    ? props.passedFix.details.category
                    : fixRequest.category.name
                }</P>
              </View>
              <View style={{
                flexGrow: 1,
              }}>
                <H3 style={globalStyles.boldTitle}>Type</H3>
                <P>{
                  props.passedFix
                    ? props.passedFix.details.type
                    : fixRequest.type.name
                }</P>
              </View>
            </View>
            <Divider />
            <H2>{
              props.passedFix
                ? props.passedFix.details.name
                : fixRequest.name
            }</H2>
            <H3 style={globalStyles.boldTitle}>Job Description</H3>
            <P>{
              props.passedFix
                ? props.passedFix.details.description
                : fixRequest.description
            }</P>
            <H3 style={globalStyles.boldTitle}>Tags</H3>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
              {
                props.passedFix
                  ? props.passedFix.tags.map((tag: any) => (
                    tag
                      ? <View key={tag.name} style={{
                        flexGrow: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                        <Tag backgroundColor={'accent'} textColor={'dark'}>{tag.name}</Tag>
                      </View>
                      : null
                  ))
                  : fixRequest.tags.map((tag: string) => (
                    tag
                      ? <View key={tag} style={{
                        flexGrow: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                        <Tag backgroundColor={'accent'} textColor={'dark'}>{tag}</Tag>
                      </View>
                      : null
                  ))
              }
            </View>
            <Divider />
            <H2 style={globalStyles.boldTitle}>Images</H2>
            <Divider />
            <H2 style={globalStyles.boldTitle}>Location</H2>
            <Divider />
            <View style={{
              flexDirection: 'row',
            }}>
              <P>{
                props.passedFix
                  ? props.passedFix.location.address
                  : fixRequest.location.address
              }</P>
              <P>{
                props.passedFix
                  ? props.passedFix.location.city
                  : fixRequest.location.city
              }</P>
            </View>
            <View style={{
              flexDirection: 'row',
            }}>
              <P>{
                props.passedFix
                  ? props.passedFix.location.postalCode
                  : fixRequest.location.postalCode
              }</P>
              <P>{
                props.passedFix
                  ? props.passedFix.location.province
                  : fixRequest.location.province
              }</P>
            </View>
            <Spacer height={'40px'} />
            <H2 style={globalStyles.boldTitle}>Availability</H2>
            <Divider />
            <Calendar
              parentSchedules={props.passedFix ? props.passedFix.schedule : fixRequest.schedule}
              canUpdate={false}/>
            <Spacer height={'40px'} />
            <H2 style={globalStyles.boldTitle}>Expected Delivery Date</H2>
            <Divider />
            <P>{getExpectedDeliveryDate()}</P>
            <Spacer height={'40px'} />
            <H2 style={globalStyles.boldTitle}>Budget</H2>
            <Divider />
            <Spacer height={'20px'} />
            <View style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}>
              {
                props.passedFix && props.passedFix.craftsmanEstimatedCost
                  ? <>
                    <Icon
                      library="FontAwesome5"
                      name="dollar-sign"
                      color={'dark'}
                      size={20}
                      style={{
                        marginRight: 5,
                      }}/>
                    <Text>{props.passedFix.craftsmanEstimatedCost.cost}</Text>
                  </>
                  : <>
                    <Icon
                      library="FontAwesome5"
                      name="dollar-sign"
                      color={'dark'}
                      size={20}
                      style={{
                        marginRight: 5,
                      }}/>
                    <Text>{
                      props.passedFix && props.passedFix.clientEstimatedCost
                        ? props.passedFix.clientEstimatedCost.minimumCost.toString()
                        : fixRequest.clientEstimatedCost.minimumCost.toString()
                    }</Text>
                    <Text style={{
                      marginLeft: 10,
                      marginRight: 10,
                    }}> - </Text>
                    <Icon
                      library="FontAwesome5"
                      name="dollar-sign"
                      color={'dark'}
                      size={20}
                      style={{
                        marginRight: 5,
                      }}/>
                    <Text>{
                      props.passedFix && props.passedFix.clientEstimatedCost
                        ? props.passedFix.clientEstimatedCost.maximumCost.toString()
                        : fixRequest.clientEstimatedCost.maximumCost.toString()
                    }</Text>
                  </>
              }
            </View>
            <Spacer height={'40px'} />
            <H2 style={globalStyles.boldTitle}>System Cost Estimate</H2>
            <Divider />
            <Icon library="FontAwesome5" name="dollar-sign" color={'dark'} size={20}/>
            {
              props.passedFix && !props.isFixCraftsmanResponseNotification
                ? <>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      backgroundColor: '#1D1F2A',
                      padding: 10,
                      marginTop: 60,
                      borderRadius: 7,
                    }}
                  >
                    <Button onPress={handleMakeOffer} width={150}>
              Make an offer
                    </Button>
                    <Button onPress={handleReject} width={150} color="accent">
              Reject
                    </Button>
                  </View>
                </>
                : null
            }
            {
              props.passedFix && props.isFixCraftsmanResponseNotification
                ? <>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      backgroundColor: '#1D1F2A',
                      padding: 10,
                      marginTop: 60,
                      borderRadius: 7,
                    }}
                  >
                    <Button onPress={() => navigation.navigate('HomeScreen')} width={150}>
                        Reject
                    </Button>
                    <Button onPress={() => matchWithCraftsman()} width={150} color="accent">
                        Accept
                    </Button>
                  </View>
                </>
                : null
            }
          </StyledContentWrapper>
        </StyledScrollView>
      </StyledPageWrapper>
      {
        props.passedFix
          ? null
          : <FormNextPageArrows secondaryClickOptions={[
            {
              label: 'Submit Fixit Request',
              onClick: handleConfirm,
            },
          ]} />
      }
      <FadeInAnimator visible={submitFixModalOpen} style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        elevation: (submitFixModalOpen) ? 98 : -1,
        zIndex: (submitFixModalOpen) ? 98 : -1,
      }}>
        <View style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,1)',
          opacity: 0.5,
        }}>
        </View>
        <View style={{
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
          <Button onPress={handleCloseModal} style={{ marginTop: 20 }}>Confirm</Button>
        </View>
      </FadeInAnimator>
      <FadeInAnimator visible={rejectFixModalOpen} style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        elevation: (rejectFixModalOpen) ? 98 : -1,
        zIndex: (rejectFixModalOpen) ? 98 : -1,
      }}>
        <View style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,1)',
          opacity: 0.5,
        }}>
        </View>
        <View style={{
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
            }}
          >
            <Button onPress={() => setRejectFixModalOpen(false)} width={150}>Cancel</Button>
            <Button onPress={handleRefuse} width={150} color="accent">
              Refuse
            </Button>
          </View>
        </View>
      </FadeInAnimator>
      <FadeInAnimator visible={acceptCraftsmanModalOpen} style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        elevation: (acceptCraftsmanModalOpen) ? 98 : -1,
        zIndex: (acceptCraftsmanModalOpen) ? 98 : -1,
      }}>
        <View style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,1)',
          opacity: 0.5,
        }}>
        </View>
        <View style={{
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
            }}
          >
            <Button onPress={() => navigation.navigate('HomeScreen')} width={150} color="accent">
              Ok
            </Button>
          </View>
        </View>
      </FadeInAnimator>
    </>
  );
};

export default FixRequestReview;

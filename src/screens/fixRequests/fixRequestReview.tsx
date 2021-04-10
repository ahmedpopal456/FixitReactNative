import React from 'react';
import { Text, View } from 'react-native';
import {
  Button,
  Divider,
  H2, H3, Icon, P, Spacer, Tag,
} from 'fixit-common-ui';
import {
  connect, FixRequestService, store, StoreState, rootContext, persistentStore, FixesModel,
} from 'fixit-common-data-store';
import axios from 'axios';
import { FixRequestReviewProps } from '../../models/screens/fixRequests/fixRequestReviewModel';
import FadeInAnimator from '../../animators/fadeInAnimator';
import StyledContentWrapper from '../../components/styledElements/styledContentWrapper';
import FixRequestHeader from '../../components/fixRequestHeader';
import StyledScrollView from '../../components/styledElements/styledScrollView';
import StyledPageWrapper from '../../components/styledElements/styledPageWrapper';
import FormNextPageArrows from '../../components/formNextPageArrows';
import Calendar from '../../components/calendar';
import globalStyles from '../../components/styles/fixRequests/globalStyles';

class FixRequestReview extends
  React.Component<FixRequestReviewProps> {
    state={
      submitFixModalOpen: false,
      rejectFixModalOpen: false,
      acceptCraftsmanModalOpen: false,
      workCategory: '',
      workType: '',
    }

    componentDidMount() : void {
      if (this.props.passedFix) {
        this.getCategory(this.props.passedFix.details[0].category);
        this.getType(this.props.passedFix.details[0].type);
      } else {
        this.getCategory(this.props.fixRequestObj.Details[0].Category);
        this.getType(this.props.fixRequestObj.Details[0].Type);
      }
    }

    handleConfirm = () : void => {
      const serv = new FixRequestService(store);
      const fixRequestObj = { ...this.props.fixRequestObj };
      delete fixRequestObj.Details[0].Unit;
      const { userId } = persistentStore.getState().user;
      const { firstName } = persistentStore.getState().user;
      const { lastName } = persistentStore.getState().user;
      fixRequestObj.CreatedByClient = {
        Id: userId,
        FirstName: firstName || '',
        LastName: lastName || '',
      };
      fixRequestObj.UpdatedByUser = {
        Id: userId,
        FirstName: firstName || '',
        LastName: lastName || '',
      };
      serv.publishFixRequest(fixRequestObj);
      this.setState({
        submitFixModalOpen: true,
      });
    }

    handleCloseModal = () : void => {
      this.setState({
        submitFixModalOpen: false,
      });
      this.props.navigation.navigate('HomeScreen');
    }

    handleMakeOffer = () : void => {
      if (this.props.passedFix) {
        this.props.navigation.navigate('FixSuggestChanges', {
          passedFix: this.props.passedFix,
        });
      }
    }

    handleReject = () : void => {
      this.setState({ rejectFixModalOpen: true });
    }

    handleRefuse = () : void => {
      this.props.navigation.navigate('HomeScreen');
    }

    goBack = () : void => {
      this.props.navigation.navigate('FixRequestScheduleStep');
    }

    getCategory = (id:string) : void => {
      axios.get(`https://fixit-dev-mdm-api.azurewebsites.net/api/workcategories/${id}`)
        .then((response) => {
          this.setState({ workCategory: response.data.name });
        })
        .catch((error) => console.error(error));
    }

    getType = (id:string) : void => {
      axios.get(`https://fixit-dev-mdm-api.azurewebsites.net/api/worktypes/${id}`)
        .then((response) => {
          this.setState({ workType: response.data.name });
        })
        .catch((error) => console.error(error));
    }

    matchWithCraftsman = () : void => {
      axios.put(
        `https://fixit-dev-fms-api.azurewebsites.net/api/fixes/${this.props.passedFix?.id}/users/${this.props.passedFix?.assignedToCraftsman.Id}/assign`,
        {
          assignedToCraftsman: {
            ...this.props.passedFix?.assignedToCraftsman,
          },
          ClientEstimatedCost: {
            ...this.props.passedFix?.clientEstimatedCost,
          },
          systemCalculatedCost: this.props.passedFix?.systemCalculatedCost,
          CraftsmanEstimatedCost: {
            ...this.props.passedFix?.craftsmanEstimatedCost,
          },
          UpdatedByUser: {
            Id: persistentStore.getState().user.userId,
            FirstName: persistentStore.getState().user.firstName,
            LastName: persistentStore.getState().user.lastName,
          },
        },
      )
        .then(() => this.setState({ acceptCraftsmanModalOpen: true }))
        .catch((error) => console.error(error));
    }

    render() : JSX.Element {
      return (
        <>
          {this.props.passedFix
            ? <FixRequestHeader
              showBackBtn={true}
              navigation={this.props.navigation}
              screenTitle="Fix Request"
              textHeight={30}/>
            : <FixRequestHeader
              showBackBtn={true}
              navigation={this.props.navigation}
              screenTitle="Review your Fixit Request"
              textHeight={30}
              backFunction={this.goBack}/>}
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
                    <P>{this.state.workCategory}</P>
                  </View>
                  <View style={{
                    flexGrow: 1,
                  }}>
                    <H3 style={globalStyles.boldTitle}>Type</H3>
                    <P>{this.state.workType}</P>
                  </View>
                </View>
                <Divider />
                <H2>{
                  this.props.passedFix
                    ? this.props.passedFix.details[0].name
                    : this.props.fixRequestObj.Details[0].Name
                }</H2>
                <H3 style={globalStyles.boldTitle}>Job Description</H3>
                <P>{
                  this.props.passedFix
                    ? this.props.passedFix.details[0].description
                    : this.props.fixRequestObj.Details[0].Description
                }</P>
                <H3 style={globalStyles.boldTitle}>Tags</H3>
                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                  {
                    this.props.passedFix
                      ? this.props.passedFix.tags.map((tag: any) => (
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
                      : this.props.fixRequestObj.Tags.map((tag:{Name:string}) => (
                        tag
                          ? <View key={tag.Name} style={{
                            flexGrow: 0,
                            display: 'flex',
                            alignItems: 'center',
                          }}>
                            <Tag backgroundColor={'accent'} textColor={'dark'}>{tag.Name}</Tag>
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
                    this.props.passedFix
                      ? this.props.passedFix.location.address
                      : this.props.fixRequestObj.Location.Address
                  }</P>
                  <P>{
                    this.props.passedFix
                      ? this.props.passedFix.location.city
                      : this.props.fixRequestObj.Location.City
                  }</P>
                </View>
                <View style={{
                  flexDirection: 'row',
                }}>
                  <P>{
                    this.props.passedFix
                      ? this.props.passedFix.location.postalCode
                      : this.props.fixRequestObj.Location.PostalCode
                  }</P>
                  <P>{
                    this.props.passedFix
                      ? this.props.passedFix.location.province
                      : this.props.fixRequestObj.Location.Province
                  }</P>
                </View>
                <Spacer height={'40px'} />
                <H2 style={globalStyles.boldTitle}>Availability</H2>
                <Divider />
                <Calendar
                  startDate={
                    this.props.passedFix
                      ? new Date(this.props.passedFix.schedule[0].startTimestampUtc * 1000)
                      : new Date(this.props.fixRequestObj.Schedule[0].StartTimestampUtc * 1000)
                  }
                  endDate={
                    this.props.passedFix
                      ? new Date(this.props.passedFix.schedule[0].endTimestampUtc * 1000)
                      : new Date(this.props.fixRequestObj.Schedule[0].EndTimestampUtc * 1000)
                  }
                  canUpdate={false}/>
                <Spacer height={'40px'} />
                <H2 style={globalStyles.boldTitle}>Expected Delivery Date</H2>
                <Divider />
                <P>{
                  this.props.passedFix
                    ? new Date(this.props.passedFix.schedule[0].endTimestampUtc * 1000)
                      .toLocaleDateString('en-US', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      })
                    : new Date(
                      this.props.fixRequestObj.Schedule[0].EndTimestampUtc * 1000,
                    ).toLocaleDateString('en-US', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                    })
                }</P>
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
                    this.props.passedFix && this.props.passedFix.craftsmanEstimatedCost
                      ? <>
                        <Icon
                          library="FontAwesome5"
                          name="dollar-sign"
                          color={'dark'}
                          size={20}
                          style={{
                            marginRight: 5,
                          }}/>
                        <Text>{this.props.passedFix.craftsmanEstimatedCost.cost}</Text>
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
                          this.props.passedFix && this.props.passedFix.clientEstimatedCost
                            ? this.props.passedFix.clientEstimatedCost.minimumCost.toString()
                            : this.props.fixRequestObj.ClientEstimatedCost.MinimumCost.toString()
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
                          this.props.passedFix && this.props.passedFix.clientEstimatedCost
                            ? this.props.passedFix.clientEstimatedCost.maximumCost.toString()
                            : this.props.fixRequestObj.ClientEstimatedCost.MaximumCost.toString()
                        }</Text>
                      </>
                  }
                </View>
                <Spacer height={'40px'} />
                <H2 style={globalStyles.boldTitle}>System Cost Estimate</H2>
                <Divider />
                <Icon library="FontAwesome5" name="dollar-sign" color={'dark'} size={20}/>
                {
                  this.props.passedFix && !this.props.isFixCraftsmanResponseNotification
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
                        <Button onPress={this.handleMakeOffer} width={150}>
              Make an offer
                        </Button>
                        <Button onPress={this.handleReject} width={150} color="accent">
              Reject
                        </Button>
                      </View>
                    </>
                    : null
                }
                {
                  this.props.passedFix && this.props.isFixCraftsmanResponseNotification
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
                        <Button onPress={() => this.props.navigation.navigate('HomeScreen')} width={150}>
                        Reject
                        </Button>
                        <Button onPress={() => this.matchWithCraftsman()} width={150} color="accent">
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
            this.props.passedFix
              ? null
              : <FormNextPageArrows secondaryClickOptions={[
                {
                  label: 'Submit Fixit Request',
                  onClick: this.handleConfirm,
                },
              ]} />
          }
          <FadeInAnimator visible={this.state.submitFixModalOpen} style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            elevation: (this.state.submitFixModalOpen) ? 98 : -1,
            zIndex: (this.state.submitFixModalOpen) ? 98 : -1,
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
              <Button onPress={this.handleCloseModal} style={{ marginTop: 20 }}>Confirm</Button>
            </View>
          </FadeInAnimator>
          <FadeInAnimator visible={this.state.rejectFixModalOpen} style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            elevation: (this.state.rejectFixModalOpen) ? 98 : -1,
            zIndex: (this.state.rejectFixModalOpen) ? 98 : -1,
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
                <Button onPress={() => {
                  this.setState({ rejectFixModalOpen: false });
                }} width={150}>Cancel</Button>
                <Button onPress={this.handleRefuse} width={150} color="accent">
              Refuse
                </Button>
              </View>
            </View>
          </FadeInAnimator>
          <FadeInAnimator visible={this.state.acceptCraftsmanModalOpen} style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            elevation: (this.state.acceptCraftsmanModalOpen) ? 98 : -1,
            zIndex: (this.state.acceptCraftsmanModalOpen) ? 98 : -1,
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
                <Button onPress={() => this.props.navigation.navigate('HomeScreen')} width={150} color="accent">
              Ok
                </Button>
              </View>
            </View>
          </FadeInAnimator>
        </>
      );
    }
}

function mapStateToProps(state : StoreState, ownProps : any) {
  return {
    fixRequestObj: {
      ...state.fixRequest.fixRequestObj,
    },
    passedFix: ownProps.route.params ? ownProps.route.params.passedFix : undefined,
    isFixCraftsmanResponseNotification:
    ownProps.route.params
      ? ownProps.route.params.isFixCraftsmanResponseNotification
      : undefined,
  };
}

export default connect(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mapStateToProps, null, null, { context: rootContext },
)(FixRequestReview);

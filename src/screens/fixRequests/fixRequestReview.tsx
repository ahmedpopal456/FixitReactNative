import React from 'react';
import { Text, View } from 'react-native';
import {
  Button,
  Divider,
  H2, H3, Icon, P, Spacer, Tag,
} from 'fixit-common-ui';
import {
  connect, FixRequestService, store, StoreState, rootContext,
} from 'fixit-common-data-store';
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
      modalOpen: false,
    }

    handleConfirm = () : void => {
      const serv = new FixRequestService();
      serv.publishFixRequest(store.getState().fixRequest.fixRequestObj);
      this.setState({
        modalOpen: true,
      });
    }

    handleCloseModal = () : void => {
      this.setState({
        modalOpen: false,
      });
      this.props.navigation.navigate('HomeScreen');
    }

    goBack = () : void => {
      this.props.navigation.navigate('FixRequestScheduleStep');
    }

    render() : JSX.Element {
      return (
        <>
          <FixRequestHeader
            showBackBtn={true}
            navigation={this.props.navigation}
            screenTitle="Review your Fixit Request"
            textHeight={30}
            backFunction={this.goBack}/>
          <StyledPageWrapper>
            <StyledScrollView>
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
                    <P>{this.props.fixRequestObj.Details[0].Category}</P>
                  </View>
                  <View style={{
                    flexGrow: 1,
                  }}>
                    <H3 style={globalStyles.boldTitle}>Type</H3>
                    <P>{this.props.fixRequestObj.Details[0].Type}</P>
                  </View>
                </View>
                <Divider />
                <H2>{this.props.fixRequestObj.Details[0].Name}</H2>
                <H3 style={globalStyles.boldTitle}>Job Description</H3>
                <P>{this.props.fixRequestObj.Details[0].Description}</P>
                <H3 style={globalStyles.boldTitle}>Tags</H3>
                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                  {this.props.fixRequestObj.Tags.map((tag:{Name:string}) => (
                    tag
                      ? <View key={tag.Name} style={{
                        flexGrow: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                        <Tag backgroundColor={'accent'} textColor={'dark'}>{tag.Name}</Tag>
                      </View>
                      : null
                  ))}
                </View>
                <Divider />
                <H2 style={globalStyles.boldTitle}>Images</H2>
                <Divider />
                <H2 style={globalStyles.boldTitle}>Location</H2>
                <Divider />
                <View style={{
                  flexDirection: 'row',
                }}>
                  <P>{this.props.fixRequestObj.Location.Address}</P>
                  <P>{this.props.fixRequestObj.Location.City}</P>
                </View>
                <View style={{
                  flexDirection: 'row',
                }}>
                  <P>{this.props.fixRequestObj.Location.PostalCode}</P>
                  <P>{this.props.fixRequestObj.Location.Province}</P>
                </View>
                <Spacer height={'40px'} />
                <H2 style={globalStyles.boldTitle}>Availability</H2>
                <Divider />
                <Calendar
                  startDate={
                    new Date(this.props.fixRequestObj.Schedule[0].StartTimestampUtc * 1000)
                  }
                  endDate={
                    new Date(this.props.fixRequestObj.Schedule[0].EndTimestampUtc * 1000)
                  }
                  canUpdate={false}/>
                <Spacer height={'40px'} />
                <H2 style={globalStyles.boldTitle}>Expected Delivery Date</H2>
                <Divider />
                <P>{
                  new Date(this.props.fixRequestObj.Schedule[0].EndTimestampUtc * 1000).toString()
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
                  <Icon
                    library="FontAwesome5"
                    name="dollar-sign"
                    color={'dark'}
                    size={20}
                    style={{
                      marginRight: 5,
                    }}/>
                  <Text>{this.props.fixRequestObj.ClientEstimatedCost.MinimumCost.toString()}</Text>
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
                  <Text>{this.props.fixRequestObj.ClientEstimatedCost.MaximumCost.toString()}</Text>
                </View>
                <Spacer height={'40px'} />
                <H2 style={globalStyles.boldTitle}>System Cost Estimate</H2>
                <Divider />
                <Icon library="FontAwesome5" name="dollar-sign" color={'dark'} size={20}/>
              </StyledContentWrapper>
            </StyledScrollView>
          </StyledPageWrapper>

          <FormNextPageArrows secondaryClickOptions={[
            {
              label: 'Submit Fixit Request',
              onClick: this.handleConfirm,
            },
          ]} />
          <FadeInAnimator visible={this.state.modalOpen} style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            elevation: (this.state.modalOpen) ? 98 : -1,
            zIndex: (this.state.modalOpen) ? 98 : -1,
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
        </>
      );
    }
}

function mapStateToProps(state : StoreState) {
  return {
    fixRequestObj: {
      ...state.fixRequest.fixRequestObj,
    },
  };
}

export default connect(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mapStateToProps, null, null, { context: rootContext },
)(FixRequestReview);

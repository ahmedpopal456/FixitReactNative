import React from 'react';
import {
  Text, TouchableOpacity, View, Image,
} from 'react-native';
import {
  Button,
  colors,
  H1,
  H2, Icon, Spacer,
} from 'fixit-common-ui';
import {
  StoreState, connect, FixesModel, FixRequestModel, store,
} from 'fixit-common-data-store';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import StyledScrollView from '../../../components/styledElements/styledScrollView';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import FadeInAnimator from '../../../common/animators/fadeInAnimator';
import { HomeStackNavigatorProps } from '../../../common/models/navigators/homeStackNavigatorModel';
import backArrowIcon from '../../../common/assets/back-icon.png';

type FixSuggestChangesReviewNavigationProps = StackNavigationProp<HomeStackNavigatorProps,
  'FixSuggestChangesReview'
>;

export type FixSuggestChangesReviewProps = {
  navigation: FixSuggestChangesReviewNavigationProps;
  passedFix: FixesModel;
  fixRequestObj: FixRequestModel,
  cost: string,
  comments: string,
};

class FixSuggestChangesReview extends
  React.Component<FixSuggestChangesReviewProps> {
    state={
      modalOpen: false,
    }

    handleContinue() : void {
      axios.post('https://fixit-dev-nms-api.azurewebsites.net/api/Notifications',
        {
          Message: 'Knock Knock',
          Payload:
          {
            Id: this.props.passedFix.id,
            AssignedToCraftsman:
              {
                Id: store.getState().user.userId,
                FirstName: store.getState().user.firstName,
                LastName: store.getState().user.lastName,
              },
            SystemCalculatedCost: this.props.passedFix.systemCalculatedCost,
            CraftsmanEstimatedCost:
              {
                Cost: this.props.cost,
                Comment: this.props.comments,
              },
            Schedule: [
              {
                startTimestampUtc: this.props.fixRequestObj.schedule[0].startTimestampUtc,
                endTimestampUtc: this.props.fixRequestObj.schedule[0].endTimestampUtc,
              },
            ],
            FixCategory: {},
            FixType: {},
            Location: {},
            Images: [],
            FixDetails: {},
          },
          Action: 'FixCraftSmanResponse',
          Recipients:
          [
            {
              Id: this.props.passedFix.createdByClient.id,
              FirstName: this.props.passedFix.createdByClient.firstName,
              LastName: this.props.passedFix.createdByClient.lastName,
            },
          ],
          Silent: false,
        });
      this.props.navigation.navigate('HomeScreen');
    }

    render() : JSX.Element {
      return (
        <>
          <View style={{
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
            shadowOpacity: 0.20,
            shadowRadius: 1.41,
          }}>
            <TouchableOpacity style={{
              position: 'absolute',
              top: 20,
              left: 20,
            }}
            onPress={() => {
              if (this.props.navigation.canGoBack()) {
                this.props.navigation.goBack();
              }
            }}>
              <Image source={backArrowIcon} />
            </TouchableOpacity>
            <View style={{
              height: 60,
            }}>
              <H1>Suggest Changes</H1>
            </View>
          </View>
          <StyledPageWrapper>
            <StyledScrollView>
              <StyledContentWrapper>
                <H2>Fix Plan Timeline</H2>
                <View style={{
                  height: 50,
                  padding: 12,
                  paddingLeft: 50,
                  borderRadius: 4,
                  backgroundColor: colors.primary,
                }}>
                  <Text style={{
                    color: '#fff',
                    fontSize: 18,
                  }}>
                    {
                      new Date(this.props.fixRequestObj.schedule[0].startTimestampUtc * 1000)
                        .toLocaleDateString('en-US', {
                          month: 'long', day: 'numeric',
                        })
                    }
                  &nbsp;-&nbsp;
                    {
                      new Date(this.props.fixRequestObj.schedule[0].endTimestampUtc * 1000)
                        .toLocaleDateString('en-US', {
                          month: 'long', day: 'numeric',
                        })
                    }
                  </Text>
                </View>
                <Icon library="FontAwesome5" name="calendar-week" color={'accent'} size={20} style={{
                  marginTop: -35,
                  marginLeft: 15,
                }}/>
                <Spacer height={'40px'} />
                <H2>Fix Cost</H2>
                <View style={{
                  height: 50,
                  padding: 12,
                  paddingLeft: 50,
                  borderRadius: 4,
                  backgroundColor: colors.primary,
                }}>
                  <Text style={{
                    color: '#fff',
                    fontSize: 18,
                  }}>
                    {this.props.cost}
                  </Text>
                </View>
                <Icon library="FontAwesome5" name="dollar-sign" color={'accent'} size={20} style={{
                  marginTop: -35,
                  marginLeft: 20,
                  width: 15,
                }}/>
                <Spacer height={'40px'}/>
                <H2>Comments</H2>
                <View style={{
                  padding: 12,
                  borderRadius: 4,
                  backgroundColor: colors.primary,
                }}>
                  <Text style={{
                    color: '#fff',
                    fontSize: 16,
                  }}>
                    {this.props.comments}
                  </Text>
                </View>
                <Spacer height={'15px'}/>
                <Text style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: 30,
                  marginTop: 30,
                }}>
                Are you sure you want to suggest these changes?
                By tapping YES you commit to the Fix.
                </Text>
                <Button onPress={() => this.setState({ modalOpen: true })} block>YES</Button>
              </StyledContentWrapper>
            </StyledScrollView>
          </StyledPageWrapper>
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
              height: 200,
              backgroundColor: '#fff',
              padding: 15,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}>
              <Text style={{
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 30,
                marginTop: 30,
              }}>
                The client will receive the updated Fix Request based on your suggested changes.
                You will get a notification once the client captures a response.
              </Text>
              <Button onPress={() => {
                this.handleContinue();
              }} block>Ok</Button>
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
    passedFix: ownProps.route.params.passedFix ? ownProps.route.params.passedFix : undefined,
    cost: ownProps.route.params.cost ? ownProps.route.params.cost : '',
    comments: ownProps.route.params.comments ? ownProps.route.params.comments : undefined,
  };
}

export default connect(mapStateToProps)(FixSuggestChangesReview);

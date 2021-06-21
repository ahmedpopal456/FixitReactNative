import React from 'react';
import {
  colors,
  Divider,
  H2, Icon, Label, Spacer,
} from 'fixit-common-ui';
import { View } from 'react-native';
import {
  connect, fixRequestActions, store, StoreState, FixRequestModel,
} from 'fixit-common-data-store';
import { StackNavigationProp } from '@react-navigation/stack';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import StepIndicator from '../../../components/stepIndicator';
import StyledScrollView from '../../../components/styledElements/styledScrollView';
import Calendar from '../../../components/calendar/calendar';
import { FormTextInput, FormNextPageArrows } from '../../../components/forms/index';
import { HomeStackNavigatorProps } from '../../../common/models/navigators/homeStackNavigatorModel';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import FixRequestHeader from '../components/fixRequestHeader';
import FixRequestStyles from '../styles/fixRequestStyles';

type FixRequestScheduleStepNavigationProps = StackNavigationProp<
  HomeStackNavigatorProps,
  'FixRequestScheduleStep'
>;

export type FixRequestScheduleStepProps = {
  navigation: FixRequestScheduleStepNavigationProps,
  clientMinEstimatedCost: string,
  clientMaxEstimatedCost: string,
  fixRequestObj: FixRequestModel,
  fixStepsDynamicRoutes: {
    key:string,
  }[],
  numberOfSteps: number,
};

class FixRequestScheduleStep extends
  React.Component<FixRequestScheduleStepProps> {
    handleNextStep = () : void => {
      this.props.navigation.navigate('FixRequestReview');
    }

    render() : JSX.Element {
      return (
        <>
          <FixRequestHeader
            showBackBtn={true}
            navigation={this.props.navigation}
            screenTitle="Create a Fixit Template and your Fixit Request"
            textHeight={60}/>
          <StyledPageWrapper>
            <StepIndicator
              numberSteps={this.props.numberOfSteps}
              currentStep={4 + this.props.fixStepsDynamicRoutes.length} />
            <StyledScrollView testID='styledScrollView'>
              <StyledContentWrapper>
                <H2 style={FixRequestStyles.titleWithAction}>Availability</H2>
                <Calendar
                  startDate={
                    new Date(this.props.fixRequestObj.schedule[0].startTimestampUtc * 1000)
                  }
                  endDate={
                    new Date(this.props.fixRequestObj.schedule[0].endTimestampUtc * 1000)
                  }
                  canUpdate={true}/>
                <Spacer height="40px" />
                <H2 style={{
                  fontWeight: 'bold',
                  marginBottom: -15,
                }}>Budget</H2>
                <Divider />
                <Label style={{
                  fontWeight: 'normal',
                  marginTop: -10,
                }}>Enter your budget range</Label>
                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingTop: 20,
                  alignItems: 'center',
                }}>
                  <View style={{
                    flexGrow: 1,
                  }}>
                    <FormTextInput
                      title={'Min'}
                      numeric
                      padLeft
                      onChange={
                        (cost : string) => store
                          .dispatch(
                            fixRequestActions.setFixRequestClientMinEstimatedCost({ minimumCost: parseInt(cost, 10) }),
                          )
                      }
                      value={(this.props.clientMinEstimatedCost === '0') ? '' : this.props.clientMinEstimatedCost} />
                    <Icon library="FontAwesome5" name="dollar-sign" color={'dark'} size={20} style={{
                      marginTop: -35,
                      marginLeft: 8,
                      width: 15,
                    }}/>
                  </View>
                  <View style={{
                    width: 30,
                    margin: 10,
                    marginTop: 20,
                    height: 2,
                    backgroundColor: colors.grey,
                  }}></View>
                  <View style={{
                    flexGrow: 1,
                  }}>
                    <FormTextInput
                      title={'Max'}
                      numeric
                      padLeft
                      onChange={
                        (cost : string) => store
                          .dispatch(
                            fixRequestActions.setFixRequestClientMaxEstimatedCost({ maximumCost: parseInt(cost, 10) }),
                          )
                      }
                      value={(this.props.clientMaxEstimatedCost === '0') ? '' : this.props.clientMaxEstimatedCost} />
                    <Icon library="FontAwesome5" name="dollar-sign" color={'dark'} size={20} style={{
                      marginTop: -35,
                      marginLeft: 8,
                      width: 15,
                    }}/>
                  </View>
                </View>
              </StyledContentWrapper>
            </StyledScrollView>
          </StyledPageWrapper>
          <FormNextPageArrows mainClick={this.handleNextStep} />
        </>
      );
    }
}

function mapStateToProps(state : StoreState) {
  return {
    clientMinEstimatedCost:
        state.fixRequest.fixRequestObj.clientEstimatedCost.minimumCost.toString(),
    clientMaxEstimatedCost:
        state.fixRequest.fixRequestObj.clientEstimatedCost.maximumCost.toString(),
    fixRequestObj: {
      ...state.fixRequest.fixRequestObj,
    },
    numberOfSteps: state.fixRequest.numberOfSteps,
    fixStepsDynamicRoutes: state.fixRequest.fixStepsDynamicRoutes,
  };
}

export default connect(mapStateToProps)(FixRequestScheduleStep);

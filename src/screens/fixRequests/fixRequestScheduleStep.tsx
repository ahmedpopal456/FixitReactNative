import React from 'react';
import {
  colors,
  Divider,
  H2, Icon, Label, Spacer,
} from 'fixit-common-ui';
import { View } from 'react-native';
import {
  connect, fixRequestActions, store, StoreState, rootContext,
} from 'fixit-common-data-store';
import FormTextInput from '../../components/formTextInput';
import Calendar from '../../components/calendar';
import StyledContentWrapper from '../../components/styledElements/styledContentWrapper';
import FixRequestStyles from '../../components/styles/fixRequests/fixRequestStyles';
import FixRequestHeader from '../../components/fixRequestHeader';
import StyledPageWrapper from '../../components/styledElements/styledPageWrapper';
import StepIndicator from '../../components/stepIndicator';
import StyledScrollView from '../../components/styledElements/styledScrollView';
import FormNextPageArrows from '../../components/formNextPageArrows';
import { FixRequestScheduleStepProps } from '../../models/screens/fixRequests/fixRequestScheduleStepModel';

class FixRequestScheduleStep extends
  React.Component<FixRequestScheduleStepProps> {
    handleNextStep = () : void => {
      this.props.navigation.navigate('FixRequestReview');
    }

    render() : JSX.Element {
      return (
        <>
          <FixRequestHeader showBackBtn={true} navigation={this.props.navigation} screenTitle="Create a Fixit Template and your Fixit Request" textHeight={60}/>
          <StyledPageWrapper>
            <StepIndicator
              numberSteps={this.props.numberOfSteps}
              currentStep={4 + this.props.fixStepsDynamicRoutes.length} />
            <StyledScrollView testID='styledScrollView'>
              <StyledContentWrapper>
                <H2 style={FixRequestStyles.titleWithAction}>Availability</H2>
                <Calendar
                  startDate={
                    new Date(this.props.fixRequestObj.Schedule[0].StartTimestampUtc * 1000)
                  }
                  endDate={
                    new Date(this.props.fixRequestObj.Schedule[0].EndTimestampUtc * 1000)
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
                          .dispatch(fixRequestActions.setClientMinEstimatedCost(parseInt(cost, 10)))
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
                          .dispatch(fixRequestActions.setClientMaxEstimatedCost(parseInt(cost, 10)))
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
        state.fixRequest.fixRequestObj.ClientEstimatedCost.MinimumCost.toString(),
    clientMaxEstimatedCost:
        state.fixRequest.fixRequestObj.ClientEstimatedCost.MaximumCost.toString(),
    fixRequestObj: {
      ...state.fixRequest.fixRequestObj,
    },
    numberOfSteps: state.fixRequest.numberOfSteps,
    fixStepsDynamicRoutes: state.fixRequest.fixStepsDynamicRoutes,
  };
}

export default connect(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mapStateToProps, null, null, { context: rootContext },
)(FixRequestScheduleStep);

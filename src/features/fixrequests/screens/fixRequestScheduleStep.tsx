import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  colors,
  Divider,
  H2, Icon, Label, Spacer,
} from 'fixit-common-ui';
import { View } from 'react-native';
import {
  fixRequestActions, Schedule, store, StoreState, useDispatch, useSelector,
} from 'fixit-common-data-store';
import { useNavigation } from '@react-navigation/native';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import StepIndicator from '../../../components/stepIndicator';
import StyledScrollView from '../../../components/styledElements/styledScrollView';
import Calendar from '../../../components/calendar/calendar';
import { FormTextInput, FormNextPageArrows } from '../../../components/forms/index';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import FixRequestHeader from '../components/fixRequestHeader';
import FixRequestStyles from '../styles/fixRequestStyles';
import constants from './constants';

const FixRequestScheduleStep: FunctionComponent = () : JSX.Element => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const fixRequest = useSelector((storeState: StoreState) => storeState.fixRequest.fixRequestObj);
  const [schedules, setSchedules] = useState<Array<Schedule>>([]);

  const handleNextStep = () : void => {
    dispatch(fixRequestActions.setFixRequestSchedules(schedules));
    navigation.navigate('FixRequestReview');
  };
  const handleBackStep = (): void => {
    dispatch(fixRequestActions.setFixRequestSchedules(schedules));
    if (navigation.canGoBack()) navigation.goBack();
  };
  useEffect(() => {
    setSchedules(fixRequest.schedule || []);
  }, [fixRequest.schedule]);

  return (
    <>
      <FixRequestHeader
        showBackBtn={true}
        navigation={navigation}
        screenTitle="Create a Fixit Template and your Fixit Request"
        textHeight={60}
        backFunction={handleBackStep}/>
      <StyledPageWrapper>
        <StepIndicator
          numberSteps={constants.NUMBER_OF_STEPS}
          currentStep={5} />
        <StyledScrollView testID='styledScrollView'>
          <StyledContentWrapper>
            <H2 style={FixRequestStyles.titleWithAction}>Availability</H2>
            <Calendar
              parentSchedules={schedules}
              canUpdate={true}
              parentSetSchedules={setSchedules}
            />
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
                  value={(fixRequest.clientEstimatedCost.minimumCost === 0)
                    ? '' : fixRequest.clientEstimatedCost.minimumCost.toString()} />
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
                  value={(fixRequest.clientEstimatedCost.maximumCost === 0)
                    ? '' : fixRequest.clientEstimatedCost.maximumCost.toString()} />
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
      <FormNextPageArrows mainClick={handleNextStep} />
    </>
  );
};

export default FixRequestScheduleStep;

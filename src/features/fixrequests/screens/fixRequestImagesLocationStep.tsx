import React, { FunctionComponent, useState, useEffect } from 'react';
import { H2, P, Spacer, Divider, Icon, Label, colors } from 'fixit-common-ui';
import { TouchableOpacity, View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import {
  fixRequestActions,
  store,
  StoreState,
  useSelector,
  Schedule,
  FixRequestModel,
  SectionModel,
  AddressModel,
  UserSummaryModel,
} from 'fixit-common-data-store';

import { useNavigation } from '@react-navigation/native';
import useAsyncEffect from 'use-async-effect';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import StepIndicator from '../../../components/stepIndicator';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import GlobalStyles from '../../../common/styles/globalStyles';
import { FormTextInput, FormNextPageArrows } from '../../../components/forms/index';
import FixRequestStyles from '../styles/fixRequestStyles';
import FixRequestHeader from '../components/fixRequestHeader';
import constants from './constants';
import { FixTemplatePicker } from '../components';
import Calendar from '../../../components/calendar/calendar';
import NavigationEnum from '../../../common/enums/navigationEnum';
import { TagModel } from 'fixit-common-data-store/src/slices/fixesSlice';

interface ScheduleType {
  id: string;
  name: string;
}

interface FixRequestImagesLocationStepState {
  userAddress: AddressModel | undefined;
}

const scheduleTypes: Array<ScheduleType> = [
  { id: 'right_away', name: 'Right away' },
  { id: 'custom', name: 'Custom' },
];

const initialState = {
  userAddress: store.getState().profile?.address?.address,
};

const styles = StyleSheet.create({
  formField: {
    width: '100%',
    borderWidth: 1,
    flexShrink: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: 'black',
    marginBottom: 10,
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchIcon: {
    padding: 10,
  },
});
const FixRequestImagesLocationStep: FunctionComponent = (): JSX.Element => {
  const [state, setState] = useState<FixRequestImagesLocationStepState>(initialState);
  const user = useSelector((storeState: StoreState) => storeState.user);

  useAsyncEffect(async () => {
    setState({
      userAddress: user.savedAddresses?.find((address) => address.isCurrentAddress)?.address,
    });
  }, [user]);

  const navigation = useNavigation();
  const fixTemplate = useSelector((storeState: StoreState) => storeState.fixTemplate);
  const fixRequest = useSelector((storeState: StoreState) => storeState.fixRequest);
  const [scheduleType, setScheduleType] = useState<ScheduleType>(scheduleTypes[0]);
  const [schedules, setSchedules] = useState<Array<Schedule>>([]);

  const handleNextStep = (): void => {
    let updatedSchedules;
    if (scheduleType?.id === 'right_away') {
      const date = new Date();
      const utcTimestamp = Math.floor(date.getTime() / 1000);
      updatedSchedules = [{ startTimestampUtc: utcTimestamp, endTimestampUtc: utcTimestamp }];
    } else {
      updatedSchedules = schedules;
    }
    const updateSchedules = schedules;
    updateSchedules.forEach((updateSchedule, index) => {
      if (updateSchedule.startTimestampUtc === 0 || updateSchedule.endTimestampUtc === 0) {
        updateSchedules.splice(index, 1);
      }
    });

    store.dispatch(fixRequestActions.setFixRequestSchedules(updatedSchedules));

    const fixRequestSections: Array<SectionModel> = [];
    fixTemplate.sections?.forEach((section) => {
      const fixRequestSection = {
        name: section.name,
        details: section.fields,
      };
      fixRequestSections.push(fixRequestSection);
    });

    const tags: Array<TagModel> = [];
    fixTemplate.tags.forEach((tag) => {
      tags.push({ name: tag });
    });

    const createdByClient: UserSummaryModel = {
      id: user.userId,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      userPrincipalName: user.userPrincipalName || '',
      savedAddresses: user.savedAddresses,
      status: user.status || { status: 1, lastSeenTimestampUtc: 0 },
      role: user.role,
    };

    const updatedByUser = createdByClient;

    const fix: FixRequestModel = {
      details: {
        name: fixTemplate.name,
        category: fixTemplate.workCategory.name,
        description: fixTemplate.description,
        type: fixTemplate.workType.name,
        unit: fixTemplate.fixUnit.name,
        sections: fixRequestSections,
      },
      tags,
      clientEstimatedCost: {
        minimumCost: fixRequest.clientEstimatedCost.minimumCost,
        maximumCost: fixRequest.clientEstimatedCost.maximumCost,
      },
      schedule: updatedSchedules,
      location: state.userAddress,
      createdByClient,
      updatedByUser,
      status: 0,
    };

    navigation.navigate(NavigationEnum.FIX, { fix, title: 'Fix Request Review', id: 'fix_request' });
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
      />
      <StyledPageWrapper>
        <StepIndicator numberSteps={constants.NUMBER_OF_STEPS} currentStep={4} />
        <ScrollView>
          <StyledContentWrapper>
            <P>
              This section is not saved inside a Fixit Template. The Information are required to complete your Fixit
              Request.
            </P>
            <Spacer height="20px" />
            {/** Images */}
            <View style={GlobalStyles.flexRow}>
              <H2 style={FixRequestStyles.titleWithAction}>Images</H2>
              <TouchableOpacity style={FixRequestStyles.titleActionWrapper}>
                <Text style={FixRequestStyles.titleActionLabel}>Add</Text>
              </TouchableOpacity>
            </View>
            <Divider />
            {/** Location */}
            <View>
              <H2
                style={{
                  fontWeight: 'bold',
                  paddingBottom: 10,
                }}>
                Location
              </H2>
              <View style={styles.searchSection}>
                <TextInput
                  style={styles.formField}
                  defaultValue={state.userAddress?.formattedAddress}
                  allowFontScaling={true}
                  maxLength={30}
                  onTouchEnd={() => navigation.navigate('AddressSelector')}
                />
                <Icon style={styles.searchIcon} library="FontAwesome5" name="map-marker-alt" color={'dark'} size={30} />
              </View>
            </View>
            <Divider />
            {/** Budget */}
            <View style={{ paddingBottom: 10 }}>
              <H2
                style={{
                  fontWeight: 'bold',
                  paddingBottom: 10,
                }}>
                Budget
              </H2>
              <Label
                style={{
                  fontWeight: 'normal',
                  marginTop: -10,
                }}>
                Enter your budget range
              </Label>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingTop: 20,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexGrow: 1,
                  }}>
                  <FormTextInput
                    title={'Min'}
                    numeric
                    padLeft
                    onChange={(cost: string) =>
                      store.dispatch(
                        fixRequestActions.setFixRequestClientMinEstimatedCost({ minimumCost: parseInt(cost, 10) }),
                      )
                    }
                    value={
                      fixRequest.clientEstimatedCost.minimumCost === 0
                        ? ''
                        : fixRequest.clientEstimatedCost.minimumCost.toString()
                    }
                  />
                  <Icon
                    library="FontAwesome5"
                    name="dollar-sign"
                    color={'dark'}
                    size={20}
                    style={{
                      marginTop: -35,
                      marginLeft: 8,
                      width: 15,
                    }}
                  />
                </View>
                <View
                  style={{
                    width: 30,
                    margin: 10,
                    marginTop: 20,
                    height: 2,
                    backgroundColor: colors.grey,
                  }}></View>
                <View
                  style={{
                    flexGrow: 1,
                  }}>
                  <FormTextInput
                    title={'Max'}
                    numeric
                    padLeft
                    onChange={(cost: string) =>
                      store.dispatch(
                        fixRequestActions.setFixRequestClientMaxEstimatedCost({ maximumCost: parseInt(cost, 10) }),
                      )
                    }
                    value={
                      fixRequest.clientEstimatedCost.maximumCost === 0
                        ? ''
                        : fixRequest.clientEstimatedCost.maximumCost.toString()
                    }
                  />
                  <Icon
                    library="FontAwesome5"
                    name="dollar-sign"
                    color={'dark'}
                    size={20}
                    style={{
                      marginTop: -35,
                      marginLeft: 8,
                      width: 15,
                    }}
                  />
                </View>
              </View>
            </View>
            <Divider />
            {/** Schedules */}
            <View>
              <H2
                style={{
                  fontWeight: 'bold',
                }}>
                Schedules
              </H2>
              <FixTemplatePicker
                selectedValue={scheduleType}
                onChange={(value: ScheduleType) => setScheduleType(value)}
                values={scheduleTypes}
              />
              {scheduleType && scheduleType.id === 'custom' ? (
                <View>
                  <Spacer height="20px" />
                  <Label
                    style={{
                      fontWeight: 'normal',
                      marginTop: -10,
                    }}>
                    Choose days from which the craftsman can pick to do the job
                  </Label>
                  <Spacer height="20px" />
                  <Calendar parentSchedules={schedules} canUpdate={true} parentSetSchedules={setSchedules} />
                </View>
              ) : null}
            </View>
          </StyledContentWrapper>
        </ScrollView>
      </StyledPageWrapper>

      <FormNextPageArrows mainClick={handleNextStep} />
    </>
  );
};

export default FixRequestImagesLocationStep;

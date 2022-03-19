/* eslint-disable max-len */
import React, { FunctionComponent, useEffect, useState } from 'react';
import { TouchableOpacity, View, Image, StyleSheet, ScrollView, Text } from 'react-native';
import { Button, colors, Divider, H1, H2, Icon, Label, Spacer } from 'fixit-common-ui';
import { FixesModel, FixRequestModel, Schedule } from '../../../store';
import { useNavigation } from '@react-navigation/native';
import { FormTextInput } from '../../../components/forms/index';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import backArrowIcon from '../../../common/assets/back-icon.png';
import NavigationEnum from '../../../common/enums/navigationEnum';
import { NavigationProps } from '../../../common/types/navigationProps';
import Calendar from '../../../components/calendar/calendar';

export type FixSuggestChangesProps = {
  fix: FixesModel;
  notificationId: string;
  fixRequestObj: FixRequestModel;
};

const styles = StyleSheet.create({
  mainContainer: {
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
  },
  fixCost: {
    marginTop: -35,
    marginLeft: 8,
    width: 15,
  },
  touchableOpacity: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});

const FixSuggestChanges: FunctionComponent<NavigationProps<FixSuggestChangesProps>> = (
  props: NavigationProps<FixSuggestChangesProps>,
) => {
  const { fix, notificationId } = props.route.params;

  const navigation = useNavigation();
  const [cost, setCost] = useState<string>('');
  const [errorMesage, setErrorMessage] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [schedule, setSchedule] = useState<Array<Schedule>>(fix.schedule || []);

  useEffect(() => {
    setSchedule(fix.schedule);
  }, [fix.schedule]);

  const handleDone = (): void => {
    if (schedule.length < 1) {
      return setErrorMessage('You need to schedule your visit.');
    }
    if (cost === '') {
      return setErrorMessage('You need to specify your estimated cost before proceeding.');
    }
    setErrorMessage('');
    if (schedule.length === 1 && !schedule[0].endTimestampUtc) {
      schedule[0].endTimestampUtc = schedule[0].startTimestampUtc;
    }

    fix.schedule = schedule;
    navigation.navigate(NavigationEnum.FIXSUGGESTCHANGESREVIEW, {
      fix,
      notificationId,
      cost,
      comments,
    });
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const Header = () => {
    return (
      <>
        <TouchableOpacity style={styles.touchableOpacity} onPress={goBack}>
          <Image source={backArrowIcon} />
        </TouchableOpacity>
        <View
          style={{
            height: 60,
          }}>
          <H1>Suggest Changes</H1>
        </View>
      </>
    );
  };

  const ClientFixSchedule = () => {
    if (schedule.length === 1 && schedule[0].startTimestampUtc === schedule[0].endTimestampUtc) {
      return (
        <>
          <H2>Schedule</H2>
          <Label>
            The client wants you to fix their problem RIGHT AWAY. Please choose your start and end date if you can't
            make it.
          </Label>
          <Spacer height="20px" />
          <Calendar parentSchedules={schedule} canUpdate={true} parentSetSchedules={setSchedule} />
        </>
      );
    }
    return (
      <>
        <H2>Schedule</H2>
        <Label>Below you will see the days on which the client is available for you to come and fix his issue.</Label>
        <Spacer height="20px" />

        <Calendar parentSchedules={schedule} canUpdate={true} parentSetSchedules={setSchedule} />
      </>
    );
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <Header />
      </View>
      <StyledPageWrapper>
        <ScrollView>
          <StyledContentWrapper>
            <ClientFixSchedule />
            <Divider />
            <H2>Fix Cost</H2>
            <Label>
              {`The client is expecting the fix to cost between $${fix.clientEstimatedCost.minimumCost.toString()} and $${fix.clientEstimatedCost.maximumCost.toString()}.`}
            </Label>
            <Label>What is your cost estimate on this problem?</Label>
            <Spacer height="10px" />
            <FormTextInput numeric padLeft onChange={(value: string) => setCost(value)} value={cost} editable={true} />
            <Icon library="FontAwesome5" name="dollar-sign" color={'dark'} size={20} style={styles.fixCost} />
            <Spacer height="20px" />
            <Divider />
            <H2>Comments</H2>
            <Label>If you wish to let the client know about something, here is the place.</Label>
            <Spacer height="10px" />
            <FormTextInput
              big
              onChange={(text: string) => setComments(text)}
              value={comments}
              top={true}
              editable={true}
            />
            <Text style={{ color: 'red', textAlign: 'left', margin: 5 }}>{errorMesage}</Text>
            <Button onPress={handleDone} block>
              DONE
            </Button>
          </StyledContentWrapper>
        </ScrollView>
      </StyledPageWrapper>
    </>
  );
};

export default FixSuggestChanges;

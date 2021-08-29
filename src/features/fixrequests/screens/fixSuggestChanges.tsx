import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  TouchableOpacity, View, Image,
} from 'react-native';
import {
  Button,
  colors,
  H1,
  H2, Icon, P, Spacer,
} from 'fixit-common-ui';
import {
  StoreState, fixRequestActions, FixesModel, FixRequestModel, useDispatch, useSelector,
} from 'fixit-common-data-store';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { FormTextInput } from '../../../components/forms/index';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import StyledScrollView from '../../../components/styledElements/styledScrollView';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import Calendar from '../../../components/calendar/calendar';
import { HomeStackNavigatorProps } from '../../../common/models/navigators/homeStackNavigatorModel';
import backArrowIcon from '../../../common/assets/back-icon.png';

type FixSuggestChangesNavigationProps = StackNavigationProp<
  HomeStackNavigatorProps,
  'FixSuggestChanges'
>;

export type FixSuggestChangesProps = {
  navigation: FixSuggestChangesNavigationProps;
  passedFix: FixesModel;
  fixRequestObj: FixRequestModel,
};

const FixSuggestChanges: FunctionComponent<any> = (props) => {
  const fixRequest = useSelector((storeState: StoreState) => storeState.fixRequest.fixRequestObj);
  const { passedFix } = props.route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [cost, setCost] = useState<string>('');
  const [comments, setComments] = useState<string>('');

  useEffect(() => {
    dispatch(
      fixRequestActions.setFixStartDate({ startTimestamp: passedFix.schedule[0].startTimestampUtc }),
    );
    dispatch(
      fixRequestActions.setFixEndDate({ endTimestamp: passedFix.schedule[0].endTimestampUtc }),
    );
  }, []);

  const handleDone = (): void => {
    navigation.navigate('FixSuggestChangesReview', {
      passedFix,
      cost,
      comments,
    });
  };

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
          if (navigation.canGoBack()) {
            navigation.goBack();
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
            <Calendar
              parentSchedules={fixRequest.schedule}
              canUpdate={true}/>
            <Spacer height={'40px'} />
            <H2>Fix Cost</H2>
            <P>{`Estimated Budget ${passedFix.systemCalculatedCost.toString()}`}</P>
            <FormTextInput
              numeric
              padLeft
              onChange={
                (value : string) => setCost(value)
              }
              value={cost} />
            <Icon library="FontAwesome5" name="dollar-sign" color={'dark'} size={20} style={{
              marginTop: -35,
              marginLeft: 8,
              width: 15,
            }}/>
            <Spacer height={'40px'}/>
            <H2>Comments</H2>
            <FormTextInput big
              onChange={
                (text : string) => setComments(text)
              }
              value={comments} />
            <Spacer height={'15px'}/>
            <Button onPress={() => handleDone()} block>DONE</Button>
          </StyledContentWrapper>
        </StyledScrollView>
      </StyledPageWrapper>
    </>
  );
};

export default FixSuggestChanges;

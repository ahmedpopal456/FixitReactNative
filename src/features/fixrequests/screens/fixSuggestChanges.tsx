import React from 'react';
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
  StoreState, connect, fixRequestActions, store, FixesModel, FixRequestModel,
} from 'fixit-common-data-store';
import { StackNavigationProp } from '@react-navigation/stack';
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

class FixSuggestChanges extends
  React.Component<FixSuggestChangesProps> {
state={
  cost: '',
  comments: '',
}

componentDidMount() : void {
  store.dispatch(
    fixRequestActions.setFixStartDate({ startTimestamp: this.props.passedFix.schedule[0].startTimestampUtc }),
  );
  store.dispatch(
    fixRequestActions.setFixEndDate({ endTimestamp: this.props.passedFix.schedule[0].endTimestampUtc }),
  );
  this.forceUpdate();
}

handleDone() : void {
  this.props.navigation.navigate('FixSuggestChangesReview', {
    passedFix: this.props.passedFix,
    cost: this.state.cost,
    comments: this.state.comments,
  });
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
            <Calendar
              startDate={
                new Date(this.props.fixRequestObj.schedule[0].startTimestampUtc * 1000)

              }
              endDate={
                new Date(this.props.fixRequestObj.schedule[0].endTimestampUtc * 1000)

              }
              canUpdate={true}/>
            <Spacer height={'40px'} />
            <H2>Fix Cost</H2>
            <P>{`Estimated Budget ${this.props.passedFix.systemCalculatedCost.toString()}`}</P>
            <FormTextInput
              numeric
              padLeft
              onChange={
                (cost : string) => this.setState({ cost })
              }
              value={this.state.cost} />
            <Icon library="FontAwesome5" name="dollar-sign" color={'dark'} size={20} style={{
              marginTop: -35,
              marginLeft: 8,
              width: 15,
            }}/>
            <Spacer height={'40px'}/>
            <H2>Comments</H2>
            <FormTextInput big
              onChange={
                (text : string) => this.setState({ comments: text })
              }
              value={this.state.comments} />
            <Spacer height={'15px'}/>
            <Button onPress={() => this.handleDone()} block>DONE</Button>
          </StyledContentWrapper>
        </StyledScrollView>
      </StyledPageWrapper>
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
  };
}

export default connect(mapStateToProps)(FixSuggestChanges);

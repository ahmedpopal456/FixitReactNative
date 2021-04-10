import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PersistentState, connect } from 'fixit-common-data-store';
import FixRequestMetaStep from '../screens/fixRequests/fixRequestMetaStep';
import HomeScreenClient from '../screens/homeScreenClient';
import SearchResultsScreen from '../screens/searchResultsScreen';
import FixRequestDescriptionStep from '../screens/fixRequests/fixRequestDescriptionStep';
import FixRequestSectionsStep from '../screens/fixRequests/fixRequestSectionsStep';
import FixRequestImagesLocationStep from '../screens/fixRequests/fixRequestImagesLocationStep';
import FixRequestScheduleStep from '../screens/fixRequests/fixRequestScheduleStep';
import FixRequestReview from '../screens/fixRequests/fixRequestReview';
import FixSuggestChanges from '../screens/fixRequests/fixSuggestChanges';
import FixSuggestChangesReview from '../screens/fixRequests/fixSuggestChangesReview';
import UserRoles from '../models/users/userRolesEnum';
import HomeScreenCraftsman from '../screens/homeScreenCraftsman';

const Stack = createStackNavigator();

class HomeStackNavigator extends React.Component<any> {
  render(): JSX.Element {
    return (
      <Stack.Navigator headerMode='none'>
        {this.props.role === UserRoles.CLIENT
        && <Stack.Screen name="HomeScreen" component={HomeScreenClient} />}
        {this.props.role === UserRoles.CRAFTSMAN
        && <Stack.Screen name="HomeScreen" component={HomeScreenCraftsman} />}
        <Stack.Screen name="SearchResultsScreen" component={SearchResultsScreen} />
        <Stack.Screen name="FixRequestMetaStep" component={FixRequestMetaStep} options={{
          animationEnabled: false,
        }} />
        <Stack.Screen name="FixRequestDescriptionStep" component={FixRequestDescriptionStep} options={{
          animationEnabled: false,
        }} />
        <Stack.Screen name="FixRequestSectionsStep" component={FixRequestSectionsStep} options={{
          animationEnabled: false,
        }} />
        <Stack.Screen name="FixRequestImagesLocationStep" component={FixRequestImagesLocationStep} options={{
          animationEnabled: false,
        }} />
        <Stack.Screen name="FixRequestScheduleStep" component={FixRequestScheduleStep} options={{
          animationEnabled: false,
        }} />
        <Stack.Screen name="FixRequestReview" component={FixRequestReview} options={{
          animationEnabled: false,
        }} />
        <Stack.Screen name="FixSuggestChanges" component={FixSuggestChanges} options={{
          animationEnabled: false,
        }} />
        <Stack.Screen name="FixSuggestChangesReview" component={FixSuggestChangesReview} options={{
          animationEnabled: false,
        }} />
      </Stack.Navigator>
    );
  }
}

function mapStateToProps(state: PersistentState) {
  return {
    userId: state.user.userId,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    role: state.user.role,
    unseenNotificationsNumber: state.unseenNotificationsNumber,
  };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default connect(mapStateToProps)(HomeStackNavigator);

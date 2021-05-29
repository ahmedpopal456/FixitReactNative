import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PersistentState, connect } from 'fixit-common-data-store';
import FixRequestMetaStep from '../../features/fixrequests/screens/fixRequestMetaStep';
import HomeScreenClient from '../../screens/homeScreenClient';
import FixSearchResultsScreen from '../../features/fixrequests/screens/fixSearchResultsScreen';
import FixRequestDescriptionStep from '../../features/fixrequests/screens/fixRequestDescriptionStep';
import FixRequestSectionsStep from '../../features/fixrequests/screens/fixRequestSectionsStep';
import FixRequestImagesLocationStep from '../../features/fixrequests/screens/fixRequestImagesLocationStep';
import FixRequestScheduleStep from '../../features/fixrequests/screens/fixRequestScheduleStep';
import FixRequestReview from '../../features/fixrequests/screens/fixRequestReview';
import FixSuggestChanges from '../../features/fixrequests/screens/fixSuggestChanges';
import FixSuggestChangesReview from '../../features/fixrequests/screens/fixSuggestChangesReview';
import UserRoles from '../../common/models/users/userRolesEnum';
import HomeScreenCraftsman from '../../screens/homeScreenCraftsman';
import NotificationsScreen from '../../screens/notificationsScreen';

const Stack = createStackNavigator();

class HomeStackNavigator extends React.Component<any> {
  render(): JSX.Element {
    return (
      <Stack.Navigator headerMode='none'>
        {this.props.role === UserRoles.CLIENT
        && <Stack.Screen name="HomeScreen" component={HomeScreenClient} />}
        {this.props.role === UserRoles.CRAFTSMAN
        && <Stack.Screen name="HomeScreen" component={HomeScreenCraftsman} />}
        <Stack.Screen name="SearchResultsScreen" component={FixSearchResultsScreen} />
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
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
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

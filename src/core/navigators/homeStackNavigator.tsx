import React, { FunctionComponent } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { connect, StoreState } from 'fixit-common-data-store';
import Header from '../../components/headers/header';
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
import NotificationsScreen from '../../features/notifications/screens/notificationsScreen';

const Stack = createStackNavigator();

const HomeStackNavigator: FunctionComponent<any> = (props) => {
  const render = () : JSX.Element => (
    <Stack.Navigator
      headerMode='screen'
      screenOptions={{
        headerShown: false,
        header: ({ navigation }) => (
          <Header
            notificationsBadgeCount={props.otherProp.notificationCount}
            userRatings={props.otherProp.averageRating}
            navigation={navigation}
            userFirstName={props.otherProp.userFirstName}></Header>),
      }}>
      {props.role === UserRoles.CLIENT
         && <Stack.Screen
           name="HomeScreen"
           component={HomeScreenClient}
           options={{
             headerShown: true,
           }}/>}
      {props.role === UserRoles.CRAFTSMAN
        && <Stack.Screen
          name="HomeScreen"
          component={HomeScreenCraftsman}
          options={{
            headerShown: true,
          }} />}
      <Stack.Screen
        name="SearchResultsScreen"
        component={FixSearchResultsScreen}/>
      <Stack.Screen
        name="FixRequestMetaStep"
        component={FixRequestMetaStep}
        options={{
          animationEnabled: false,
        }} />
      <Stack.Screen
        name="FixRequestDescriptionStep"
        component={FixRequestDescriptionStep}
        options={{
          animationEnabled: false,
        }} />
      <Stack.Screen
        name="FixRequestSectionsStep"
        component={FixRequestSectionsStep}
        options={{
          animationEnabled: false,
        }} />
      <Stack.Screen
        name="FixRequestImagesLocationStep"
        component={FixRequestImagesLocationStep}
        options={{
          headerShown: false,
          animationEnabled: false,
        }} />
      <Stack.Screen
        name="FixRequestScheduleStep"
        component={FixRequestScheduleStep}
        options={{
          animationEnabled: false,
        }} />
      <Stack.Screen
        name="FixRequestReview"
        component={FixRequestReview}
        options={{
          animationEnabled: false,
        }} />
      <Stack.Screen
        name="FixSuggestChanges"
        component={FixSuggestChanges}
        options={{
          animationEnabled: false,
        }} />
      <Stack.Screen
        name="FixSuggestChangesReview"
        component={FixSuggestChangesReview}
        options={{
          animationEnabled: false,
        }} />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          animationEnabled: false,
        }}/>
    </Stack.Navigator>
  );

  return render();
};

function mapStateToProps(state: StoreState) {
  return {
    userId: state.user.userId,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    role: state.user.role,
    unseenNotificationsNumber: state.persist.unseenNotificationsNumber,
  };
}

export default connect(mapStateToProps)(HomeStackNavigator);

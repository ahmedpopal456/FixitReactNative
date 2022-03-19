import React, { FunctionComponent } from 'react';
import { connect, StoreState } from '../../store';
import { createStackNavigator } from '@react-navigation/stack';
import AddressEditionScreen from '../../screens/address/addressEditionScreen';
import Header from '../../components/headers/header';
import FixRequestMetaStep from '../../features/fixrequests/screens/fixRequestMetaStep';
import HomeScreenClient from '../../screens/home/homeScreenClient';
import FixSearchResultsScreen from '../../features/fixrequests/screens/fixSearchResultsScreen';
import FixRequestDescriptionStep from '../../features/fixrequests/screens/fixRequestDescriptionStep';
import FixRequestSectionsStep from '../../features/fixrequests/screens/fixRequestSectionsStep';
import FixRequestImagesLocationStep from '../../features/fixrequests/screens/fixRequestImagesLocationStep';
import FixSuggestChanges from '../../features/fixrequests/screens/fixSuggestChanges';
import FixRequestSuggestChangesReview from '../../features/fixrequests/screens/fixRequestSuggestChangesReview';
import UserRoles from '../../common/models/users/userRolesEnum';
import HomeScreenCraftsman from '../../screens/home/homeScreenCraftsman';
import NotificationsScreen from '../../features/notifications/screens/notificationsScreen';
import AddressSelectorScreen from '../../screens/address/addressSelectorScreen';
import { Platform } from 'react-native';
import { SupportedOSConstants } from '../../core/constants/SupportedOSConstants';
import FixRequestActions from '../../features/fixrequests/components/fixRequestActions';

const Stack = createStackNavigator();

const HomeStackNavigator: FunctionComponent<any> = (props) => {
  const render = (): JSX.Element => (
    <Stack.Navigator
      headerMode="screen"
      screenOptions={{
        headerShown: false,
        header: ({ navigation }) => (
          <Header
            userRatings={props.otherProp.averageRating}
            navigation={navigation}
            notificationsBadgeCount={props.otherProp.notificationCount}
            height={Number(SupportedOSConstants.get(Platform.OS)?.get('height'))}
            userFirstName={props.otherProp.userFirstName}
            userLastName={props.otherProp.userLastName}
            ratingCount={props.otherProp.ratingCount}
            userAddress={props.otherProp.userAddress}
            profilePictureUrl={props.otherProp.profilePictureUrl}
            userId={props.userId}
          />
        ),
      }}>
      {props.role === UserRoles.CLIENT && (
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreenClient}
          options={{
            headerShown: true,
          }}
        />
      )}
      {props.role === UserRoles.CRAFTSMAN && (
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreenCraftsman}
          options={{
            headerShown: true,
          }}
        />
      )}
      <Stack.Screen name="SearchResultsScreen" component={FixSearchResultsScreen} />
      <Stack.Screen
        name="FixRequestMetaStep"
        component={FixRequestMetaStep}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="FixRequestDescriptionStep"
        component={FixRequestDescriptionStep}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="FixRequestSectionsStep"
        component={FixRequestSectionsStep}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="FixRequestImagesLocationStep"
        component={FixRequestImagesLocationStep}
        options={{
          headerShown: false,
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="Fix"
        component={FixRequestActions}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="FixSuggestChanges"
        component={FixSuggestChanges}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="FixSuggestChangesReview"
        component={FixRequestSuggestChangesReview}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen name="AddressSelector" component={AddressSelectorScreen} />
      <Stack.Screen name="AddressDetails" component={AddressEditionScreen} />
    </Stack.Navigator>
  );

  return render();
};

function mapStateToProps(state: StoreState) {
  return {
    userId: state.user.userId,
    role: state.user.role,
  };
}

export default connect(mapStateToProps)(HomeStackNavigator);

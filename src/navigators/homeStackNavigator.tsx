import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FixRequestMetaStep from '../screens/fixRequests/fixRequestMetaStep';
import HomeScreen from '../screens/homeScreen';
import SearchResultsScreen from '../screens/searchResultsScreen';
import FixRequestDescriptionStep from '../screens/fixRequests/fixRequestDescriptionStep';
import FixRequestSectionsStep from '../screens/fixRequests/fixRequestSectionsStep';
import FixRequestImagesLocationStep from '../screens/fixRequests/fixRequestImagesLocationStep';
import FixRequestScheduleStep from '../screens/fixRequests/fixRequestScheduleStep';
import FixRequestReview from '../screens/fixRequests/fixRequestReview';
import CraftsmanHomeScreen from '../screens/craftsmenHomeScreen';

const Stack = createStackNavigator();

function HomeStackNavigator() : JSX.Element {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name="CraftsmanHomeScreen" component = {CraftsmanHomeScreen}/>
      {/* //<Stack.Screen name="HomeScreen" component={HomeScreen} /> */}
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
    </Stack.Navigator>
  );
}

export default HomeStackNavigator;

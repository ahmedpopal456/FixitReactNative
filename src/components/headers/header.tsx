import React, { FunctionComponent } from 'react';
import {
  Text, View, TouchableOpacity,
} from 'react-native';
import { colors, NotificationBell } from 'fixit-common-ui';
import { Rating } from 'react-native-ratings';
import { HeaderProps } from './headerProps';
import ViewWrapper from './style';

const Header: FunctionComponent<HeaderProps> = (props) => {
  const render = () : JSX.Element => (
    <ViewWrapper {...props}>
      <View>
        <Text style={{
          marginTop: 15, marginLeft: 15, marginRight: 15, fontSize: 15,
        }}>{props.title},</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ marginLeft: 15, fontSize: 25, fontWeight: 'bold' }}>{props.userFirstName}</Text>
          {props.userRatings !== undefined ? (
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Ratings')}>
              <Rating
                style={{ marginLeft: 15, marginTop: 10 }}
                type='custom'
                ratingColor={'white'}
                ratingBackgroundColor={'gray'}
                tintColor={'#FFD14A'}
                readonly={true}
                startingValue={props.userRatings}
                imageSize={20}
              />
            </TouchableOpacity>
          )
            : (<></>)}
          <Text style={{ marginLeft: 5, marginTop: 13, fontStyle: 'italic' }}>{props.userRatings?.toFixed(1)}</Text>
        </View>
      </View>
      {props.notificationsBadgeCount !== undefined ? (
        <NotificationBell
          notifications={props.notificationsBadgeCount}
          onPress={() => props.navigation.navigate('Notifications')}
        />) : (<></>)}
    </ViewWrapper>);

  return render();
};

Header.defaultProps = {
  backgroundColor: colors.accent,
  height: 100,
  title: 'Hello',
  userRatings: undefined,
  notificationsBadgeCount: 0,
  userFirstName: 'Joanna',
};

export default Header;

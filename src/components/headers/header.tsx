import React, { FunctionComponent } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { colors, Icon, NotificationBell } from 'fixit-common-ui';
import { Rating } from 'react-native-ratings';
import { HeaderProps } from './headerProps';
import ViewWrapper from './style';
import { UserProfileAvatar } from '../UserProfileAvatar';

const styles = StyleSheet.create({
  searchSection: {
    width: '75%',
    marginTop: 25,
    marginLeft: 10,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    height: '21%',
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    width: '100%',
    flexShrink: 1,
    textAlign: 'left',
    color: colors.dark,
  },
  profileSection: {
    flexDirection: 'column',
    marginLeft: 10,
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'flex-start',
    height: '55%',
  },
});

// TODO: Move address search in its own component for re-usability
const Header: FunctionComponent<HeaderProps> = (props) => {
  const render = (): JSX.Element => (
    <ViewWrapper {...props}>
      <View style={styles.searchSection} onTouchEnd={() => props.navigation.navigate('AddressSelector')}>
        <Icon style={styles.searchIcon} library="FontAwesome5" name="map-marker-alt" color={'dark'} size={20} />
        <TextInput
          style={styles.input}
          defaultValue={props.userAddress?.address?.formattedAddress}
          allowFontScaling={true}
          maxLength={30}
        />
      </View>
      {props?.notificationsBadgeCount !== undefined ? (
        <NotificationBell
          notifications={props?.notificationsBadgeCount}
          onPress={() => props.navigation.navigate('Notifications')}
        />
      ) : (
        <></>
      )}
      <View style={styles.profileSection}>
        <View>
          <UserProfileAvatar
            isEditable={false}
            size={80}
            nameAbbrev={`${props.userFirstName?.charAt(0)}${props.userLastName?.charAt(0)}`}
            profilePictureUrl={props.profilePictureUrl}
            userId={props.userId}
          />
        </View>
        <Text
          style={{
            height: '30%',
            fontSize: 25,
            marginLeft: 10,
          }}>
          {props.userFirstName} {props.userLastName}
        </Text>
        <View style={{ width: '80%', flexDirection: 'row' }}>
          {props.userRatings !== undefined ? (
            <TouchableOpacity onPress={() => props.navigation.navigate('Ratings')}>
              <Rating
                style={{ marginLeft: 10, marginTop: 5 }}
                type="custom"
                ratingColor={'white'}
                ratingBackgroundColor={'gray'}
                tintColor={'#FFD14A'}
                readonly={true}
                startingValue={props.userRatings}
                imageSize={15}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
          <Text
            style={{
              fontSize: 10,
              marginLeft: 5,
              marginTop: 8,
              fontStyle: 'italic',
            }}>{`${props.ratingCount} reviews`}</Text>
        </View>
      </View>
    </ViewWrapper>
  );

  return render();
};

Header.defaultProps = {
  backgroundColor: colors.accent,
  height: 180,
  title: 'Hello',
  userRatings: undefined,
  ratingCount: 0,
  notificationsBadgeCount: 0,
  userFirstName: '',
  userLastName: '',
  profilePictureUrl: '',
  userAddress: {
    id: '',
    isCurrentAddress: false,
    aptSuiteFloor: '',
    label: '',
    address: {
      AddressComponents: [],
      formattedAddress: '',
    },
  },
};

export default Header;

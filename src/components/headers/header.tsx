import React, { FunctionComponent } from 'react';
import {
  Text, View, TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { colors, Icon, NotificationBell } from 'fixit-common-ui';
import { Rating } from 'react-native-ratings';
import { Avatar } from 'react-native-elements';
import { HeaderProps } from './headerProps';
import ViewWrapper from './style';

const styles = StyleSheet.create({
  searchSection: {
    width: '70%',
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

const Header: FunctionComponent<HeaderProps> = (props) => {
  const render = () : JSX.Element => (
    <ViewWrapper {...props}>
      <View style={styles.searchSection}>
        <Icon style={styles.searchIcon} library="FontAwesome5" name="map-marker-alt" color={'dark'} size={20}/>
        <TextInput
          style={styles.input}
          defaultValue="1175 Place du Frere Andre"
          allowFontScaling={true}
          maxLength={30}
          onTouchEnd={() => props.navigation.navigate('AddressSelector')}
        />
      </View>
      {props.notificationsBadgeCount !== undefined ? (
        <NotificationBell
          notifications={props.notificationsBadgeCount}
          onPress={() => props.navigation.navigate('Notifications')}
        />) : (<></>)}
      <View style={styles.profileSection}>
        <Avatar
          size={80}
          rounded
          title={`${props.userFirstName?.charAt(0)}${props.userLastName?.charAt(0)}`}
          titleStyle={{ color: 'black' }}
          activeOpacity={0.7}
          avatarStyle={{ resizeMode: 'cover', backgroundColor: '#EEEEEE', opacity: 0.75 }}
        />
        <Text style={{
          height: '30%',
          fontSize: 25,
          marginLeft: 10,
        }}>{props.userFirstName} {props.userLastName}</Text>
        <View style={{ width: '80%', flexDirection: 'row' }}>
          {props.userRatings !== undefined ? (
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Ratings')}>
              <Rating
                style={{ marginLeft: 10, marginTop: 5 }}
                type='custom'
                ratingColor={'white'}
                ratingBackgroundColor={'gray'}
                tintColor={'#FFD14A'}
                readonly={true}
                startingValue={props.userRatings}
                imageSize={15}
              />
            </TouchableOpacity>
          )
            : (<></>)}
          <Text style={{
            fontSize: 10,
            marginLeft: 5,
            marginTop: 8,
            fontStyle: 'italic',
          }}>{`${props.ratingCount} reviews`}</Text>
        </View>
      </View>

    </ViewWrapper>);

  return render();
};

Header.defaultProps = {
  backgroundColor: colors.accent,
  height: 180,
  title: 'Hello',
  userRatings: undefined,
  ratingCount: 0,
  notificationsBadgeCount: 0,
  userFirstName: 'Joanna',
  userLastName: 'Lin',
};

export default Header;

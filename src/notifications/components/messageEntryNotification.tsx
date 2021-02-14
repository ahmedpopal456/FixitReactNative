import React from 'react';
import {View} from 'react-native';
import {NotificationComponent} from './notification';

export class MessageEntryNotification extends NotificationComponent {
  constructor(props: unknown | Readonly<unknown>) {
    super(props);
  }

  render() {
    return <View />;
  }
}

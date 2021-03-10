jest.mock('../../src/services/notificationService');

import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import {store, notificationActions} from 'fixit-common-data-store';
import NotificationHandler from '../../src/handlers/notificationHandler';


describe('Notification Handler', () => {

  it('should not displayNotification if invalid', () => {
    const handler = NotificationHandler.getInstance();
    const badNotification = {};
    expect(() => handler.displayNotification(badNotification)).toThrowError();
  });

  it('should displayNotification', () => {
    const handler = NotificationHandler.getInstance();
    spyOn(store, 'dispatch');

    const goodNotification: FirebaseMessagingTypes.RemoteMessage = {
      messageId: 'id',
      notification: {
        title: 'title'
      }
    };

    handler.displayNotification(goodNotification);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(
      notificationActions.default.displayNotification(goodNotification)
    );
  });

  it('should handle foreground notifications', () => {
    const handler = NotificationHandler.getInstance();

    spyOn(handler, 'displayNotification');

    const notification: FirebaseMessagingTypes.RemoteMessage = {
      messageId: 'id',
      notification: {
        title: 'title'
      }
    };

    handler.onForegroundNotification(notification);

    // TODO: add expectations when method is implemented
    expect(handler.displayNotification).toHaveBeenCalledTimes(1);
  });

  it('should handle background notifications', () => {
    const handler = NotificationHandler.getInstance();

    const notification: FirebaseMessagingTypes.RemoteMessage = {
      messageId: 'id',
      notification: {
        title: 'title'
      }
    };

    handler.onBackgroundNotification(notification);

    // TODO: add expectations when method is implemented
  });

  it('should handle background notifications being opened', () => {
    const handler = NotificationHandler.getInstance();

    spyOn(handler, 'displayNotification');

    const notification: FirebaseMessagingTypes.RemoteMessage = {
      messageId: 'id',
      notification: {
        title: 'title'
      }
    };

    handler.onBackgroundNotificationOpened(notification);

    // TODO: add expectations when method is implemented
    expect(handler.displayNotification).toHaveBeenCalledTimes(1);
  });

  it('should register device if it is not registered', async () => {

    const handler = NotificationHandler.getInstance();
    // TODO: figure out how to mock the state
    await handler.registerDevice();

  });
});

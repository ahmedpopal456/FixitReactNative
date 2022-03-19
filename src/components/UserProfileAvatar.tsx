import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Asset } from 'react-native-image-picker';
import { store, UserService } from '../store';
import { CameraAndImage } from './CameraAndImage';
import useAsyncEffect from 'use-async-effect';
import FileManagementService from '../core/services/file/fileManagementService';
import { colors } from 'fixit-common-ui';
import Logger from '../logger';
import config from '../core/config/appConfig';

const userService = new UserService(config, store);

interface UserProfileAvatarProps {
  isEditable: boolean;
  size?: number;
  nameAbbrev: string;
  userId: string;
  profilePictureUrl: string | undefined;
}

const fileManagementService = new FileManagementService();

export const UserProfileAvatar: FunctionComponent<PropsWithChildren<UserProfileAvatarProps>> = (
  props: UserProfileAvatarProps,
): JSX.Element => {
  const { isEditable, size, nameAbbrev, userId, profilePictureUrl } = props;
  const [asset, setAsset] = useState<Asset & { isUploaded: boolean }>();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const setErrorMesssageWithTime = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  };

  useAsyncEffect(async () => {
    if (asset && isEditable) {
      try {
        setIsUploading(true);
        const response = await fileManagementService.uploadFile(userId as string, asset, 'users');
        await userService.updateUserProfilePicture(userId, decodeURIComponent(response.imageUrl.url));
        setAsset(undefined);
        setIsUploading(false);
      } catch (e: any) {
        console.log(JSON.stringify(e));
        setErrorMesssageWithTime(e.message);
        Logger.instance.trackException({ exception: e.error });
        setIsUploading(false);
      }
    }
  }, [asset]);

  return (
    <>
      <Text
        style={{
          color: colors.dark,
          textAlign: 'center',
          width: '100%',
          height: errorMessage ? 40 : 0,
          paddingTop: 10,
          backgroundColor: `${errorMessage ? colors.error : colors.transparent}`,
        }}>
        {errorMessage}
      </Text>
      <View style={{ flexDirection: 'column' }}>
        <View style={{ alignItems: 'center' }}>
          {isUploading ? (
            <ActivityIndicator style={{ width: 150, height: 150 }} color={colors.accent} size="large" />
          ) : (
            <Avatar
              size={size ? 80 : 'xlarge'}
              rounded
              icon={{ name: 'user', color: '#FFD14A', type: 'font-awesome' }}
              source={profilePictureUrl?.length ? { uri: profilePictureUrl } : { uri: 'asdas' }}
              title={nameAbbrev}
            />
          )}
        </View>
        {isEditable ? (
          <View style={{ width: '100%' }}>
            <CameraAndImage setAsset={setAsset} setErrorMessage={setErrorMessage} buttonText={'Edit profile picture'} />
          </View>
        ) : (
          <></>
        )}
      </View>
    </>
  );
};

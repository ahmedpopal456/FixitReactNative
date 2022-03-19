import React, { Dispatch, FunctionComponent, PropsWithChildren, SetStateAction } from 'react';
import { Button } from 'fixit-common-ui';
import { Asset, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';

interface CameraAndImageProps {
  assets?: Array<Asset & { isUploaded: boolean }>;
  setAssets?: Dispatch<SetStateAction<Array<Asset & { isUploaded: boolean }>>>;
  setAsset?: Dispatch<SetStateAction<(Asset & { isUploaded: boolean }) | undefined>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  buttonText: string;
  selectionLimit?: number;
}

interface AssetsWithIsUploaded extends Asset {
  isUploaded: boolean;
}

export const CameraAndImage: FunctionComponent<PropsWithChildren<CameraAndImageProps>> = (
  props: CameraAndImageProps,
): JSX.Element => {
  const { assets, setAssets, setAsset, setErrorMessage, buttonText, selectionLimit } = props;
  const { showActionSheetWithOptions } = useActionSheet();

  const launch = async (isCamera: boolean) => {
    const response: ImagePickerResponse = await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (isCamera) {
          resolve(launchCamera({ mediaType: 'photo', includeBase64: true, quality: 0.5 }));
        } else {
          resolve(
            launchImageLibrary({
              mediaType: 'photo',
              selectionLimit: selectionLimit ? selectionLimit : 0,
              includeBase64: true,
              quality: 0.5,
            }),
          );
        }
      }, 200);
    });

    if (response.errorCode) {
      setErrorMessage(response.errorMessage || 'something went wrong while lauching your camera');
    }
    if (assets && setAssets) {
      let assetsWithIsUploaded: Array<AssetsWithIsUploaded> = [];
      response.assets?.forEach((responseAsset) => {
        assetsWithIsUploaded.push({ ...responseAsset, isUploaded: false });
      });
      const assetsUpdate = [...assets];
      if (assetsWithIsUploaded) {
        assetsUpdate.push(...assetsWithIsUploaded);
      }

      setAssets(assetsUpdate);
    } else if (setAsset) {
      if (response.assets) {
        setAsset({ ...response.assets[0], isUploaded: false });
      }
    }
  };

  const onPress = async () => {
    showActionSheetWithOptions(
      {
        options: ['Select from gallery', 'Take picture', 'Cancel'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 2,
        userInterfaceStyle: 'dark',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          launch(false);
        } else if (buttonIndex === 1) {
          launch(true);
        } else if (buttonIndex === 2) {
          // Do nothing
        }
      },
    );
  };

  return (
    <>
      <Button onPress={onPress} key={'add image'}>
        {buttonText}
      </Button>
    </>
  );
};

import { ImageModel } from 'fixit-common-data-store';
import { colors, Button } from 'fixit-common-ui';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { StyleSheet, View, Image, Pressable, Text } from 'react-native';
import { Asset } from 'react-native-image-picker';
import FileManagementService, { UploadFileResponse } from '../core/services/file/fileManagementService';
import Logger from '../logger';
import ProgressIndicatorFactory from './progressIndicators/progressIndicatorFactory';

interface DeletableCameraAssetsProps {
  fixId?: string;
  assets?: Array<Asset & { isUploaded: boolean }>;
  setAssets?: React.Dispatch<React.SetStateAction<Array<Asset & { isUploaded: boolean }>>>;
  uploadedFiles?: Array<UploadFileResponse>;
  setUploadedFiles?: React.Dispatch<React.SetStateAction<Array<UploadFileResponse>>>;
  assetToFile?: { [key: string]: string };
  setassetToFile?: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  isUploading?: { [key: string]: boolean };
  files?: Array<ImageModel>;
}

const fileManagementService = new FileManagementService();
export const DeletableCameraAssets: FunctionComponent<PropsWithChildren<DeletableCameraAssetsProps>> = (
  props: DeletableCameraAssetsProps,
): JSX.Element => {
  const { assets, setAssets, assetToFile, fixId, uploadedFiles, setUploadedFiles, isUploading, files } = props;
  const [uriOfAssetsToDelete, setUriOfAssetsToDelete] = useState<Array<string>>([]);
  const [shouldDeleteImage, setShouldDeleteImage] = useState<{ [key: string]: boolean }>({});
  const [isDeleting, setIsDeleting] = useState<{ [key: string]: boolean }>({});
  const [isImageLoading, setIsImageLoading] = useState<{ [key: string]: boolean }>({});
  const [isImageDownloadStillInProgress, setIsImageDownloadStillInProgress] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  const addOrRemoveUriOfAssetsToDelete = (uri: string) => {
    let updateUriOfAssetsToDelete = [...uriOfAssetsToDelete];
    const uriOfAssetsToDeleteIndex = updateUriOfAssetsToDelete.indexOf(uri);

    if (uriOfAssetsToDeleteIndex === -1) {
      updateUriOfAssetsToDelete.push(uri);
      if (updateUriOfAssetsToDelete.length) {
        setDisabled(false);
      }
      setUriOfAssetsToDelete(updateUriOfAssetsToDelete);
      setShouldDeleteImage({
        ...shouldDeleteImage,
        [uri]: true,
      });
    }
    if (uriOfAssetsToDeleteIndex > -1) {
      updateUriOfAssetsToDelete.splice(uriOfAssetsToDeleteIndex, 1);

      if (!updateUriOfAssetsToDelete.length) {
        setDisabled(true);
      }
      setUriOfAssetsToDelete(updateUriOfAssetsToDelete);
      setShouldDeleteImage({
        ...shouldDeleteImage,
        [uri]: false,
      });
    }
  };

  const DeleteButton = () => {
    if (assets && assets.length && !files) {
      return (
        <Button
          onPress={async () => {
            setDisabled(true);
            deleteSelectedFiles();
          }}
          disabled={disabled}>
          Delete selected images
        </Button>
      );
    } else {
      return <></>;
    }
  };

  const deleteSelectedFiles = async () => {
    if (assets && setAssets && uploadedFiles && setUploadedFiles && assetToFile && fixId) {
      let updateAssets = [...assets];
      let updateUploadedFiles = [...uploadedFiles];
      for (const uriOfAssetToDelete of uriOfAssetsToDelete) {
        try {
          setIsDeleting({
            ...isDeleting,
            [uriOfAssetToDelete]: true,
          });
          const fileCreatedId = assetToFile[uriOfAssetToDelete];
          await fileManagementService.deleteFile(fixId, fileCreatedId);

          // delete asset from assets
          const tempUpdateAssets: Array<Asset & { isUploaded: boolean }> = [];
          updateAssets.forEach((updateAsset) => {
            if (updateAsset.uri !== uriOfAssetToDelete) {
              tempUpdateAssets.push(updateAsset);
            }
          });
          updateAssets = tempUpdateAssets;
          // delete file from upload files
          const tempUpdateUploadedFiles: Array<UploadFileResponse> = [];
          updateUploadedFiles.forEach((updateUploadedFile) => {
            if (updateUploadedFile.fileCreatedId !== fileCreatedId) {
              tempUpdateUploadedFiles.push(updateUploadedFile);
            }
          });
          updateUploadedFiles = tempUpdateUploadedFiles;

          let updateIsDelete = isDeleting;
          delete updateIsDelete[uriOfAssetToDelete];
          setIsDeleting({ ...updateIsDelete });
        } catch (e: any) {
          Logger.instance.trackException({ exception: e });
        }
      }

      let updateUriOfAssetsToDelete = uriOfAssetsToDelete;
      let i = updateUriOfAssetsToDelete.length;

      while (i--) {
        const uriOfAssetsToDeleteIndex = updateUriOfAssetsToDelete.indexOf(updateUriOfAssetsToDelete[i]);
        if (uriOfAssetsToDeleteIndex > -1) {
          updateUriOfAssetsToDelete.splice(uriOfAssetsToDeleteIndex, 1);

          if (updateUriOfAssetsToDelete.length === 0) {
            setDisabled(true);
          }
        }
      }

      setUriOfAssetsToDelete(updateUriOfAssetsToDelete);
      setUploadedFiles(updateUploadedFiles);
      setAssets(updateAssets);
    }
  };

  return (
    <View style={{ flexDirection: 'row', flexGrow: 1, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
      {files && files.length ? (
        files.map((file) => (
          <View key={`view-${file.url}`}>
            <Image
              onLoadStart={() => setIsImageLoading({ ...isImageLoading, [file.url]: true })}
              onLoadEnd={() => {
                const updateIsImageLoading = { ...isImageLoading, [file.url]: false };
                let updateIsImageDownloadStillInProgress = false;
                for (let value of Object.values(updateIsImageLoading)) {
                  if (value) {
                    updateIsImageDownloadStillInProgress = true;
                  }
                }
                setIsImageDownloadStillInProgress(updateIsImageDownloadStillInProgress);
                setIsImageLoading({ ...isImageLoading, [file.url]: false });
              }}
              key={file.url}
              resizeMode="cover"
              resizeMethod="scale"
              style={{
                width: 100,
                height: 100,
                margin: 2,
                borderRadius: 10,
              }}
              source={{ uri: decodeURIComponent(file.url) }}
            />
          </View>
        ))
      ) : assets && assets.length ? (
        assets.map(({ uri }) => (
          <View key={`view-${uri}`}>
            {(isUploading && isUploading[uri as string]) || (isDeleting && isDeleting[uri as string]) ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 100,
                  height: 100,
                  backgroundColor: colors.light,
                  borderRadius: 10,
                }}>
                <ProgressIndicatorFactory
                  type="indeterminate"
                  children={{
                    indicatorType: 'circular',
                    color: colors.orange,
                  }}
                />
              </View>
            ) : (
              <Pressable onPress={() => addOrRemoveUriOfAssetsToDelete(uri as string)}>
                <Image
                  key={uri}
                  resizeMode="cover"
                  resizeMethod="scale"
                  style={{
                    width: 100,
                    height: 100,
                    margin: 2,
                    borderRadius: 10,
                    opacity: shouldDeleteImage[uri as string] ? 0.5 : 1,
                  }}
                  source={{ uri: uri }}
                />
              </Pressable>
            )}
          </View>
        ))
      ) : (
        <></>
      )}
      <DeleteButton />
    </View>
  );
};

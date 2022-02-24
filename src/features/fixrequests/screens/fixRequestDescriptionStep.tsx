import React, { FunctionComponent, useState, useEffect } from 'react';
import { P, Spacer, colors, H2 } from 'fixit-common-ui';
import { store, StoreState, useSelector, fixTemplateActions, ImageModel } from 'fixit-common-data-store';
import { useNavigation } from '@react-navigation/native';
import { FormNextPageArrows } from '../../../components/forms';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import { StepIndicator } from '../../../components/index';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import FixRequestHeader from '../components/fixRequestHeader';
import { FixTemplateFormTextInput } from '../components';
import constants from './constants';
import { Pressable, ScrollView, Text, View } from 'react-native';
import NavigationEnum from '../../../common/enums/navigationEnum';
import { Asset } from 'react-native-image-picker';
import FileManagementService, { UploadFileResponse } from '../../../core/services/file/fileManagementService';
import { v4 as uuidv4 } from 'uuid';
import Logger from '../../../logger';
import { FixitError } from '../../../common/FixitError';
import useAsyncEffect from 'use-async-effect';
import { CameraAndImage } from '../../../components/CameraAndImage';
import GlobalStyles from '../../../common/styles/globalStyles';
import FixRequestStyles from '../styles/fixRequestStyles';
import { DeletableCameraAssets } from '../../../components/DeletableCameraAssets';

const fileManagementService = new FileManagementService();

const FixRequestDescriptionStep: FunctionComponent = (): JSX.Element => {
  const navigation = useNavigation();
  const [fixId, setFixId] = useState<string>('');
  const fixTemplate = useSelector((storeState: StoreState) => storeState.fixTemplate);
  const [description, setDescription] = useState<string>(fixTemplate.description);
  const [assets, setAssets] = useState<Array<Asset & { isUploaded: boolean }>>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Array<UploadFileResponse>>([]);
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [assetToFile, setAssetToFile] = useState<{ [key: string]: string }>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!fixId) {
      setFixId(uuidv4());
    }
  }, []);

  const setErrorMesssageWithTime = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  };

  useEffect(() => {
    setDescription(fixTemplate.description);
  }, [fixTemplate.description]);

  const uploadFiles = async () => {
    const tempAssets = [...assets];
    let updateAssetToFile = assetToFile;
    const tempUploadedFiles = [...uploadedFiles];
    let i = tempAssets.length;

    while (i--) {
      try {
        if (!tempAssets[i].isUploaded) {
          const uri = tempAssets[i].uri as string;
          setIsUploading({
            ...isUploading,
            [uri]: true,
          });

          const uploadedFile = await fileManagementService.uploadFile(fixId, tempAssets[i]);
          tempAssets[i].isUploaded = true;
          updateAssetToFile = {
            ...updateAssetToFile,
            [tempAssets[i].uri as string]: uploadedFile.fileCreatedId,
          };
          tempUploadedFiles.push(uploadedFile);
          let updateisUploading = isUploading;
          delete updateisUploading[uri];
          setIsUploading({
            ...updateisUploading,
          });
        }
      } catch (e: any & FixitError) {
        tempAssets.splice(i, 1);
        setErrorMesssageWithTime(e.message);
        Logger.instance.trackException({ exception: e.error });
      }
    }
    setUploadedFiles(tempUploadedFiles);
    setAssetToFile(updateAssetToFile);
    setAssets(tempAssets);
  };

  useAsyncEffect(async () => {
    if (fixId) {
      await uploadFiles();
    }
  }, [assets.length]);

  const handleContinue = (): void => {
    store.dispatch(
      fixTemplateActions.updateFixTemplate({
        description,
      }),
    );
    const images: Array<ImageModel> = [];
    uploadedFiles.forEach((uploadedFile) => {
      images.push({
        id: uploadedFile.fileCreatedId,
        url: uploadedFile.imageUrl.url.toString(),
        metadata: {
          createdTimeStampUTC: uploadedFile.fileCreatedTimestampUtc,
          updatedTimeStampUTC: uploadedFile.fileCreatedTimestampUtc,
        },
        name: uploadedFile.fileCreatedName,
      });
    });

    navigation.navigate(NavigationEnum.FIXREQUESTIMAGESLOCATIONSTEP, { fixId, images });
  };

  // const nextPageOptions = [
  //   {
  //     label: 'Save Fixit Template & Continue',
  //     onClick: handleContinue,
  //   },
  //   {
  //     label: 'Go to first fix section',
  //     onClick: () => {
  //       store.dispatch(fixTemplateActions.updateFixTemplate({ description }));
  //       navigation.navigate(NavigationEnum.FIXREQUESTSECTIONSSTEP);
  //     },
  //   },
  // ];

  const render = (): JSX.Element => (
    <>
      <FixRequestHeader
        showBackBtn={true}
        navigation={navigation}
        screenTitle="Create your Fixit request"
        backFunction={async () => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
          await fileManagementService.deleteDirectoryByFixId(fixId);
        }}
      />
      <StyledPageWrapper>
        <StepIndicator numberSteps={constants.NUMBER_OF_STEPS} currentStep={2} />
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
        <CameraAndImage
          assets={assets}
          setAssets={setAssets}
          modalVisible={modalVisible}
          setErrorMessage={setErrorMessage}
          setModalVisible={setModalVisible}
        />
        <ScrollView style={{ flexGrow: 1 }}>
          <StyledContentWrapper>
            <FixTemplateFormTextInput
              header={'Fix Description'}
              big={true}
              top={true}
              onChange={(text: string) => setDescription(text)}
              value={description}
              editable={true}
            />
            <Spacer height="20px" />
            <View style={[GlobalStyles.flexRow, { marginBottom: 5 }]}>
              <H2 style={FixRequestStyles.titleWithAction}>Images</H2>
              <Pressable style={FixRequestStyles.titleActionWrapper} onPress={() => setModalVisible(true)}>
                <Text style={FixRequestStyles.titleActionLabel}>Add</Text>
              </Pressable>
            </View>
            <View style={{ flexDirection: 'row', flexGrow: 1, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              <DeletableCameraAssets
                fixId={fixId}
                assets={assets}
                setAssets={setAssets}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                assetToFile={assetToFile}
                setassetToFile={setAssetToFile}
                isUploading={isUploading}
              />
            </View>
          </StyledContentWrapper>
        </ScrollView>
      </StyledPageWrapper>

      <FormNextPageArrows mainClick={handleContinue} />
    </>
  );
  return render();
};

export default FixRequestDescriptionStep;

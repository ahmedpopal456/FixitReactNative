import React, { FunctionComponent, useState, useEffect } from 'react';
import { H2, P, Spacer, Divider, Icon, Label, colors, Button } from 'fixit-common-ui';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import {
  fixRequestActions,
  store,
  StoreState,
  useSelector,
  Schedule,
  FixRequestModel,
  SectionModel,
  AddressModel,
  UserSummaryModel,
  ImageModel,
} from 'fixit-common-data-store';
import { useNavigation } from '@react-navigation/native';
import useAsyncEffect from 'use-async-effect';
import StepIndicator from '../../../components/stepIndicator';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import GlobalStyles from '../../../common/styles/globalStyles';
import { FormTextInput, FormNextPageArrows } from '../../../components/forms/index';
import FixRequestStyles from '../styles/fixRequestStyles';
import FixRequestHeader from '../components/fixRequestHeader';
import constants from './constants';
import { FixTemplatePicker } from '../components';
import Calendar from '../../../components/calendar/calendar';
import NavigationEnum from '../../../common/enums/navigationEnum';
import { TagModel } from 'fixit-common-data-store/src/slices/fixesSlice';
import { Asset } from 'react-native-image-picker';
import { CameraAndImage } from '../../../components/CameraAndImage';
import { v4 as uuidv4 } from 'uuid';
import FileManagementService, { UploadFileResponse } from '../../../core/services/file/fileManagementService';
import Logger from '../../../logger';
import { FixitError } from '../../../common/FixitError';
import { DeletableCameraAssets } from '../../../components/DeletableCameraAssets';

interface ScheduleType {
  id: string;
  name: string;
}

interface FixRequestImagesLocationStepState {
  userAddress: AddressModel | undefined;
}

const scheduleTypes: Array<ScheduleType> = [
  { id: 'right_away', name: 'Right away' },
  { id: 'custom', name: 'Custom' },
];

const initialState = {
  userAddress: store.getState().profile?.address?.address,
};

const styles = StyleSheet.create({
  formField: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: 'black',
    marginBottom: 10,
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchIcon: {
    padding: 10,
  },
});

const fileManagementService = new FileManagementService();

const FixRequestImagesLocationStep: FunctionComponent = (): JSX.Element => {
  const navigation = useNavigation();
  const user = useSelector((storeState: StoreState) => storeState.user);
  const fixRequest = useSelector((storeState: StoreState) => storeState.fixRequest);
  const fixTemplate = useSelector((storeState: StoreState) => storeState.fixTemplate);

  const [fixId, setFixId] = useState<string>('');
  const [state, setState] = useState<FixRequestImagesLocationStepState>(initialState);
  const [scheduleTypeName, setScheduleTypeName] = useState<string>(scheduleTypes[0].name);
  const [scheduleType, setScheduleType] = useState<ScheduleType>(scheduleTypes[0]);
  const [schedules, setSchedules] = useState<Array<Schedule>>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [assets, setAssets] = useState<Array<Asset & { isUploaded: boolean }>>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Array<UploadFileResponse>>([]);
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [assetToFile, setAssetToFile] = useState<{ [key: string]: string }>({});

  const setErrorMesssageWithTime = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  };

  useEffect(() => {
    if (!fixId) {
      setFixId(uuidv4());
    }
  }, []);

  useAsyncEffect(async () => {
    setState({
      userAddress: user.savedAddresses?.find((address) => address.isCurrentAddress)?.address,
    });
  }, [user]);

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

  const handleNextStep = (): void => {
    let updatedSchedules;
    if (scheduleType?.id === 'right_away') {
      const date = new Date();
      const utcTimestamp = Math.floor(date.getTime() / 1000);
      updatedSchedules = [{ startTimestampUtc: utcTimestamp, endTimestampUtc: utcTimestamp }];
    } else {
      updatedSchedules = schedules;
    }
    const updateSchedules = schedules;
    updateSchedules.forEach((updateSchedule, index) => {
      if (updateSchedule.startTimestampUtc === 0 || updateSchedule.endTimestampUtc === 0) {
        updateSchedules.splice(index, 1);
      }
    });

    store.dispatch(fixRequestActions.setFixRequestSchedules(updatedSchedules));

    const fixRequestSections: Array<SectionModel> = [];
    fixTemplate.sections?.forEach((section) => {
      const fixRequestSection = {
        name: section.name,
        details: section.fields,
      };
      fixRequestSections.push(fixRequestSection);
    });

    const tags: Array<TagModel> = [];
    fixTemplate.tags.forEach((tag) => {
      tags.push({ name: tag });
    });

    const createdByClient: UserSummaryModel = {
      id: user.userId,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      userPrincipalName: user.userPrincipalName || '',
      savedAddresses: user.savedAddresses,
      status: user.status || { status: 1, lastSeenTimestampUtc: 0 },
      role: user.role,
    };

    const updatedByUser = createdByClient;
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

    const fix: FixRequestModel = {
      id: fixId,
      details: {
        name: fixTemplate.name,
        category: fixTemplate.workCategory.name,
        description: fixTemplate.description,
        type: fixTemplate.workType.name,
        unit: fixTemplate.fixUnit.name,
        sections: fixRequestSections,
      },
      tags,
      clientEstimatedCost: {
        minimumCost: fixRequest.clientEstimatedCost.minimumCost,
        maximumCost: fixRequest.clientEstimatedCost.maximumCost,
      },
      schedule: updatedSchedules,
      location: state.userAddress,
      images,
      createdByClient,
      updatedByUser,
      status: 0,
    };

    navigation.navigate(NavigationEnum.FIX, { fix, title: 'Fix Request Review', id: 'fix_request' });
  };

  useEffect(() => {
    setSchedules(fixRequest.schedule || []);
  }, [fixRequest.schedule]);

  return (
    <>
      <FixRequestHeader
        showBackBtn={true}
        navigation={navigation}
        screenTitle="Create a Fixit Template and your Fixit Request"
        textHeight={60}
        backFunction={async () => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
          await fileManagementService.deleteDirectoryByFixId(fixId);
        }}
      />
      <StyledPageWrapper>
        <StepIndicator numberSteps={constants.NUMBER_OF_STEPS} currentStep={4} />
        <Text
          style={{
            color: colors.dark,
            textAlign: 'center',
            width: '100%',
            height: 40,
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
        <ScrollView style={{ padding: 10 }}>
          <P>
            This section is not saved inside a Fixit Template. The Information are required to complete your Fixit
            Request.
          </P>
          {/** Location */}
          <View style={{ paddingBottom: 10 }}>
            <View style={{ height: 50 }}>
              <H2
                style={{
                  fontWeight: 'bold',
                }}>
                Location
              </H2>
            </View>
            <View style={styles.searchSection}>
              <TextInput
                style={styles.formField}
                defaultValue={state.userAddress?.formattedAddress}
                allowFontScaling={true}
                maxLength={30}
                onTouchEnd={() => navigation.navigate('AddressSelector')}
              />
              <Icon style={styles.searchIcon} library="FontAwesome5" name="map-marker-alt" color={'dark'} size={30} />
            </View>
          </View>
          <Divider />
          {/** Budget */}
          <View style={{ paddingBottom: 10 }}>
            <H2
              style={{
                fontWeight: 'bold',
                paddingBottom: 10,
              }}>
              Budget
            </H2>
            <Label
              style={{
                fontWeight: 'normal',
                marginTop: -10,
              }}>
              Enter your budget range
            </Label>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: 20,
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexGrow: 1,
                }}>
                <FormTextInput
                  title={'Min'}
                  numeric
                  padLeft
                  onChange={(cost: string) =>
                    store.dispatch(
                      fixRequestActions.setFixRequestClientMinEstimatedCost({ minimumCost: parseInt(cost, 10) }),
                    )
                  }
                  value={
                    fixRequest.clientEstimatedCost.minimumCost === 0
                      ? ''
                      : fixRequest.clientEstimatedCost.minimumCost.toString()
                  }
                />
                <Icon
                  library="FontAwesome5"
                  name="dollar-sign"
                  color={'dark'}
                  size={20}
                  style={{
                    marginTop: -35,
                    marginLeft: 8,
                    width: 15,
                  }}
                />
              </View>
              <View
                style={{
                  width: 30,
                  margin: 10,
                  marginTop: 20,
                  height: 2,
                  backgroundColor: colors.grey,
                }}></View>
              <View
                style={{
                  flexGrow: 1,
                }}>
                <FormTextInput
                  title={'Max'}
                  numeric
                  padLeft
                  onChange={(cost: string) =>
                    store.dispatch(
                      fixRequestActions.setFixRequestClientMaxEstimatedCost({ maximumCost: parseInt(cost, 10) }),
                    )
                  }
                  value={
                    fixRequest.clientEstimatedCost.maximumCost === 0
                      ? ''
                      : fixRequest.clientEstimatedCost.maximumCost.toString()
                  }
                />
                <Icon
                  library="FontAwesome5"
                  name="dollar-sign"
                  color={'dark'}
                  size={20}
                  style={{
                    marginTop: -35,
                    marginLeft: 8,
                    width: 15,
                  }}
                />
              </View>
            </View>
          </View>
          <Divider />
          {/** Schedules */}
          <View>
            <H2
              style={{
                fontWeight: 'bold',
              }}>
              Schedules
            </H2>
            <FixTemplatePicker
              selectedValue={scheduleTypeName}
              onChange={(value: string) => {
                setScheduleTypeName(value);
                setScheduleType(scheduleTypes.find((schedule) => schedule.name === value) as ScheduleType);
              }}
              values={scheduleTypes}
            />
            {scheduleType && scheduleType.id === 'custom' ? (
              <View>
                <Spacer height="20px" />
                <Label
                  style={{
                    fontWeight: 'normal',
                    marginTop: -10,
                  }}>
                  Choose days from which the craftsman can pick to do the job
                </Label>
                <Spacer height="20px" />
                <Calendar parentSchedules={schedules} canUpdate={true} parentSetSchedules={setSchedules} />
              </View>
            ) : null}
          </View>
          <Divider />
          {/** Images */}
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
          <Divider />
          <Spacer height="50px" />
        </ScrollView>
      </StyledPageWrapper>

      <FormNextPageArrows mainClick={handleNextStep} />
    </>
  );
};

export default FixRequestImagesLocationStep;

import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { colors } from 'fixit-common-ui';
import { Asset, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ProgressIndicatorFactory from './progressIndicators/progressIndicatorFactory';

interface CameraAndImageProps {
  assets: Array<Asset & { isUploaded: boolean }>;
  setAssets: React.Dispatch<React.SetStateAction<Array<Asset & { isUploaded: boolean }>>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    flexDirection: 'column',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: colors.light,
    margin: 2,
  },
  buttonCancel: {
    alignSelf: 'flex-end',
  },
});
interface AssetsWithIsUploaded extends Asset {
  isUploaded: boolean;
}

export const CameraAndImage: FunctionComponent<PropsWithChildren<CameraAndImageProps>> = (
  props: CameraAndImageProps,
): JSX.Element => {
  const { modalVisible, setModalVisible, assets, setAssets, setErrorMessage } = props;
  const launch = async (isCamera: boolean) => {
    const response: ImagePickerResponse = await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (isCamera) {
          resolve(launchCamera({ mediaType: 'photo', includeBase64: true, quality: 0.5 }));
        } else {
          resolve(launchImageLibrary({ mediaType: 'photo', selectionLimit: 0, includeBase64: true, quality: 0.5 }));
        }
      }, 200);
    });

    let assetsWithIsUploaded: Array<AssetsWithIsUploaded> = [];
    response.assets?.forEach((asset) => {
      assetsWithIsUploaded.push({ ...asset, isUploaded: false });
    });

    if (response.errorCode) {
      setErrorMessage(response.errorMessage || 'something went wrong while lauching your camera');
    }

    const assetsUpdate = [...assets];
    if (assetsWithIsUploaded) {
      assetsUpdate.push(...assetsWithIsUploaded);
    }

    setAssets(assetsUpdate);
    setModalVisible(!modalVisible);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={{ marginBottom: 3, fontWeight: 'bold' }}> Select image </Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={async () => {
              await launch(true);
            }}>
            <Text>Take photo</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={async () => {
              await launch(false);
            }}>
            <Text>Choose from library</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonCancel]} onPress={() => setModalVisible(!modalVisible)}>
            <Text style={{ fontWeight: 'bold' }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

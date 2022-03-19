import { fileApiBaseUrl } from '../../config/appConfig';

import axios from 'axios';
import { Asset } from 'react-native-image-picker';
import { FixitError } from '../../../common/FixitError';

export interface UploadFileResponse {
  fileCreatedId: string;
  fileCreatedPath: string;
  fileCreatedName: string;
  imageUrl: {
    url: string;
    expiryDate: string;
  };
  fileCreatedLength: number;
  fileCreatedTimestampUtc: number;
  isOperationSuccessful: boolean;
  operationMessage: null;
  operationException: null;
}

export default class FileManagementService {
  constructor(private fileApiBaseUrlSelf: string = fileApiBaseUrl) {}

  async uploadFile(id: string, asset: Asset, type: string): Promise<UploadFileResponse> {
    try {
      const searchRegExp = /\-/g;
      id = id.replace(searchRegExp, '');

      var formData = new FormData();
      formData.append('FilePathToCreate', asset.fileName as string);
      formData.append('FormFile', { uri: asset.uri, type: asset.type as string, name: asset.fileName } as any);
      formData.append('FileMetadataSummary.ContentType', asset.type as string);

      const response = await axios.post(`${this.fileApiBaseUrlSelf}/FileSystem/${type}/${id}/Files/Upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (e: any) {
      console.log(JSON.stringify(e));
      throw new FixitError('Failed to upload image', e);
    }
  }

  async deleteFile(id: string, fileCreatedId: string, type: string) {
    try {
      const searchRegExp = /\-/g;
      id = id.replace(searchRegExp, '');
      const response = await axios.delete(
        `${this.fileApiBaseUrlSelf}/FileSystem/${type}/${id}/Files/${fileCreatedId}/Delete`,
      );
      return response.data;
    } catch (e: any) {
      throw new FixitError('Failed to delete image', e);
    }
  }

  async deleteDirectoryByFixId(id: string, type: string) {
    try {
      const searchRegExp = /\-/g;
      id = id.replace(searchRegExp, '');
      const response = await axios.delete(`${this.fileApiBaseUrlSelf}/FileSystem/${type}/${id}/Folders/Delete`);
      return response.data;
    } catch (e: any) {
      throw new FixitError('Failed to delete image', e);
    }
  }
}

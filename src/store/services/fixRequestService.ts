import axios from 'axios';
import {} from '../rootReducer';
import Status from '../models/common/fixTemplateStatus';
import { FixRequestModel, clearData } from '../slices/fixRequestSlice';

import { updateFixTemplate, FixTemplateSection, setCategories, setUnits, setTypes } from '../slices/fixTemplateSlice';
import BaseConfigProvider from '../config/providers/baseConfigProvider';

export interface FixTemplateUpdateRequest {
  name?: string;
  workTypeId?: string;
  workCategoryId?: string;
  fixUnitId?: string;
  description?: string;
  updatedByUserId?: string;
  tags?: Array<string>;
  sections?: Array<FixTemplateSection>;
}

export interface FixTemplateCreateRequest extends FixTemplateUpdateRequest {
  status: Status;
  createdByUserId: string;
}

export class FixRequestService {
  config: BaseConfigProvider;
  store: any;

  constructor(config: BaseConfigProvider, store: any) {
    this.config = config;
    this.store = store;
  }

  // TODO use the config factory
  publishFixRequest(fixRequestObj: FixRequestModel): void {
    axios
      .post(`${this.config.fixApiBaseUrl}/fixes`, fixRequestObj)
      // TODO send data to handle exceptions in UI
      .then((response) => {
        this.store.dispatch(clearData());
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async getCategories(): Promise<void> {
    try {
      const response = await axios.get(`${this.config.mdmBaseApiUrl}/workCategories`);
      this.store.dispatch(setCategories(response.data));
    } catch (e) {
      console.error(e);
    }
  }

  async getTypes(): Promise<void> {
    try {
      const response = await axios.get(`${this.config.mdmBaseApiUrl}/workTypes`);
      this.store.dispatch(setTypes(response.data));
    } catch (e) {
      console.error(e);
    }
  }

  async getUnits(): Promise<void> {
    try {
      const response = await axios.get(`${this.config.mdmBaseApiUrl}/fixunits`);
      this.store.dispatch(setUnits(response.data));
    } catch (e) {
      console.error(e);
    }
  }

  updateFixTemplate(fixTemplateObject: FixTemplateUpdateRequest, id: string): void {
    axios.put(`${this.config.mdmBaseApiUrl}/fixtemplates/${id}`, fixTemplateObject);
  }

  saveFixTemplate(fixTemplateObject: FixTemplateCreateRequest): void {
    axios
      .post(`${this.config.mdmBaseApiUrl}/fixtemplates`, fixTemplateObject)
      .then((response) => {
        this.store.dispatch(updateFixTemplate(response.data));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getFixTemplateById(id: string): void {
    axios
      .get(`${this.config.mdmBaseApiUrl}/fixtemplates/${id}`)
      .then((response) => {
        this.store.dispatch(updateFixTemplate(response.data));
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

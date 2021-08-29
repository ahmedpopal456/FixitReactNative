import axios from 'axios';

export default class FixManagementService {
  static async searchByTags(searchTerms: string): Promise<Array<any>> {
    try {
      const requestUrl = `https://fixit-dev-fms-search.azurewebsites.net/api/search-template?keywords=${searchTerms}`;
      const response = await axios.get(requestUrl);
      return response.data;
    } catch (e) {
      console.error('search :: ', e);
    }
    return [];
  }
}

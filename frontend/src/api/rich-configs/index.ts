import axios from 'axios';
import endpoint from '../endpoints.config';

/** The driver a rich-config based on the given id */
export const fetchRichConfigAPI = (id: number) =>
  axios.get(`${endpoint.ApiBaseUrl}/api/richConfigs/`, {
    params: {
      config_ref: id
    }
  });

/** The driver a new rich-config */
export const fetchNewRichConfigAPI = () =>
  axios.post(`${endpoint.ApiBaseUrl}/api/configRefs/`, {
    params: {
      save_date: null,
      user: null
    }
  });

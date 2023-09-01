import { defineStore } from 'pinia';
import axios from 'axios';

export const useAxiosStore = defineStore('axiosStore', {
  persist: true,
  state: () => ({
    axiosInstance: axios.create({
      baseURL: 'http://101.43.202.84:7002/',
      timeout: 5000,
      headers: {
        'Authorization': localStorage.getItem('token') || '',
      },
    }),
  }),
  actions: {
    updateAuthorizationHeader(newToken: string) {
      this.axiosInstance.defaults.headers['Authorization'] = newToken;
    },
  },
});

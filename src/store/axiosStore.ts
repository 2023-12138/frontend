import { defineStore } from 'pinia';
import axios from 'axios';

export const useAxiosStore = defineStore('axiosStore', {
  state: () => ({
    axiosInstance: axios.create({
      baseURL: 'http://127.0.0.1:8000/',
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

import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://http://localhost:3000',
  withCredentials: true,
});
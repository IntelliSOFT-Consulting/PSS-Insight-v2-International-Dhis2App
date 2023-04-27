import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.104.91.116:7009/api/v1',
});

export default api;

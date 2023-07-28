import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/api/v1`,
});

export default api;

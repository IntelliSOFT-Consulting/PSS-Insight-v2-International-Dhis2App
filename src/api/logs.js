import api from './axios';

export const listLogs = async () => {
  const { data } = await api.get('/change-logs/fetch');
  return data;
};

export const createLog = async log => {
  const { data } = await api.post('/change-logs/save', log);
  return data;
};

export const viewLog = async id => {
  const { data } = await api.get(`/change-logs/details/${id}`);
  return data;
};

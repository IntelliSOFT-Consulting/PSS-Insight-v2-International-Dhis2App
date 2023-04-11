import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.104.91.116:7009/api/v1',
});

export const listVersions = async () => {
  const { data } = await api.get('/master-template/version');
  return data;
};

export const createVersion = async template => {
  const { data } = await api.post('/master-template/version', template);
  return data;
};

export const getVersionDetails = async id => {
  const { data } = await api.get(`/master-template/version/${id}`);
  return data;
};

export const deleteVersion = async id => {
  const { data } = await api.delete(`/master-template/version/${id}`);
  return data;
};

export const getMasterIndicators = async () => {
  const { data } = await api.get('/master-template/indicators');
  return data;
};

export const updateVersion = async (id, template) => {
  const { data } = await api.put(`/master-template/version/${id}`, template);
  return data;
}

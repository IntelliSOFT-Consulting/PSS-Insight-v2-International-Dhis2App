import api from './axios';

export const listVersions = async (size = 15, page = 1) => {
  const { data } = await api.get('/master-template/version', {
    params: {
      limit: size,
      pageNo: page,
    },
  });
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
};

export const saveBenchmark = async (benchmark) => {
  const { data } = await api.post(`/benchmarks/save`, benchmark);
  return data;
}
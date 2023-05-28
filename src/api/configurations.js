import api from './axios';

export const saveEmailConfig = async config => {
  const { data } = await api.post('/configuration/save-mail', config);
  return data;
}
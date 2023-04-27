import api from './axios';

export const sendNotification = async notification => {
  const { data } = await api.post('/notification/send', notification);
  return data;
};

export const listSubscribers = async () => {
  const { data } = await api.get('/notification/list-subscribed');
  return data;
};

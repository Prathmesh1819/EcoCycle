import axios from 'axios';

const API_BASE = '/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const identifyEWaste = async (imageBase64, prompt) => {
  const res = await api.post('/ai/identify', { imageBase64, prompt });
  return res.data;
};

export const sendEcoBotMessage = async (message, history) => {
  const res = await api.post('/ai/chat', { message, history });
  return res.data;
};

export const fetchPickups = async (params = {}) => {
  const res = await api.get('/pickups', { params });
  return res.data;
};

export const createPickup = async (pickupData) => {
  const res = await api.post('/pickups', pickupData);
  return res.data;
};

export const updatePickupStatus = async (id, updateData) => {
  const res = await api.patch(`/pickups/${id}`, updateData);
  return res.data;
};

export const fetchRewardsCatalog = async () => {
  const res = await api.get('/rewards/catalog');
  return res.data;
};

export const redeemReward = async (rewardId) => {
  const res = await api.post('/rewards/redeem', { rewardId });
  return res.data;
};

export const fetchRecyclingCenters = async (params = {}) => {
  const res = await api.get('/centers', { params });
  return res.data;
};

export const fetchImpactReportSummary = async () => {
  const res = await api.get('/reports/summary');
  return res.data;
};

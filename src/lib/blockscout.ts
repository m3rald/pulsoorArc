import axios from 'axios';
import { BLOCKSCOUT_API } from './constants';

const api = axios.create({
  baseURL: BLOCKSCOUT_API,
  timeout: 8000,
});

export async function getStats() {
  const { data } = await api.get('/stats');
  return data;
}

export async function getRecentBlocks(limit = 20) {
  const { data } = await api.get(`/blocks?type=block&limit=${limit}`);
  return data.items ?? [];
}

export async function getRecentTransactions(limit = 25) {
  const { data } = await api.get(`/transactions?limit=${limit}`);
  return data.items ?? [];
}

export async function getSmartContracts(limit = 10) {
  const { data } = await api.get(`/smart-contracts?limit=${limit}`);
  return data.items ?? [];
}

export async function getAddressInfo(address: string) {
  const { data } = await api.get(`/addresses/${address}`);
  return data;
}

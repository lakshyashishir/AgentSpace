// api.ts
import axios from 'axios';

const API_URL = 'http://localhost:3002/api';

const api = axios.create({
  baseURL: API_URL,
});

// Profile
export const getProfile = async (address: string) => {
  const response = await api.get(`/users/${address}`);
  return response.data;
};

export const updateProfile = async (data: { address: string; username: string; bio: string }) => {
  const response = await api.put(`/users/${data.address}`, { username: data.username, bio: data.bio });
  return response.data;
};

// Workflows
export const getWorkflows = async () => {
  const response = await api.get('/workflows');
  return response.data;
};

export const createWorkflow = async (data: { name: string; description: string }) => {
  const response = await api.post('/workflows', data);
  return response.data;
};

// Agents
export const getAgents = async () => {
  const response = await api.get('/agents');
  return response.data;
};

export const executeAgent = async (agentId: string, input: any) => {
  const response = await api.post(`/agents/${agentId}/execute`, { input });
  return response.data;
};

// Marketplace
export const getMarketplaceItems = async () => {
  const response = await api.get('/marketplace');
  return response.data;
};

export const purchaseItem = async (itemId: string) => {
  const response = await api.post(`/marketplace/${itemId}/purchase`);
  return response.data;
};

// Collections
export const createCollection = async (data: { name: string; description: string }) => {
  const response = await api.post('/collections', data);
  return response.data;
};

export const getMyCollections = async () => {
  const response = await api.get('/collections/my');
  return response.data;
};

// Minting
export const mintNFT = async (data: { collectionId: string; metadata: any }) => {
  const response = await api.post('/nft/mint', data);
  return response.data;
};

export default api;
import axios from 'axios';
import { Agent } from '@/types/Agent';

const API_URL = 'http://localhost:3002/api';

const api = axios.create({
  baseURL: API_URL,
});

// Profile
export const getProfile = async (address: string) => {
    try {
      const response = await api.get(`/users/profile/${address}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 204) {
        return null;
      }
      throw error;
    }
  };
  
  export const updateProfile = async (data: { address: string; username: string; }) => {
    const response = await api.put(`/users/profile/${data.address}`, { username: data.username });
    return response.data;
  };
  
  export const createProfile = async (data: { address: string; username: string; }) => {
    const response = await api.post('/users/profile', data);
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
export const getAgents = async (): Promise<Agent[]> => {
  const response = await api.get('/agents');
  return response.data;
};

export const executeAgent = async (id: string, input: string): Promise<{ result: string }> => {
  const response = await axios.post(`${API_URL}/agents/execute`, { agent_id: id, input, userId: "2da70a10-af19-45d1-a1a3-3d6979edc045" });
  return response.data;
};

export const getAgent = async (id: string): Promise<Agent> => {
  const response = await axios.get(`${API_URL}/agents/${id}`);
  return response.data;
};

// Marketplace
export const getMarketplaceItems = async () => {
  const response = await api.get('/marketplace/list');
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
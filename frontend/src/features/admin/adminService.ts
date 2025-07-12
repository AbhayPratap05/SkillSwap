import axios from 'axios';

const API_URL = '/api/admin/';

// Get all users
const getUsers = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + 'users', config);
  return response.data;
};

// Ban user
const banUser = async (userId: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}users/${userId}/ban`, {}, config);
  return response.data;
};

// Unban user
const unbanUser = async (userId: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}users/${userId}/unban`, {}, config);
  return response.data;
};

// Get all swaps
const getSwaps = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + 'swaps', config);
  return response.data;
};

// Get platform stats
const getStats = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + 'stats', config);
  return response.data;
};

// Send platform message
const sendMessage = async (messageData: { title: string; message: string; type: string }, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + 'message', messageData, config);
  return response.data;
};

const adminService = {
  getUsers,
  banUser,
  unbanUser,
  getSwaps,
  getStats,
  sendMessage,
};

export default adminService; 
import axiosInstance from '../../config/axios';

const API_URL = '/api/swaps/';

// Create new swap request
const createSwapRequest = async (swapData: any) => {
  const response = await axiosInstance.post(API_URL, swapData);
  return response.data;
};

// Get user's swap requests
const getSwapRequests = async () => {
  console.log('Fetching swap requests...');
  try {
    const response = await axiosInstance.get(API_URL);
    console.log('Swap requests response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching swap requests:', error);
    throw error;
  }
};

// Update swap status
const updateSwapStatus = async (swapId: string, status: string) => {
  const response = await axiosInstance.put(`${API_URL}${swapId}/status`, { status });
  return response.data;
};

// Add feedback
const addFeedback = async (swapId: string, feedback: { rating: number; comment: string }) => {
  const response = await axiosInstance.post(`${API_URL}${swapId}/feedback`, feedback);
  return response.data;
};

// Delete swap request
const deleteSwapRequest = async (swapId: string) => {
  const response = await axiosInstance.delete(`${API_URL}${swapId}`);
  return response.data;
};

const swapService = {
  createSwapRequest,
  getSwapRequests,
  updateSwapStatus,
  addFeedback,
  deleteSwapRequest,
};

export default swapService; 
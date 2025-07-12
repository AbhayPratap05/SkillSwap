import axiosInstance from '../../config/axios';

const API_URL = '/api/users/';

// Get user profile
const getProfile = async () => {
  try {
    const response = await axiosInstance.get(API_URL + 'profile');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString();
    throw new Error(message);
  }
};

// Update user profile
const updateProfile = async (profileData: any) => {
  try {
    const response = await axiosInstance.put(API_URL + 'profile', profileData);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString();
    throw new Error(message);
  }
};

// Search users
const searchUsers = async (searchParams: { skill?: string; type?: 'offered' | 'wanted' }) => {
  const params = new URLSearchParams();
  if (searchParams.skill) params.append('skill', searchParams.skill);
  if (searchParams.type) params.append('type', searchParams.type);

  const response = await axiosInstance.get(`${API_URL}search?${params.toString()}`);
  return response.data;
};

// Get user by ID
const getUserById = async (userId: string) => {
  const response = await axiosInstance.get(API_URL + userId);
  return response.data;
};

const userService = {
  getProfile,
  updateProfile,
  searchUsers,
  getUserById,
};

export default userService; 
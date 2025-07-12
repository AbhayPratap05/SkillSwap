import axiosInstance from '../../config/axios';

const API_URL = '/api/users/';

// Get stored user data
const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user) return null;
    
    const parsedUser = JSON.parse(user);
    if (!parsedUser || !parsedUser.token) {
      localStorage.removeItem('user');
      return null;
    }
    
    return parsedUser;
  } catch (error) {
    localStorage.removeItem('user');
    return null;
  }
};

// Set auth token in axios headers
const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Register user
const register = async (userData: { name: string; email: string; password: string }) => {
  try {
    const response = await axiosInstance.post(API_URL, userData);
    if (response.data && response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Registration failed';
    throw new Error(message);
  }
};

// Login user
const login = async (userData: { email: string; password: string }) => {
  try {
    const response = await axiosInstance.post(API_URL + 'login', userData);
    if (response.data && response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Invalid credentials';
    throw new Error(message);
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
  setAuthToken(null);
};

// Initialize auth state
const initializeAuth = () => {
  const user = getStoredUser();
  if (user?.token) {
    setAuthToken(user.token);
  } else {
    logout();
  }
};

// Call initialize on module load
initializeAuth();

const authService = {
  register,
  login,
  logout,
  getStoredUser,
  setAuthToken,
};

export default authService; 
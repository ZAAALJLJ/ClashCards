import api from '../api';

const getUsername = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/username`);
    return response.data.username;
  } catch (error) {
    console.error('Failed to fetch username:', error);
    return null;
  }
};

export default getUsername;

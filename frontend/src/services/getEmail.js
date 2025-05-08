import api from '../api';

const getEmail = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/email`);
    console.log("Email to", response.data.email);
    return response.data.email;
  } catch (error) {
    console.error('Failed to fetch email:', error);
    return null;
  }
};

export default getEmail;
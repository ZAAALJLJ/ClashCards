const getUsername = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/username`);
    
    return response.data.username || "Unknown";
  } catch (error) {
    console.error('Failed to fetch username:', error);
    return "Unknown"; 
  }
};

export default getUsername;

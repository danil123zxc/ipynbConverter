import axios from 'axios';

// Create axios instance with baseURL
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Upload a notebook file for conversion
 * @param {FormData} formData - Form data containing the notebook file
 * @returns {Promise} - Promise with the response
 */
export const uploadNotebook = (formData) => {
  return api.post('/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Get the status of a conversion
 * @param {number} id - ID of the conversion
 * @returns {Promise} - Promise with the response
 */
export const getConversionStatus = (id) => {
  return api.get(`/conversion-status/${id}/`);
};

/**
 * Get all conversions
 * @returns {Promise} - Promise with the response
 */
export const getConversions = () => {
  return api.get('/notebooks/');
};

/**
 * Delete a conversion
 * @param {number} id - ID of the conversion to delete
 * @returns {Promise} - Promise with the response
 */
export const deleteConversion = (id) => {
  return api.delete(`/notebooks/${id}/`);
};

export default api;

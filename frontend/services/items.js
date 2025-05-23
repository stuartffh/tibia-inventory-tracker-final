// Serviço de itens
// services/items.js

import axios from 'axios';
import config from '../config';

export const getItems = async () => {
  try {
    const response = await axios.get(config.endpoints.items);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar itens');
  }
};

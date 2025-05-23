// Serviço de inventário
// services/inventory.js

import axios from 'axios';
import config from '../config';

export const getInventory = async () => {
  try {
    const response = await axios.get(config.endpoints.inventory);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar inventário');
  }
};

export const addItem = async (itemData) => {
  try {
    const response = await axios.post(config.endpoints.inventory, itemData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao adicionar item');
  }
};

export const sellItem = async (id, sellData) => {
  try {
    const response = await axios.put(config.endpoints.sellItem(id), sellData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao marcar item como vendido');
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await axios.delete(config.endpoints.deleteItem(id));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao remover item');
  }
};

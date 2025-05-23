// Serviço de relatórios
// services/reports.js

import axios from 'axios';
import config from '../config';

export const getDashboardData = async () => {
  try {
    const response = await axios.get(config.endpoints.dashboard);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao carregar dados do dashboard');
  }
};

export const getPeriodReport = async (period) => {
  try {
    const response = await axios.get(`${config.endpoints.periodReport}?period=${period}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao carregar relatório do período');
  }
};

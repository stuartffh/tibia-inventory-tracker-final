// Arquivo de configuração para o frontend
// config.js

const API_URL = 'http://localhost:3001';

export default {
  API_URL,
  endpoints: {
    login: `${API_URL}/api/auth/login`,
    verify: `${API_URL}/api/auth/verify`,
    items: `${API_URL}/api/items`,
    inventory: `${API_URL}/api/inventory`,
    sellItem: (id) => `${API_URL}/api/inventory/${id}/sell`,
    deleteItem: (id) => `${API_URL}/api/inventory/${id}`,
    dashboard: `${API_URL}/api/reports/dashboard`,
    periodReport: `${API_URL}/api/reports/period`
  }
};

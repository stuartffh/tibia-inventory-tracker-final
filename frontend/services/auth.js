// Serviço de autenticação
// services/auth.js

import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../config';

const TOKEN_COOKIE = 'tibia_auth_token';

// Configurar interceptor para incluir token em todas as requisições
axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get(TOKEN_COOKIE);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (username, password) => {
  try {
    const response = await axios.post(config.endpoints.login, {
      username,
      password
    });
    
    // Armazenar token no cookie
    if (response.data.token) {
      Cookies.set(TOKEN_COOKIE, response.data.token, { expires: 1 }); // 1 dia
      localStorage.setItem('tibia_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao fazer login');
  }
};

export const logout = () => {
  Cookies.remove(TOKEN_COOKIE);
  localStorage.removeItem('tibia_user');
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  return !!Cookies.get(TOKEN_COOKIE);
};

export const getUser = () => {
  const userStr = localStorage.getItem('tibia_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const verifyAuth = async () => {
  try {
    const response = await axios.get(config.endpoints.verify);
    return response.data;
  } catch (error) {
    logout();
    throw new Error('Sessão expirada ou inválida');
  }
};

// File: api/client.js
import axios from 'axios';

// URL de base vers ton backend
export const api = axios.create({
  baseURL: 'http://192.168.1.18:3000'
});

// Helper pour ajouter le header Authorization
export function setToken(token) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

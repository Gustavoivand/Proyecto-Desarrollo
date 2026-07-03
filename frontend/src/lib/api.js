//================================================
//      VERSION ARQUITECTURA MONOLITICA
//================================================
/*
//const API_BASE_URL = 'https://softcorporation-backend.onrender.com/api';
const API_BASE_URL = 'http://localhost:3000/api';

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.error || 'Ocurrió un error al procesar la solicitud.');
  }

  return data;
};

export const api = {
  get: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'POST', body }),
  patch: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
};
*/


//================================================
//    VERSION ARQUITECTURA CON MICROSERVICIOS 
//================================================

// URL base de nuestro API Gateway orquestado en Docker Compose (Puerto 8080)
const API_BASE_URL = 'http://localhost:8080';

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  // Normalizamos el endpoint: si el frontend le pasa '/auth/login' o '/incidencias', 
  // nos aseguramos de anteponerle '/api' para que el API Gateway lo pueda interceptar correctamente.
  let urlDestino = endpoint;
  if (!urlDestino.startsWith('/api') && !urlDestino.startsWith('api')) {
    urlDestino = urlDestino.startsWith('/') ? `/api${urlDestino}` : `/api/${urlDestino}`;
  }

  const response = await fetch(`${API_BASE_URL}${urlDestino}`, config);
  
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.error || 'Ocurrió un error al procesar la solicitud.');
  }

  // ================================================================
  // CANDADO INTERNO DE MIGRACIÓN PARA EL LOGIN:
  // Si la respuesta exitosa trae un token, lo persistimos en el localStorage
  // tal cual como lo espera el flujo de enrutamiento y guardado del Front.
  // ================================================================
  if (response.ok && data && data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
};

export const api = {
  get: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'POST', body }),
  patch: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

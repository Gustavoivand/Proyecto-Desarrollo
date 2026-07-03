const DEFAULT_TIMEOUT_MS = Number(process.env.INTERNAL_REQUEST_TIMEOUT_MS || 10000);

const requestJson = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  const headers = {
    'X-Gateway-Request': 'true',
    Accept: 'application/json',
    ...(options.authorization ? { Authorization: options.authorization } : {}),
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
  };

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      const error = new Error(data.error || `Error HTTP ${response.status}`);
      error.statusCode = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Timeout al contactar un servicio interno');
      timeoutError.statusCode = 504;
      throw timeoutError;
    }

    if (!error.statusCode) {
      error.statusCode = 503;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

module.exports = {
  requestJson,
};

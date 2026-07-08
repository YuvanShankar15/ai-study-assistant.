export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const isFormData = options.body instanceof FormData;
  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = typeof data?.error === 'object' ? JSON.stringify(data.error) : data?.error;
    throw new Error(errorMsg || 'An error occurred');
  }

  return data;
};

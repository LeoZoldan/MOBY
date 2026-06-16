import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://moby-backend-production.up.railway.app';

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

const headers = async () => {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const cadastrar = async (dados: any) => {
  const res = await fetch(`${BASE_URL}/auth/cadastrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return res.json();
};

export const login = async (email: string, senha: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  const data = await res.json();
  if (data.token) {
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario));
  }
  return data;
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('usuario');
};

export const getUsuario = async () => {
  const usuario = await AsyncStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
};

export const getMe = async () => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: await headers(),
  });
  return res.json();
};

export const criarPedido = async (dados: any) => {
  const res = await fetch(`${BASE_URL}/pedidos`, {
    method: 'POST',
    headers: await headers(),
    body: JSON.stringify(dados),
  });
  return res.json();
};

export const listarDisponiveis = async () => {
  const res = await fetch(`${BASE_URL}/pedidos/disponiveis`, {
    headers: await headers(),
  });
  return res.json();
};

export const meusPedidos = async () => {
  const res = await fetch(`${BASE_URL}/pedidos/meus`, {
    headers: await headers(),
  });
  return res.json();
};

export const minhasCorridas = async () => {
  const res = await fetch(`${BASE_URL}/pedidos/corridas`, {
    headers: await headers(),
  });
  return res.json();
};

export const aceitarPedido = async (id: string) => {
  const res = await fetch(`${BASE_URL}/pedidos/${id}/aceitar`, {
    method: 'PATCH',
    headers: await headers(),
  });
  return res.json();
};

export const atualizarStatus = async (id: string, status: string) => {
  const res = await fetch(`${BASE_URL}/pedidos/${id}/status`, {
    method: 'PATCH',
    headers: await headers(),
    body: JSON.stringify({ status }),
  });
  return res.json();
};
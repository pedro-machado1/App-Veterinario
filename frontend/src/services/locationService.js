
const API_BASE_URL = 'http://localhost:8080/api';

export async function buscarCep(cep) {
  const response = await fetch(`${API_BASE_URL}/cep/buscar/${cep}`);
  if (!response.ok) throw new Error('CEP não encontrado');
  return await response.json();
}

export async function listarCidades() {
  const response = await fetch(`${API_BASE_URL}/cidades`);
  if (!response.ok) throw new Error('Erro ao carregar cidades');
  return await response.json();
}

export async function listarCidadesPorUf(uf) {
  const response = await fetch(`${API_BASE_URL}/cidades/uf/${uf}`);
  if (!response.ok) throw new Error(`Erro ao carregar cidades de ${uf}`);
  return await response.json();
}

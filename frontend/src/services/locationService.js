const API_BASE_URL = 'http://localhost:8080/api';

const ufToCodigo = {
  AC: 12, AL: 27, AP: 16, AM: 13, BA: 29, CE: 23, DF: 53,
  ES: 32, GO: 52, MA: 21, MT: 51, MS: 50, MG: 31, PA: 15,
  PB: 25, PR: 41, PE: 26, PI: 22, RJ: 33, RN: 24, RS: 43,
  RO: 11, RR: 14, SC: 42, SP: 35, SE: 28, TO: 17
};

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
  const codigoUf = ufToCodigo[uf.toUpperCase()]; 
  
  if (!codigoUf) {
    throw new Error(`UF inválida: ${uf}`);
  }
  
  const response = await fetch(`${API_BASE_URL}/cidades/uf/${codigoUf}`);

  console.log(response)
  if (!response.ok) throw new Error(`Erro ao carregar cidades de ${uf}`);
  return await response.json();
}
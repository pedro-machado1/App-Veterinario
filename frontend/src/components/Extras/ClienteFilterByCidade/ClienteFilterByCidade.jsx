import { useState, useEffect } from 'react';
import './ClienteFilterByCidade.css';

function ClienteFilterByCidade({ onFilter, clientes }) {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredClientes, setFilteredClientes] = useState(clientes);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      const filtered = clientes.filter(cliente => 
        cliente.cidade && cliente.cidade.id === selectedCity
      );
      setFilteredClientes(filtered);
      onFilter && onFilter(filtered);
    } else {
      setFilteredClientes(clientes);
      onFilter && onFilter(clientes);
    }
  }, [selectedCity, clientes]);

  const loadCities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/cidades');
      if (!response.ok) throw new Error('Erro ao carregar cidades');
      const data = await response.json();
      setCities(data);
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="clienteFilterContainer">
      <div className="filterHeader">
        <h3>Filtrar Clientes</h3>
      </div>

      <div className="filterContent">
        <label className="filterLabel">
          <span>Selecione uma Cidade:</span>
          <select 
            className="filterSelect"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value ? parseInt(e.target.value) : '')}
            disabled={isLoading}
          >
            <option value="">Todas as cidades</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>
                {city.nome} - {city.uf}
              </option>
            ))}
          </select>
        </label>

        <div className="filterInfo">
          <p>
            Mostrando <strong>{filteredClientes.length}</strong> cliente(s)
            {selectedCity && ` de ${cities.find(c => c.id === selectedCity)?.nome || 'uma cidade'}`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClienteFilterByCidade;

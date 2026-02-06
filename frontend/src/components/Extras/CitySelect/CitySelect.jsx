import { useState, useEffect } from 'react';
import './CitySelect.css';

function CitySelect({ 
  value, 
  onChange,
  label = "Cidade",
  placeholder = "Selecione uma cidade",
  required = false,
  filterByUf = null,
  searchable = true
}) {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCities();
  }, []);

  useEffect(() => {
    if (filterByUf) {
      const filtered = cities.filter(city => city.uf === filterByUf.toUpperCase());
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cities);
    }
  }, [filterByUf, cities]);

  const loadCities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/cidades');
      if (!response.ok) throw new Error('Erro ao carregar cidades');
      const data = await response.json();
      setCities(data);
      setFilteredCities(data);
    } catch (err) {
      setError('Erro ao carregar cidades: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === '') {
      setFilteredCities(filterByUf 
        ? cities.filter(c => c.uf === filterByUf.toUpperCase())
        : cities
      );
    } else {
      const filtered = (filterByUf 
        ? cities.filter(c => c.uf === filterByUf.toUpperCase())
        : cities
      ).filter(city => 
        city.nome.toLowerCase().includes(term)
      );
      setFilteredCities(filtered);
    }
  };

  const handleSelect = (city) => {
    onChange && onChange(city);
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedCity = cities.find(c => c.id === value);

  return (
    <div className="citySelectContainer">
      <label className="citySelectLabel">
        <span className={`citySelectLabelText ${value ? 'active' : ''}`}>
          {label} {required && <span className="required">*</span>}
        </span>
        <div className="citySelectWrapper">
          <div
            className="citySelectInput"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={`citySelectPlaceholder ${selectedCity ? 'selected' : ''}`}>
              {selectedCity ? selectedCity.nome : placeholder}
            </span>
            <span className={`citySelectArrow ${isOpen ? 'open' : ''}`}>▼</span>
          </div>

          {isOpen && (
            <div className="citySelectDropdown">
              {searchable && (
                <input
                  type="text"
                  className="citySelectSearchInput"
                  placeholder="Buscar cidade..."
                  value={searchTerm}
                  onChange={handleSearch}
                  autoFocus
                />
              )}

              <div className="citySelectOptions">
                {isLoading ? (
                  <div className="citySelectLoading">Carregando...</div>
                ) : filteredCities.length === 0 ? (
                  <div className="citySelectEmpty">Nenhuma cidade encontrada</div>
                ) : (
                  filteredCities.map(city => (
                    <div
                      key={city.id}
                      className={`citySelectOption ${value === city.id ? 'active' : ''}`}
                      onClick={() => handleSelect(city)}
                    >
                      <span className="cityName">{city.nome}</span>
                      <span className="cityUf">{city.uf}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </label>

      {error && <p className="citySelectError">{error}</p>}
    </div>
  );
}

export default CitySelect;

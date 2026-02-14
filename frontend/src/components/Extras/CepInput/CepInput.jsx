import { useState, useEffect } from 'react';
import './CepInput.css';

function CepInput({ 
  onCepSearch, 
  value, 
  onChange,
  onCitySelect,
  label = "CEP",
  placeholder = "Digite o CEP (ex: 01001000)",
  required = false
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cepFormatted, setCepFormatted] = useState(value || '');

  useEffect(() => {
    setCepFormatted(value || '');
  }, [value]);

  const formatCep = (cep) => {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length <= 5) return cleaned;
    return cleaned.slice(0, 5) + '-' + cleaned.slice(5, 8);
  };

  const handleCepChange = (e) => {
    const rawValue = e.target.value;
    const formatted = formatCep(rawValue);
    setCepFormatted(formatted);
    onChange && onChange(formatted);
  };

  const handleCepSearch = async (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      const cleaned = cepFormatted.replace(/\D/g, '');
      
      if (cleaned.length !== 8) {
        setError('CEP deve conter 8 dígitos');
        return;
      }

      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch(
          `http://localhost:8080/api/cep/buscar/${cleaned}`
        );
        
        if (!response.ok) {
          throw new Error('CEP não encontrado');
        }

        const data = await response.json();
        onCepSearch && onCepSearch(data);
        onCitySelect && onCitySelect(data.cidade);
      } catch (err) {
        setError(err.message || 'Erro ao buscar CEP');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="cepInputContainer">
      <label className="cepInputLabel">
        <span className={`cepInputLabelText ${cepFormatted ? 'active' : ''}`}>
          {label} {required && <span className="required">*</span>}
        </span>
        <input
          type="text"
          className="cepInputField"
          value={cepFormatted}
          onChange={handleCepChange}
          onKeyDown={handleCepSearch}
          onBlur={handleCepSearch}
          placeholder={placeholder}
          maxLength="9"
          disabled={isLoading}
        />
      </label>
      
      {isLoading && <p className="cepLoading">Buscando...</p>}
      {error && <p className="cepError">{error}</p>}
    </div>
  );
}

export default CepInput;

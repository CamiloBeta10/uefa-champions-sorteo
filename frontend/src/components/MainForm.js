import React, { useState } from 'react';
import '../styles/ChampionsTheme.css';

function MainForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Aquí irá la lógica para seleccionar equipo y guardar en la base de datos
      console.log('Enviando datos:', formData);
      
      // Simular delay para la animación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Limpiar formulario después del éxito
      setFormData({ firstName: '', lastName: '' });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label" htmlFor="firstName">
            Nombre
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            className="input-field"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="Ingresa tu nombre"
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="lastName">
            Apellido
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            className="input-field"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Ingresa tu apellido"
          />
        </div>

        <button
          type="submit"
          className="champions-button"
          disabled={loading || !formData.firstName || !formData.lastName}
        >
          {loading ? 'Seleccionando...' : 'Seleccionar Equipo'}
        </button>
      </form>
    </div>
  );
}

export default MainForm;
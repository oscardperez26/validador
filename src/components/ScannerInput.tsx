/**
 * Componente ScannerInput
 * Permite ingresar o escanear un código de barras.
 * 
 * Props:
 * - onSearch: función que se ejecuta al enviar el código
 */

import React, { useState } from 'react';

interface Props {
  onSearch: (code: string) => void;
}

const ScannerInput: React.FC<Props> = ({ onSearch }) => {
  // Estado local para almacenar el código digitado
  const [value, setValue] = useState('');

  /**
   * handleSubmit:
   * Se ejecuta cuando el usuario presiona Enter (submit del formulario)
   * Llama la función "onSearch" con el código y limpia el input.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      setValue('');
    }
  };

  return (
    // Formulario para ingresar el código
    <form onSubmit={handleSubmit} className='form-input'>
      <input
        type="text"
        placeholder="Escanea o escribe el código de barras..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
    </form>
  );
};

export default ScannerInput;

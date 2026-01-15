import React, { useState } from 'react';
import Header from '../components/Header';
import { uploadBaseFile } from '../services/api';   
/**
 * BasePage:
 * Página de administración para actualizar la base de productos
 * a partir de un archivo Excel/CSV.
 *
 * Flujo:
 *  1. El usuario ingresa credenciales (admin / admin123).
 *  2. Si el login es correcto, se muestra un input de archivo.
 *  3. Al seleccionar un archivo y dar clic en "Subir y actualizar",
 *     se envía el archivo al backend y este actualiza la tabla "products".
 */
const BasePage: React.FC = () => {
    // Campos del formulario de login
    const [user, setUser] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    // Indica si el usuario ya está autenticado
    const [logged, setLogged] = useState<boolean>(false);
    // Mensaje de error en caso de credenciales incorrectas
    const [error, setError] = useState<string>('');

    // Archivo seleccionado por el usuario
    const [file, setFile] = useState<File | null>(null);
    // Flag para mostrar estado de "subiendo..."
    const [isUploading, setIsUploading] = useState<boolean>(false);


    const username = 'admin';
    const password = 'admin123';

    /**
     * handleLogin:
     * Valida las credenciales contra valores fijos.
     * Esta lógica es intencionalmente simple para un uso interno.
     */
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault(); // Evita recargar la página

        if (user === username && pass === password) {
            setLogged(true);
            setError('');
        } else {
            setLogged(false);
            setError('Usuario o clave incorrectos');
        }
    };


    /**
     * handleUpload:
     * Llama al servicio uploadBaseFile para enviar el archivo al backend.
     * - Verifica si hay archivo.
     * - Llama a la API.
     * - Muestra alertas según éxito o error.
     */

    const handleUpload = async () => {
        if (!file) {
            alert('Por favor seleccione un archivo primero.');
            return;
        }

        try {
            setIsUploading(true);

            // Llamamos al servicio que se comunica con el backend
            const response = await uploadBaseFile(file, user, pass);

            alert(` Base actualizada. Registros procesados: ${response.total}`);
        } catch (err: any) {
            console.error('Error subiendo archivo:', err);
            alert(err?.message || 'Error al subir el archivo');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="responsive-container">
            {/* Cabecera común */}
            <Header />

            <div>
                <h2>Panel De Trabajo</h2>

                {/* Si NO ha iniciado sesión, mostramos el formulario de login */}
                {!logged && (
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: 8 }}>
                            <input
                                type="text"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                placeholder="ingrese usuario"
                            />
                        </div>

                        <div style={{ marginBottom: 8 }}>
                            <input
                                type="password"
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                placeholder="ingrese clave"
                            />
                        </div>

                        <button type="submit" className='card-footer'>Entrar</button>

                        {/* Mensaje de error si las credenciales no son correctas */}
                        {error && (
                            <p style={{ color: 'red', marginTop: 8 }}>
                                {error}
                            </p>
                        )}
                    </form>
                )}

                {/* Si el login fue exitoso, mostramos el contenido protegido */}
                {logged && (
                    <div style={{ marginTop: 20 }}>
                        <div>
                            <p>
                                <b>Bienvenido</b>.
                            </p>
                            <p>
                                Seleccione el archivo <b>Excel</b> con la base actualizada para cargarlo.
                            </p>
                            <p>
                                recuerda que las columnas deben seguir el formato exacto:

                                <br />
                                <br />
                                <b>
                                    codbarras | referencia | codigo | descripcion | talla | color | departamento | seccion | marca | linea | emporada | genero | concepto | estilo_de_vida | clasificacion_produc | caracteristica_fit | estilo_silueta | tipo_estampado | bruto | nuevo_precio | antiguedad | observacion | inventario_tiendas</b>
                            </p>
                        </div>

                        <div>
                            {/* Campo para seleccionar archivo */}
                            <div style={{ marginTop: 20 }}>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}

                                />
                            </div>

                            {/* Botón (aún no hace nada con backend) */}
                            <button
                                style={{ marginTop: 10 }}
                                onClick={handleUpload}
                                disabled={isUploading}
                                className='card-footer'
                            >
                                Subir y actualizar base
                            </button>
                            {isUploading && <div className="spinner"></div>} {/* Spinner */}
                        </div>

                    </div>
                )}

            </div>

            <p className='card-footer' style={{ marginTop: '40px' }}>
                <a href="/" className='display-incio'>volver a  inicio</a>
            </p>
        </div>
    );
};

export default BasePage;

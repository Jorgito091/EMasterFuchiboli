/**
 * Script de prueba para verificar los endpoints de la API
 * Ejecutar desde la consola del navegador en http://localhost:5174/
 */

// Test 1: Verificar que API_ENDPOINTS esté disponible
console.log('=== TEST 1: Verificar API_ENDPOINTS ===');
import { API_ENDPOINTS } from './services/api/api.endpoints';
console.log('API_ENDPOINTS:', API_ENDPOINTS);

// Test 2: Verificar que ApiService esté disponible
console.log('\n=== TEST 2: Verificar ApiService ===');
import { ApiService } from './services/api/api.service';
console.log('ApiService:', ApiService);

// Test 3: Probar login (necesitas credenciales reales)
console.log('\n=== TEST 3: Probar Login ===');
console.log('Para probar el login, usa:');
console.log(`
import { login } from './services/auth';

const testLogin = async () => {
  try {
    const result = await login({
      usuario: 'TU_USUARIO',
      contraseña: 'TU_CONTRASEÑA',
      dispositivo: 'postman'
    });
    console.log('Login exitoso:', result);
    return result;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

testLogin();
`);

// Test 4: Probar obtención de equipos (requiere estar autenticado)
console.log('\n=== TEST 4: Probar obtención de equipos ===');
console.log('Para probar equipos (después de login), usa:');
console.log(`
import { getEquipos } from './services/equipos';

const testEquipos = async () => {
  try {
    const equipos = await getEquipos();
    console.log('Equipos obtenidos:', equipos);
    return equipos;
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    throw error;
  }
};

testEquipos();
`);

console.log('\n=== INSTRUCCIONES ===');
console.log('1. Abre http://localhost:5174/ en tu navegador');
console.log('2. Abre la consola del navegador (F12 o Cmd+Option+I)');
console.log('3. Copia y pega los comandos de arriba para probar cada endpoint');
console.log('4. Verifica que los headers se envíen correctamente en la pestaña Network');

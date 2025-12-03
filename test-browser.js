// ============================================
// TEST DE ENDPOINTS - Ejecutar en la consola del navegador
// Abre http://localhost:5174/ y pega este código en la consola
// ============================================

console.log('🧪 Iniciando pruebas de endpoints...\n');

// Test 1: Verificar que el endpoint de login responde
async function testLoginEndpoint() {
    console.log('📝 TEST 1: Verificar endpoint de login');

    try {
        const response = await fetch('/api/login/acceder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario: 'test',
                contraseña: 'test',
                dispositivo: 'postman'
            })
        });

        const data = await response.json();

        console.log('   Status:', response.status);
        console.log('   Respuesta:', data);

        if (data.estado === 401) {
            console.log('   ✅ Endpoint funciona (credenciales incorrectas esperado)');
            return true;
        } else {
            console.log('   ⚠️  Respuesta inesperada');
            return false;
        }
    } catch (error) {
        console.error('   ❌ Error:', error);
        return false;
    }
}

// Test 2: Verificar estructura de ApiService
function testApiServiceStructure() {
    console.log('\n📝 TEST 2: Verificar que los módulos se importen correctamente');
    console.log('   ℹ️  Este test requiere que hagas login primero en la UI');
    console.log('   ℹ️  Después de login, ejecuta: testEquiposEndpoint()');
}

// Test 3: Verificar endpoint de equipos (requiere login previo)
async function testEquiposEndpoint() {
    console.log('\n📝 TEST 3: Verificar endpoint de equipos');

    const token = localStorage.getItem('token')?.replace(/"/g, '');
    const usuario = localStorage.getItem('usuario');
    const dispositivo = localStorage.getItem('dispositivo') || 'postman';
    const version = localStorage.getItem('version') || '3.0';

    if (!token) {
        console.log('   ❌ No hay token. Haz login primero en la UI');
        return false;
    }

    console.log('   Token encontrado:', token.substring(0, 20) + '...');

    try {
        const response = await fetch('/api/equipos/obtener', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'usuario': usuario || '',
                'dispositivo': dispositivo,
                'version': version,
                'tipo-app': 'app'
            }
        });

        const data = await response.json();

        console.log('   Status:', response.status);
        console.log('   Total equipos:', data.datos?.length || 0);

        if (response.ok && data.datos) {
            console.log('   ✅ Endpoint de equipos funciona correctamente');
            console.log('   Primer equipo:', data.datos[0]?.nombre);
            return true;
        } else {
            console.log('   ❌ Error al obtener equipos:', data.mensaje);
            return false;
        }
    } catch (error) {
        console.error('   ❌ Error:', error);
        return false;
    }
}

// Ejecutar tests
async function runAllTests() {
    console.log('='.repeat(50));
    console.log('🚀 EJECUTANDO TODOS LOS TESTS');
    console.log('='.repeat(50) + '\n');

    await testLoginEndpoint();
    testApiServiceStructure();

    console.log('\n' + '='.repeat(50));
    console.log('📋 INSTRUCCIONES:');
    console.log('='.repeat(50));
    console.log('1. Haz login en la UI con tus credenciales reales');
    console.log('2. Ejecuta: testEquiposEndpoint()');
    console.log('3. Verifica que se obtengan los equipos correctamente');
    console.log('\n💡 TIP: Abre la pestaña Network para ver las peticiones\n');
}

// Auto-ejecutar
runAllTests();

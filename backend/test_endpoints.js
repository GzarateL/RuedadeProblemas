// Script de prueba para los nuevos endpoints de registro
// Ejecutar con: node test_endpoints.js

const API_BASE = 'http://localhost:4000/api/auth';

// Datos de prueba para cada tipo de usuario
const testData = {
  academia: {
    email: 'test.academia@universidad.edu',
    password: 'password123',
    nombres_apellidos: 'Juan Pérez García',
    cargo: 'Director Académico',
    institucion: 'Universidad Nacional de San Agustín',
    programa_estudio: 'Ingeniería de Sistemas',
    telefono: '+51 999 888 777',
    tipo_participacion: 'Presencial',
    dias_interes: [1, 2, 3]
  },
  gobierno: {
    email: 'test.gobierno@municipalidad.gob.pe',
    password: 'password123',
    nombres_apellidos: 'María López Rodríguez',
    cargo: 'Gerente de Desarrollo',
    institucion: 'Municipalidad Provincial de Arequipa',
    tipo_gobierno: 'PROVINCIAL',
    telefono: '+51 999 777 666',
    tipo_participacion: 'Presencial',
    dias_interes: [2, 4, 5]
  },
  empresa: {
    email: 'test.empresa@empresa.com',
    password: 'password123',
    nombres_apellidos: 'Carlos Mendoza Silva',
    cargo: 'Gerente General',
    nombre_empresa: 'Innovaciones Tech SAC',
    tipo_empresa: 'Jurídica',
    tamaño_empresa: '11-50 trabajadores',
    clasificacion: 'MYPE',
    telefono: '+51 999 666 555',
    tipo_participacion: 'Virtual',
    dias_interes: [1, 2, 3, 4]
  },
  sociedad_civil: {
    email: 'test.ong@organizacion.org',
    password: 'password123',
    nombres_apellidos: 'Ana Flores Vargas',
    cargo: 'Coordinadora',
    organizacion_representada: 'Fundación Desarrollo Sostenible',
    tipo_organizacion_civil: 'ONG',
    tamaño_organizacion: '11-50 miembros',
    telefono: '+51 999 555 444',
    tipo_participacion: 'Presencial',
    dias_interes: [3, 5]
  },
  unsa: {
    email: 'test.unsa@unsa.edu.pe',
    password: 'password123',
    nombres_apellidos: 'Dr. Roberto Quispe Mamani',
    cargo: 'Docente Investigador',
    telefono: '+51 999 444 333',
    unidad_academica: 'Escuela Profesional de Ingeniería de Sistemas'
  }
};

async function testEndpoint(tipo, data) {
  try {
    console.log(`\n🧪 Probando endpoint: /register/${tipo}`);
    
    const response = await fetch(`${API_BASE}/register/${tipo}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${tipo}: Registro exitoso`);
      console.log(`   Usuario ID: ${result.userId}`);
      console.log(`   Mensaje: ${result.message}`);
    } else {
      console.log(`❌ ${tipo}: Error en registro`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${result.message}`);
    }
  } catch (error) {
    console.log(`💥 ${tipo}: Error de conexión`);
    console.log(`   Error: ${error.message}`);
  }
}

async function testLogin(email, password) {
  try {
    console.log(`\n🔐 Probando login con: ${email}`);
    
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ Login exitoso`);
      console.log(`   Usuario: ${result.user.nombres_apellidos}`);
      console.log(`   Rol: ${result.user.rol}`);
      console.log(`   Token: ${result.token.substring(0, 20)}...`);
    } else {
      console.log(`❌ Error en login`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${result.message}`);
    }
  } catch (error) {
    console.log(`💥 Error de conexión en login`);
    console.log(`   Error: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Iniciando pruebas de endpoints de registro...');
  console.log(`📡 API Base: ${API_BASE}`);
  
  // Probar cada endpoint
  for (const [tipo, data] of Object.entries(testData)) {
    await testEndpoint(tipo, data);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo entre pruebas
  }
  
  // Probar login con algunos usuarios
  console.log('\n🔐 Probando logins...');
  await testLogin(testData.academia.email, testData.academia.password);
  await testLogin(testData.empresa.email, testData.empresa.password);
  
  console.log('\n✨ Pruebas completadas');
}

// Ejecutar las pruebas
runTests().catch(console.error);
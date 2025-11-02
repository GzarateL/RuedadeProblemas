// /backend/src/api/auth/auth.service.ts
import dbPool from '../../config/db';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../../config/env';
import { PoolConnection, OkPacket, RowDataPacket } from 'mysql2/promise'; // <-- Importar tipos de MySQL

// --- 1. DEFINICIÓN DE TIPOS PARA EL REGISTRO ---
interface BaseUserData {
  email: string;
  password: string;
  nombres_apellidos: string;
  cargo?: string;
  telefono?: string;
}

// Tipos específicos para cada formulario
interface AcademiaUserData extends BaseUserData {
  institucion: string;
  programa_estudio?: string;
  tipo_participacion: 'Presencial' | 'Virtual';
  dias_interes: number[];
}

interface GobiernoUserData extends BaseUserData {
  institucion: string;
  tipo_gobierno: 'CENTRAL' | 'REGIONAL' | 'PROVINCIAL' | 'DISTRITAL';
  tipo_participacion: 'Presencial' | 'Virtual';
  dias_interes: number[];
}

interface EmpresaUserData extends BaseUserData {
  nombre_empresa: string;
  tipo_empresa: 'Natural' | 'Jurídica';
  tamaño_empresa?: string;
  clasificacion: 'Micro' | 'MYPE' | 'Mediana' | 'Grande';
  tipo_participacion: 'Presencial' | 'Virtual';
  dias_interes: number[];
}

interface SociedadCivilUserData extends BaseUserData {
  organizacion_representada?: string;
  tipo_organizacion_civil: string;
  tamaño_organizacion?: string;
  tipo_participacion: 'Presencial' | 'Virtual';
  dias_interes: number[];
}

interface UnsaUserData extends BaseUserData {
  unidad_academica: string;
  tipo_helice?: 'docentes-investigadores' | 'grupos-centros-institutos' | 'laboratorios' | 'centros-unidades-produccion';
  nombre_grupo?: string;
  nombre_laboratorio?: string;
  nombre_centro?: string;
}

// Tipos legacy para compatibilidad
interface ExternoUserData extends BaseUserData {
  rol: "externo";
  helice_id: number;
  organizacion: string;
  dias_interes?: number[];
}

// Tipo de Unión Discriminada
type UserData = ExternoUserData | UnsaUserData | AcademiaUserData | GobiernoUserData | EmpresaUserData | SociedadCivilUserData;

// --- HELPERS ---
const hashPassword = async (password: string) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const rollback = async (connection: PoolConnection, message: string) => {
  await connection.rollback();
  connection.release();
  throw new Error(message);
};

// --- SERVICIO DE REGISTRO LEGACY (MANTENER COMPATIBILIDAD) ---
export const createUser = async (userData: UserData | any) => {
  const connection = await dbPool.getConnection();
  await connection.beginTransaction();

  try {
    const [existingUsers] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM Usuarios WHERE email = ?', [userData.email]
    );
    if (existingUsers.length > 0) {
      await rollback(connection, 'El correo electrónico ya está registrado.');
    }

    const passwordHash = await hashPassword(userData.password);
    let newUserId: number = 0;
    
    // Registro simplificado: solo crear usuario base si viene con 'rol' simple
    if (userData.rol && !('helice_id' in userData) && !('unidad_academica' in userData)) {
      // Registro simple desde /registro-usuario - solo crear usuario base
      // El perfil completo se creará después en el registro de hélice interna
      const [userResult] = await connection.execute<OkPacket>(
        'INSERT INTO Usuarios (email, password_hash, rol) VALUES (?, ?, ?)',
        [userData.email, passwordHash, userData.rol]
      );
      newUserId = userResult.insertId;
      if (!newUserId) {
        await rollback(connection, 'Error al crear el usuario base.');
      }
    }
    // Para compatibilidad con el sistema legacy completo
    else if ('rol' in userData && userData.rol === 'externo' && 'helice_id' in userData) {
      const [userResult] = await connection.execute<OkPacket>(
        'INSERT INTO Usuarios (email, password_hash, rol) VALUES (?, ?, ?)',
        [userData.email, passwordHash, 'externo']
      );
      newUserId = userResult.insertId;
      if (!newUserId) {
        await rollback(connection, 'Error al crear el usuario base.');
      }

      const dias = userData.dias_interes && Array.isArray(userData.dias_interes) ? userData.dias_interes : [];
      
      const [participanteResult] = await connection.execute<OkPacket>(
        `INSERT INTO Participantes_Externos 
         (usuario_id, helice_id, nombres_apellidos, cargo, organizacion, telefono) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [newUserId, userData.helice_id, userData.nombres_apellidos, userData.cargo, userData.organizacion, userData.telefono || null]
      );
      
      const newParticipanteId = participanteResult.insertId;
      if (!newParticipanteId) {
        await rollback(connection, 'Error al crear el perfil de participante.');
      }
      if (dias.length > 0) {
        const diasValues = dias.map((dia_id: number) => [newParticipanteId, dia_id]);
        await connection.query(
          'INSERT INTO Participante_Interes_Dias (participante_id, dia_id) VALUES ?',
          [diasValues]
        );
      }

    } else if ('unidad_academica' in userData) {
      const [userResult] = await connection.execute<OkPacket>(
        'INSERT INTO Usuarios (email, password_hash, rol) VALUES (?, ?, ?)',
        [userData.email, passwordHash, 'interno']
      );
      newUserId = userResult.insertId;
      if (!newUserId) {
        await rollback(connection, 'Error al crear el usuario base.');
      }

      await connection.execute(
        `INSERT INTO Investigadores_UNSA 
         (usuario_id, nombres_apellidos, cargo, telefono, unidad_academica) 
         VALUES (?, ?, ?, ?, ?)`,
        [newUserId, userData.nombres_apellidos, userData.cargo, userData.telefono || null, userData.unidad_academica]
      );
    }

    await connection.commit();
    connection.release();
    return { insertId: newUserId };

  } catch (error: any) {
    await connection.rollback();
    connection.release();
    throw new Error(error.message || 'Error interno del servidor durante el registro.');
  }
};

// --- NUEVOS SERVICIOS DE REGISTRO ESPECÍFICOS ---
export const createAcademiaUser = async (userData: AcademiaUserData) => {
  const connection = await dbPool.getConnection();
  await connection.beginTransaction();

  try {
    const [existingUsers] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM Usuarios WHERE email = ?', [userData.email]
    );
    if (existingUsers.length > 0) {
      await rollback(connection, 'El correo electrónico ya está registrado.');
    }

    const passwordHash = await hashPassword(userData.password);
    
    const [userResult] = await connection.execute<OkPacket>(
      'INSERT INTO Usuarios (email, password_hash, rol) VALUES (?, ?, ?)',
      [userData.email, passwordHash, 'academia']
    );
    const newUserId = userResult.insertId;
    if (!newUserId) {
      await rollback(connection, 'Error al crear el usuario base.');
    }

    const [participanteResult] = await connection.execute<OkPacket>(
      `INSERT INTO Participantes_Academia 
       (usuario_id, institucion, nombres_apellidos, cargo, programa_estudio, email, telefono, tipo_participacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [newUserId, userData.institucion, userData.nombres_apellidos, userData.cargo || null, 
       userData.programa_estudio || null, userData.email, userData.telefono || null, userData.tipo_participacion]
    );
    
    const newParticipanteId = participanteResult.insertId;
    if (!newParticipanteId) {
      await rollback(connection, 'Error al crear el perfil de academia.');
    }

    if (userData.dias_interes && userData.dias_interes.length > 0) {
      const diasValues = userData.dias_interes.map((dia_id: number) => [newParticipanteId, dia_id]);
      await connection.query(
        'INSERT INTO Academia_Interes_Dias (participante_id, dia_id) VALUES ?',
        [diasValues]
      );
    }

    await connection.commit();
    connection.release();
    return { insertId: newUserId };

  } catch (error: any) {
    await connection.rollback();
    connection.release();
    throw new Error(error.message || 'Error interno del servidor durante el registro.');
  }
};

export const createGobiernoUser = async (userData: GobiernoUserData) => {
  const connection = await dbPool.getConnection();
  await connection.beginTransaction();

  try {
    const [existingUsers] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM Usuarios WHERE email = ?', [userData.email]
    );
    if (existingUsers.length > 0) {
      await rollback(connection, 'El correo electrónico ya está registrado.');
    }

    const passwordHash = await hashPassword(userData.password);
    
    const [userResult] = await connection.execute<OkPacket>(
      'INSERT INTO Usuarios (email, password_hash, rol) VALUES (?, ?, ?)',
      [userData.email, passwordHash, 'gobierno']
    );
    const newUserId = userResult.insertId;
    if (!newUserId) {
      await rollback(connection, 'Error al crear el usuario base.');
    }

    const [participanteResult] = await connection.execute<OkPacket>(
      `INSERT INTO Participantes_Gobierno 
       (usuario_id, institucion, nombres_apellidos, cargo, tipo_gobierno, email, telefono, tipo_participacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [newUserId, userData.institucion, userData.nombres_apellidos, userData.cargo || null, 
       userData.tipo_gobierno, userData.email, userData.telefono || null, userData.tipo_participacion]
    );
    
    const newParticipanteId = participanteResult.insertId;
    if (!newParticipanteId) {
      await rollback(connection, 'Error al crear el perfil de gobierno.');
    }

    if (userData.dias_interes && userData.dias_interes.length > 0) {
      const diasValues = userData.dias_interes.map((dia_id: number) => [newParticipanteId, dia_id]);
      await connection.query(
        'INSERT INTO Gobierno_Interes_Dias (participante_id, dia_id) VALUES ?',
        [diasValues]
      );
    }

    await connection.commit();
    connection.release();
    return { insertId: newUserId };

  } catch (error: any) {
    await connection.rollback();
    connection.release();
    throw new Error(error.message || 'Error interno del servidor durante el registro.');
  }
};

export const createEmpresaUser = async (userData: EmpresaUserData) => {
  const connection = await dbPool.getConnection();
  await connection.beginTransaction();

  try {
    const [existingUsers] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM Usuarios WHERE email = ?', [userData.email]
    );
    if (existingUsers.length > 0) {
      await rollback(connection, 'El correo electrónico ya está registrado.');
    }

    const passwordHash = await hashPassword(userData.password);
    
    const [userResult] = await connection.execute<OkPacket>(
      'INSERT INTO Usuarios (email, password_hash, rol) VALUES (?, ?, ?)',
      [userData.email, passwordHash, 'empresa']
    );
    const newUserId = userResult.insertId;
    if (!newUserId) {
      await rollback(connection, 'Error al crear el usuario base.');
    }

    const [participanteResult] = await connection.execute<OkPacket>(
      `INSERT INTO Participantes_Empresa 
       (usuario_id, nombre_empresa, nombres_apellidos, cargo, tipo_empresa, tamaño_empresa, clasificacion, email, telefono, tipo_participacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newUserId, userData.nombre_empresa, userData.nombres_apellidos, userData.cargo || null, 
       userData.tipo_empresa, userData.tamaño_empresa || null, userData.clasificacion, userData.email, userData.telefono || null, userData.tipo_participacion]
    );
    
    const newParticipanteId = participanteResult.insertId;
    if (!newParticipanteId) {
      await rollback(connection, 'Error al crear el perfil de empresa.');
    }

    if (userData.dias_interes && userData.dias_interes.length > 0) {
      const diasValues = userData.dias_interes.map((dia_id: number) => [newParticipanteId, dia_id]);
      await connection.query(
        'INSERT INTO Empresa_Interes_Dias (participante_id, dia_id) VALUES ?',
        [diasValues]
      );
    }

    await connection.commit();
    connection.release();
    return { insertId: newUserId };

  } catch (error: any) {
    await connection.rollback();
    connection.release();
    throw new Error(error.message || 'Error interno del servidor durante el registro.');
  }
};

export const createSociedadCivilUser = async (userData: SociedadCivilUserData) => {
  const connection = await dbPool.getConnection();
  await connection.beginTransaction();

  try {
    const [existingUsers] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM Usuarios WHERE email = ?', [userData.email]
    );
    if (existingUsers.length > 0) {
      await rollback(connection, 'El correo electrónico ya está registrado.');
    }

    const passwordHash = await hashPassword(userData.password);
    
    const [userResult] = await connection.execute<OkPacket>(
      'INSERT INTO Usuarios (email, password_hash, rol) VALUES (?, ?, ?)',
      [userData.email, passwordHash, 'sociedad_civil']
    );
    const newUserId = userResult.insertId;
    if (!newUserId) {
      await rollback(connection, 'Error al crear el usuario base.');
    }

    const [participanteResult] = await connection.execute<OkPacket>(
      `INSERT INTO Participantes_Sociedad_Civil 
       (usuario_id, organizacion_representada, nombres_apellidos, cargo, tipo_organizacion_civil, tamaño_organizacion, email, telefono, tipo_participacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newUserId, userData.organizacion_representada || null, userData.nombres_apellidos, userData.cargo || null, 
       userData.tipo_organizacion_civil, userData.tamaño_organizacion || null, userData.email, userData.telefono || null, userData.tipo_participacion]
    );
    
    const newParticipanteId = participanteResult.insertId;
    if (!newParticipanteId) {
      await rollback(connection, 'Error al crear el perfil de sociedad civil.');
    }

    if (userData.dias_interes && userData.dias_interes.length > 0) {
      const diasValues = userData.dias_interes.map((dia_id: number) => [newParticipanteId, dia_id]);
      await connection.query(
        'INSERT INTO Sociedad_Civil_Interes_Dias (participante_id, dia_id) VALUES ?',
        [diasValues]
      );
    }

    await connection.commit();
    connection.release();
    return { insertId: newUserId };

  } catch (error: any) {
    await connection.rollback();
    connection.release();
    throw new Error(error.message || 'Error interno del servidor durante el registro.');
  }
};

export const createInternoUser = async (userData: UnsaUserData) => {
  const connection = await dbPool.getConnection();
  await connection.beginTransaction();

  try {
    const [existingUsers] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM Usuarios WHERE email = ?', [userData.email]
    );
    if (existingUsers.length > 0) {
      await rollback(connection, 'El correo electrónico ya está registrado.');
    }

    const passwordHash = await hashPassword(userData.password);
    
    const [userResult] = await connection.execute<OkPacket>(
      'INSERT INTO Usuarios (email, password_hash, rol) VALUES (?, ?, ?)',
      [userData.email, passwordHash, 'interno']
    );
    const newUserId = userResult.insertId;
    if (!newUserId) {
      await rollback(connection, 'Error al crear el usuario base.');
    }

    // Crear perfil en Investigadores_UNSA con información adicional según el tipo de hélice
    let nombres_completos = userData.nombres_apellidos;
    
    // Si es un grupo, laboratorio o centro, agregar el nombre de la entidad
    if (userData.tipo_helice === 'grupos-centros-institutos' && userData.nombre_grupo) {
      nombres_completos = `${userData.nombres_apellidos} (${userData.nombre_grupo})`;
    } else if (userData.tipo_helice === 'laboratorios' && userData.nombre_laboratorio) {
      nombres_completos = `${userData.nombres_apellidos} (${userData.nombre_laboratorio})`;
    } else if (userData.tipo_helice === 'centros-unidades-produccion' && userData.nombre_centro) {
      nombres_completos = `${userData.nombres_apellidos} (${userData.nombre_centro})`;
    }

    await connection.execute(
      `INSERT INTO Investigadores_UNSA 
       (usuario_id, nombres_apellidos, cargo, telefono, unidad_academica) 
       VALUES (?, ?, ?, ?, ?)`,
      [newUserId, nombres_completos, userData.cargo, userData.telefono || null, userData.unidad_academica]
    );

    await connection.commit();
    connection.release();
    return { insertId: newUserId };

  } catch (error: any) {
    await connection.rollback();
    connection.release();
    throw new Error(error.message || 'Error interno del servidor durante el registro.');
  }
};

// --- SERVICIO DE LOGIN ---
// /backend/src/api/auth/auth.service.ts

// ... (Las interfaces UserData, ExternoUserData, UnsaUserData son las mismas)
// ... (Las funciones hashPassword, rollback, createUser son las mismas)

// --- SERVICIO DE LOGIN (ACTUALIZADO) ---
export const login = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('Email y contraseña son requeridos.');
  }

  // 1. Busca al usuario base por email
  const [users] = await dbPool.execute<RowDataPacket[]>(
    'SELECT * FROM Usuarios WHERE email = ?', [email]
  );
  if (users.length === 0) {
    throw new Error('Credenciales inválidas.');
  }
  const user = users[0];

  // 2. Compara la contraseña
  const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordMatch) {
    throw new Error('Credenciales inválidas.');
  }

  // --- 3. Buscar nombre en registro de hélice interna si existe ---
  let userProfile: RowDataPacket | null = null;
  try {
    // Intentar buscar en registros de hélice interna
    const [heliceRecords] = await dbPool.execute<RowDataPacket[]>(
      'SELECT nombre_completo, nombre_entidad FROM registros_helice_interna WHERE usuario_id = ? LIMIT 1',
      [user.usuario_id]
    );
    if (heliceRecords.length > 0) {
      const record = heliceRecords[0];
      userProfile = { 
        nombres_apellidos: record.nombre_completo || record.nombre_entidad || user.email 
      } as RowDataPacket;
    }
  } catch (error) {
    // Si la tabla no existe o hay error, continuar sin el perfil
    console.log('No se pudo obtener el perfil del usuario desde hélice interna');
  }

  // Si no hay perfil, usar el email como nombre
  if (!userProfile) {
    if (user.rol === 'admin') {
      userProfile = { nombres_apellidos: 'Administrador' } as RowDataPacket;
    } else {
      userProfile = { nombres_apellidos: user.email } as RowDataPacket;
    }
  }


  // 4. Crea el token JWT
  const token = jwt.sign(
    { userId: user.usuario_id, rol: user.rol },
    env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  // 5. Devuelve el token y los datos del usuario (incluyendo el nombre)
  return {
    token,
    user: {
      id: user.usuario_id,
      email: user.email,
      rol: user.rol,
      // Añade el nombre completo (o email si no se encontró el perfil por alguna razón)
      nombres_apellidos: userProfile?.nombres_apellidos || user.email,
    }
  };
};

// ... (La función verify es la misma)

// --- SERVICIO DE VERIFICACIÓN ---
export const verify = async (token: string) => {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const [users] = await dbPool.execute<RowDataPacket[]>(
      'SELECT usuario_id, email, rol FROM Usuarios WHERE usuario_id = ?',
      [payload.userId]
    );
    if (users.length === 0) {
      throw new Error('El usuario del token ya no existe.');
    }
    
    const user = users[0];
    
    // Intentar obtener el ID del perfil desde registros_helice_interna
    let profileId = null;
    try {
      const [heliceRecords] = await dbPool.execute<RowDataPacket[]>(
        'SELECT id FROM registros_helice_interna WHERE usuario_id = ? LIMIT 1',
        [user.usuario_id]
      );
      if (heliceRecords.length > 0) {
        profileId = heliceRecords[0].id;
      }
    } catch (error) {
      // Si la tabla no existe, continuar sin perfil
      console.log('No se pudo obtener el perfil desde hélice interna');
    }
    
    return {
      ...user,
      investigador_id: user.rol === 'interno' ? profileId : undefined,
      participante_id: user.rol === 'externo' ? profileId : undefined,
    };
  } catch (error) {
    throw new Error('Token inválido o expirado.');
  }
};

// --- OBTENER DÍAS DISPONIBLES (TEMPORAL) ---
export const getDias = async () => {
  const [dias] = await dbPool.execute<RowDataPacket[]>(
    'SELECT * FROM Dias_Evento ORDER BY dia_numero'
  );
  return dias;
};
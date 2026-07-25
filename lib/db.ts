import mysql from "mysql2/promise";

// Conexión a MySQL (Hostinger). Las credenciales van en variables de entorno.
// Las tablas se crean solas la primera vez (no hay que correr SQL a mano).

let pool: mysql.Pool | null = null;
let iniciado: Promise<void> | null = null;

export function hayDb(): boolean {
  return Boolean(
    process.env.MYSQL_HOST &&
      process.env.MYSQL_USER &&
      process.env.MYSQL_DATABASE,
  );
}

function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 5,
      charset: "utf8mb4",
    });
  }
  return pool;
}

async function crearTablas(p: mysql.Pool): Promise<void> {
  await p.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id VARCHAR(36) PRIMARY KEY,
      nombre VARCHAR(120) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      avatar VARCHAR(16) NOT NULL DEFAULT '🚀',
      rol VARCHAR(60) NOT NULL DEFAULT 'Founder',
      bio TEXT NULL,
      ubicacion VARCHAR(120) NULL,
      web VARCHAR(190) NULL,
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS analisis (
      id VARCHAR(36) PRIMARY KEY,
      usuario_id VARCHAR(36) NOT NULL,
      titulo VARCHAR(220) NOT NULL,
      input JSON NOT NULL,
      respuesta JSON NOT NULL,
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_analisis_usuario (usuario_id),
      CONSTRAINT fk_analisis_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS hitos (
      id VARCHAR(36) PRIMARY KEY,
      usuario_id VARCHAR(36) NOT NULL,
      analisis_id VARCHAR(36) NULL,
      texto VARCHAR(255) NOT NULL,
      completado TINYINT(1) NOT NULL DEFAULT 0,
      orden INT NOT NULL DEFAULT 0,
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_hitos_usuario (usuario_id),
      CONSTRAINT fk_hitos_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

// Devuelve el pool asegurando que las tablas existen (una sola vez).
export async function db(): Promise<mysql.Pool> {
  const p = getPool();
  if (!iniciado) iniciado = crearTablas(p);
  await iniciado;
  return p;
}

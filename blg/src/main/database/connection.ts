import * as sql from 'mssql';
import { DatabaseConfig } from '../../shared/types';

let connectionPool: sql.ConnectionPool | null = null;

export async function connect(config: DatabaseConfig): Promise<sql.ConnectionPool> {
  if (connectionPool) {
    await connectionPool.close();
  }

  const dbConfig: sql.config = {
    server: config.server,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    options: {
      trustServerCertificate: config.options?.trustServerCertificate ?? true,
      encrypt: config.options?.encrypt ?? false,
    },
    pool: {
      max: 5,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  };

  connectionPool = await sql.connect(dbConfig);
  return connectionPool;
}

export async function disconnect(): Promise<void> {
  if (connectionPool) {
    await connectionPool.close();
    connectionPool = null;
  }
}

export async function testConnection(config: DatabaseConfig): Promise<boolean> {
  try {
    const pool = await connect(config);
    await pool.request().query('SELECT 1 AS ping');
    return true;
  } catch {
    return false;
  }
}

export async function query<T = any>(text: string, params?: Record<string, any>): Promise<T[]> {
  if (!connectionPool) {
    throw new Error('Database not connected');
  }

  const request = connectionPool.request();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
  }

  const result = await request.query(text);
  return result.recordset as T[];
}

export function getConnection(): sql.ConnectionPool | null {
  return connectionPool;
}

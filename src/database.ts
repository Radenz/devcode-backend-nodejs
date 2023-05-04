import mysql from "mysql";

export const connection = mysql.createPool({
  host: process.env.MYSQL_HOST!,
  port: +process.env.MYSQL_PORT!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DBNAME!,
});

async function ensureActivitiesTable() {
  return new Promise<void>((resolve, reject) => {
    connection.query(
      `
      CREATE TABLE IF NOT EXISTS activities (
        activity_id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (activity_id)
      )
    `,
      (error, _, __) => {
        if (error) {
          reject(error);
        }
        resolve();
      }
    );
  });
}

async function ensureTodosTable() {
  return new Promise<void>((resolve, reject) => {
    connection.query(
      `
      CREATE TABLE IF NOT EXISTS todos (
        todo_id INT NOT NULL AUTO_INCREMENT,
        activity_group_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        priority VARCHAR(255) NOT NULL,
        is_active BOOLEAN NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (todo_id),
        FOREIGN KEY (activity_group_id) REFERENCES activities(activity_id)
      )
    `,
      (error, _, __) => {
        if (error) {
          reject(error);
        }
        resolve();
      }
    );
  });
}

export async function query<T>(query: string, values: any[] = []): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    connection.query(query, values, (error, result: T, __) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
}

export async function ensureAllTables() {
  await ensureActivitiesTable();
  await ensureTodosTable();
}

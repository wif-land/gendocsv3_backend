const DEFAULT_APP_PORT = 3001
const DEFAULT_DB_PORT = 5432

export default () => ({
  port: parseInt(process.env.PORT, 10) || DEFAULT_APP_PORT,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || DEFAULT_DB_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
})

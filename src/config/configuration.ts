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
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  gcp: {
    credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    rootDriveFolderId: process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID,
  },
})

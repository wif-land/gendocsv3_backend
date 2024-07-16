export default () => ({
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 9006,
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
  mail: {
    mailTransport: process.env.MAIL_TRANSPORT,
  },
})

export default (): { [key: string]: string | number } => ({
  redisHost: process.env.REDIS_HOST,
  redisPort: parseInt(process.env.REDIS_PORT, 10),
  redisPass: process.env.REDIS_PASSWORD,
  accountSid: 'TEST_ACC_SID',
  authToken: 'TEST_AUTH_TOKEN',
  workspaceSid: 'TEST_WORKSPACE_SID',
  inboundWorkflowSid: 'TEST_INBOUND_WORKFLOW',
  outboundWorkflowSid: 'TEST_OUTBOUND_WORKFLOW',
  weekendWorkflowSid: 'TEST_WEEKEND_WORKFLOW',
  afterHoursWorkflowSid: 'TEST_AFTER_HOURS_WORKFLOW',
  sendgridApiKey: 'SG.TEST_API_KEY',
  env: 'develop',
  gacCompanyId: 7,
  emailsAuditVwTo: 'TEST@EMAIL_VW',
  emailsAuditGacTo: 'TEST@EMAIL_GAC',
  emailsAuditAssaTo: 'TEST@EMAIL_ASSA',
  emailsAuditProautoTo: 'TEST@EMAIL_PROAUTO',
  apiKeyGoogle: 'AIzaSyAkwYLqkyFTMT9MlO2A7TzzsRaQR7lP9dQ',
  docVehicleAndVersion: '1su9Dua5m19lsZToV9UaKNbA0JhVX33s3DrxbDiKud4k',
  docDealers: '1mrNcR1qJYSelql39sxzhbCnuZ1I4XtCT8_SlzyO6Lk4',
})

import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from './../src/app.module'
import { INestApplication } from '@nestjs/common'

const OK_STATUS = 200

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/ (GET)', () =>
    request(app.getHttpServer())
      .get('/')
      .expect(OK_STATUS)
      .expect('Hello World!'))
})

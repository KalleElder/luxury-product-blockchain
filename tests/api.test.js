import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('Blockchain API', () => {
  it('GET /blockchain ska returnera blockkedjan', async () => {
    const response = await request(app)
      .get('/blockchain')

    expect(response.status).toBe(200)
    expect(response.body.chain).toBeDefined()
    expect(response.body.pendingTransactions).toBeDefined()
    expect(response.body.chain).toHaveLength(1)
  })
})

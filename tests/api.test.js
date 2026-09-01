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

describe('Produkt-API', () => {
  it('POST /products ska registrera ett digitalt produktpass', async () => {
    const product = {
      productId: 'watch-002',
      name: 'Luxury Watch',
      owner: 'Alice'
    }

    const response = await request(app)
      .post('/products')
      .send(product)

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Produkten har registrerats')
    expect(response.body.transaction).toEqual({
      type: 'REGISTER',
      ...product
    })
  })
})

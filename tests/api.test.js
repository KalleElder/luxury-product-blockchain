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

describe('Validering av produkt', () => {
  it('POST /products ska returnera 400 om productId saknas', async () => {
    const response = await request(app)
      .post('/products')
      .send({
        name: 'Luxury Watch',
        owner: 'Alice'
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe(
      'productId, name och owner måste anges'
    )
  })
})

describe('Ägarbyte via API', () => {
  it('POST /transfers ska genomföra ett giltigt ägarbyte', async () => {
    await request(app)
      .post('/products')
      .send({
        productId: 'watch-003',
        name: 'Luxury Watch',
        owner: 'Alice'
      })

    await request(app)
      .post('/mine')

    const response = await request(app)
      .post('/transfers')
      .send({
        productId: 'watch-003',
        from: 'Alice',
        to: 'Bob'
      })

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Ägarbytet har registrerats')
    expect(response.body.transaction).toEqual({
      type: 'TRANSFER',
      productId: 'watch-003',
      from: 'Alice',
      to: 'Bob'
    })
  })
})

describe('Ogiltigt ägarbyte via API', () => {
  it('POST /transfers ska neka en avsändare som inte äger produkten', async () => {
    await request(app)
      .post('/products')
      .send({
        productId: 'watch-004',
        name: 'Luxury Watch',
        owner: 'Alice'
      })

    await request(app)
      .post('/mine')

    const response = await request(app)
      .post('/transfers')
      .send({
        productId: 'watch-004',
        from: 'Charlie',
        to: 'Bob'
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe(
      'Avsändaren är inte produktens nuvarande ägare'
    )
  })
})

describe('Verifiering via API', () => {
  it('GET /verify ska returnera om blockkedjan är giltig', async () => {
    const response = await request(app)
      .get('/verify')

    expect(response.status).toBe(200)
    expect(response.body.valid).toBe(true)
  })
})

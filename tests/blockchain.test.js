import { describe, it, expect } from 'vitest'
import Blockchain from '../src/Blockchain.js'

describe('Blockchain', () => {
  it('ska skapa samma SHA-256-hash för samma data', () => {
    const blockchain = new Blockchain()

    const hash1 = blockchain.calculateHash(
      1,
      'previousHash',
      [{ productId: 'watch-001' }],
      10
    )

    const hash2 = blockchain.calculateHash(
      1,
      'previousHash',
      [{ productId: 'watch-001' }],
      10
    )

    expect(hash1).toBe(hash2)
    expect(hash1).toHaveLength(64)
  })
})

describe('Proof-of-Work', () => {
  it('ska mina ett block tills hash börjar med rätt antal nollor', () => {
    const blockchain = new Blockchain()
    blockchain.difficulty = 1

    const block = {
      index: 1,
      transactions: [{ productId: 'watch-001' }],
      previousHash: '0',
      nonce: 0,
      hash: ''
    }

    blockchain.mineBlock(block)

    expect(block.hash.startsWith('0')).toBe(true)
    expect(block.nonce).toBeGreaterThanOrEqual(0)
  })
})

describe('Genesis-block', () => {
  it('ska starta med ett genesis-block i kedjan', () => {
    const blockchain = new Blockchain()

    expect(blockchain.chain).toHaveLength(1)
    expect(blockchain.chain[0].index).toBe(0)
    expect(blockchain.chain[0].previousHash).toBe('0')
    expect(blockchain.chain[0].transactions).toEqual([])
  })
})

describe('Digitala produktpass', () => {
  it('ska kunna registrera en ny produkt som väntande transaktion', () => {
    const blockchain = new Blockchain()

    const product = {
      type: 'REGISTER',
      productId: 'watch-001',
      name: 'Luxury Watch',
      owner: 'Alice'
    }

    blockchain.addTransaction(product)

    expect(blockchain.pendingTransactions).toHaveLength(1)
    expect(blockchain.pendingTransactions[0]).toEqual(product)
  })
})

describe('Mining av produkttransaktioner', () => {
  it('ska mina väntande transaktioner till ett nytt block', () => {
    const blockchain = new Blockchain()

    const product = {
      type: 'REGISTER',
      productId: 'watch-001',
      name: 'Luxury Watch',
      owner: 'Alice'
    }

    blockchain.addTransaction(product)

    const block = blockchain.minePendingTransactions()

    expect(blockchain.chain).toHaveLength(2)
    expect(block.transactions).toContainEqual(product)
    expect(block.previousHash).toBe(blockchain.chain[0].hash)
    expect(block.hash.startsWith('0')).toBe(true)
    expect(blockchain.pendingTransactions).toHaveLength(0)
  })
})

describe('State validation', () => {
  it('ska tillåta ägarbyte när avsändaren är produktens nuvarande ägare', () => {
    const blockchain = new Blockchain()

    blockchain.addTransaction({
      type: 'REGISTER',
      productId: 'watch-001',
      name: 'Luxury Watch',
      owner: 'Alice'
    })

    blockchain.minePendingTransactions()

    const transfer = {
      type: 'TRANSFER',
      productId: 'watch-001',
      from: 'Alice',
      to: 'Bob'
    }

    const result = blockchain.transferProduct(transfer)

    expect(result).toEqual(transfer)
    expect(blockchain.pendingTransactions).toContainEqual(transfer)
  })
})

import crypto from 'crypto'

class Blockchain {
  constructor() {
    this.difficulty = process.env.NODE_ENV === 'test' ? 1 : 2
    this.pendingTransactions = []
    this.chain = [this.createGenesisBlock()]
  }

  createGenesisBlock() {
    return {
      index: 0,
      timestamp: Date.now(),
      transactions: [],
      previousHash: '0',
      nonce: 0,
      hash: '0'
    }
  }

  calculateHash(index, previousHash, transactions, nonce) {
    const data = index + previousHash + JSON.stringify(transactions) + nonce

    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex')
  }

  mineBlock(block) {
    const target = '0'.repeat(this.difficulty)

    while (!block.hash.startsWith(target)) {
      block.nonce++

      block.hash = this.calculateHash(
        block.index,
        block.previousHash,
        block.transactions,
        block.nonce
      )
    }

    return block
  }

  addTransaction(transaction) {
    this.pendingTransactions.push(transaction)

    return transaction
  }

  registerProduct(product) {
    const alreadyRegistered = this.getProductHistory(product.productId)
      .some(transaction => transaction.type === 'REGISTER')

    const waitingForMining = this.pendingTransactions
      .some(transaction =>
        transaction.type === 'REGISTER' &&
        transaction.productId === product.productId
      )

    if (alreadyRegistered || waitingForMining) {
      throw new Error('Produkten är redan registrerad')
    }

    this.pendingTransactions.push(product)

    return product
  }

  minePendingTransactions() {
    const previousBlock = this.chain[this.chain.length - 1]

    const block = {
      index: this.chain.length,
      timestamp: Date.now(),
      transactions: [...this.pendingTransactions],
      previousHash: previousBlock.hash,
      nonce: 0,
      hash: ''
    }

    this.mineBlock(block)
    this.chain.push(block)
    this.pendingTransactions = []

    return block
  }

  getCurrentOwner(productId) {
    let owner = null

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.productId !== productId) {
          continue
        }

        if (transaction.type === 'REGISTER') {
          owner = transaction.owner
        }

        if (transaction.type === 'TRANSFER') {
          owner = transaction.to
        }
      }
    }

    return owner
  }

  getProductHistory(productId) {
    const history = []

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.productId === productId) {
          history.push(transaction)
        }
      }
    }

    return history
  }

  transferProduct(transfer) {
    const currentOwner = this.getCurrentOwner(transfer.productId)

    if (currentOwner !== transfer.from) {
      throw new Error('Avsändaren är inte produktens nuvarande ägare')
    }

    this.pendingTransactions.push(transfer)

    return transfer
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      const calculatedHash = this.calculateHash(
        currentBlock.index,
        currentBlock.previousHash,
        currentBlock.transactions,
        currentBlock.nonce
      )

      if (currentBlock.hash !== calculatedHash) {
        return false
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }

    return true
  }
}

export default Blockchain

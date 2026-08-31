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
}

export default Blockchain

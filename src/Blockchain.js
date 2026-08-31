import crypto from 'crypto'

class Blockchain {
  calculateHash(index, previousHash, transactions, nonce) {
    const data = index + previousHash + JSON.stringify(transactions) + nonce

    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex')
  }
}

export default Blockchain

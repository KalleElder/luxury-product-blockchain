import express from 'express'
import Blockchain from './Blockchain.js'

const app = express()
const blockchain = new Blockchain()

app.use(express.json())

app.get('/blockchain', (req, res) => {
  res.status(200).json({
    chain: blockchain.chain,
    pendingTransactions: blockchain.pendingTransactions
  })
})

export default app

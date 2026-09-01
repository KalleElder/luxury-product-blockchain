import express from 'express'
import Blockchain from './Blockchain.js'
import validateProduct from './middleware/validateProduct.js'

const app = express()
const blockchain = new Blockchain()

app.use(express.json())

app.get('/blockchain', (req, res) => {
  res.status(200).json({
    chain: blockchain.chain,
    pendingTransactions: blockchain.pendingTransactions
  })
})

app.post('/products', validateProduct, (req, res) => {
  const transaction = {
    type: 'REGISTER',
    productId: req.body.productId,
    name: req.body.name,
    owner: req.body.owner
  }

  blockchain.addTransaction(transaction)

  res.status(201).json({
    message: 'Produkten har registrerats',
    transaction
  })
})

export default app

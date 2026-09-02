import express from 'express'
import Blockchain from './Blockchain.js'
import validateProduct from './middleware/validateProduct.js'
import validateTransfer from './middleware/validateTransfer.js'

const app = express()
const blockchain = new Blockchain()

app.use(express.json())

app.get('/blockchain', (req, res) => {
  res.status(200).json({
    chain: blockchain.chain,
    pendingTransactions: blockchain.pendingTransactions
  })
})

app.get('/verify', (req, res) => {
  res.status(200).json({
    valid: blockchain.isChainValid()
  })
})

app.get('/products/:productId', (req, res) => {
  const productId = req.params.productId
  const history = blockchain.getProductHistory(productId)
  const currentOwner = blockchain.getCurrentOwner(productId)

  if (history.length === 0) {
    return res.status(404).json({
      error: 'Produkten hittades inte'
    })
  }

  res.status(200).json({
    productId,
    currentOwner,
    history
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

app.post('/mine', (req, res) => {
  const block = blockchain.minePendingTransactions()

  res.status(201).json({
    message: 'Nytt block har skapats',
    block
  })
})

app.post('/transfers', validateTransfer, (req, res) => {
  const transfer = {
    type: 'TRANSFER',
    productId: req.body.productId,
    from: req.body.from,
    to: req.body.to
  }

  try {
    blockchain.transferProduct(transfer)

    res.status(201).json({
      message: 'Ägarbytet har registrerats',
      transaction: transfer
    })
  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
})

export default app

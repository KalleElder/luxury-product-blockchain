function validateTransfer(req, res, next) {
  const { productId, from, to } = req.body

  if (!productId || !from || !to) {
    return res.status(400).json({
      error: 'productId, from och to måste anges'
    })
  }

  next()
}

export default validateTransfer

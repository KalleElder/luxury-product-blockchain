function validateProduct(req, res, next) {
  const { productId, name, owner } = req.body

  if (!productId || !name || !owner) {
    return res.status(400).json({
      error: 'productId, name och owner måste anges'
    })
  }

  next()
}

export default validateProduct

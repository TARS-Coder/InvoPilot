//const http = require('http')
const express = require('express')
const app = express()
const Product = require("./models/product.js")

// Logger for error logger
const { createLogger, format, transports, Logger, error } = require('winston');
const logger = createLogger({
  format: format.combine(
    format.splat(), 
    format.simple()
  ),
  transports: [new transports.Console()]
});

app.use(express.static('dist'))

const cors = require('cors')
app.use(cors())

app.use(express.json())

app.get('/', (request, response) => {
    const name = request.query.name || "Guest"
    logger.info("Received request for parameter %s", name)
    response.send(`<h1>Welcome ${name}, To S.B. Moters</h1>`)
})

app.get('/api/products', (request, response) => {
  Product.find({}).then(result => {
    response.json(result)
  })
})

app.get('/api/products/:id', (request, response, next) => {
    Product.findById(request.params.id)
    .then(product => {
      if(product)    response.json(product)
      else response.status(404).end()
    })
    .catch(error => next(error))
})

app.delete('/api/products/:id', (request, response, next) => {
  Product.findByIdAndDelete(request.params.id)
    .then(result => {
      if(result){
        logger.info(result)
        response.status(200).json({message: "Product deleted successfully"})
      }else {
        logger.info("Product doesn't exist")
        response.status(404).json({ error: "Product not found" });
      }
    })
    .catch(error => next(error))
})

app.post('/api/products', (request, response, next) => {

    const body = request.body
    
    if(!body.sku || !body.title){
        response.status(400).json({
            error: "Incomplete data",
            body
        })
    }

    const product =  new Product({
        sku: body.sku.toUpperCase(),
        title: body.title,
        description: body.description,
        category: body.category,
        brand: body.brand,
        price: body.price,
        tax_slab: body.tax_slab,
        hsn_code: body.hsn_code,
        is_available: Boolean(body.is_available)
    })

    product.save()
    .then(savedProduct => {
      response.json(savedProduct)
      console.log(savedProduct)
    })
    .catch(error => next(error))
})

app.put('/api/products/:id', (request, response, next) => {
  const product = request.body

  Product.findByIdAndUpdate(request.params.id, product, { new: true })
  .then(updatedProduct => {
      response.json(updatedProduct)
  })
  .catch(error => next(error))  
})

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

//app.use(requestLogger)

const unknownException = (request, response) => {
    response.status(404).send({ error: 'Unknown EndPoint Error (Caught by Middleware)'})
}

app.use(unknownException)

const errorHandler = (error, request, response, next) => {
  logger.info(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 8080 
app.listen(PORT, () => {
  logger.info("Server running on port %s", PORT)
})
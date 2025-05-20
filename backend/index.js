const express = require('express')
const app = express()
const Product = require("./models/product.js")
const Invoice = require("./models/Invoices.js")

// Logger for error logger
const { createLogger, format, transports } = require('winston');
const logger = createLogger({
  format: format.combine(
    format.splat(), 
    format.simple()
  ),
  transports: [new transports.Console()]
});

app.use(express.static('public'))

const cors = require('cors')
app.use(cors())

app.use(express.json())

// Root route
app.get('/', (request, response) => {
    const name = request.query.name || "Guest"
    logger.info("Received request for parameter %s", name)
    response.send(`<h1>Welcome ${name}, To S.B. Moters</h1>`)
})

// ========== Product API Routes ========== //

// GET all products
app.get('/api/products', (request, response) => {
  Product.find({}).then(result => {
    response.json(result)
  })
})

// GET a product by id
app.get('/api/products/:id', (request, response, next) => {
    Product.findById(request.params.id)
    .then(product => {
      if(product) response.json(product)
      else response.status(404).end()
    })
    .catch(error => next(error))
})

// DELETE a product by id
app.delete('/api/products/:id', (request, response, next) => {
  Product.findByIdAndDelete(request.params.id)
    .then(result => {
      if(result){
        logger.info(result)
        response.status(200).json({ message: "Product deleted successfully" })
      } else {
        logger.info("Product doesn't exist")
        response.status(404).json({ error: "Product not found" });
      }
    })
    .catch(error => next(error))
})

// POST a new product
app.post('/api/products', (request, response, next) => {
    const body = request.body
    
    if(!body.sku || !body.title){
        return response.status(400).json({
            error: "Incomplete data",
            body
        })
    }
    
    const product = new Product({
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

// PUT update product by id
app.put('/api/products/:id', (request, response, next) => {
  const product = request.body

  Product.findByIdAndUpdate(request.params.id, product, { new: true })
  .then(updatedProduct => {
      response.json(updatedProduct)
  })
  .catch(error => next(error))  
})

// ========== Invoice API Routes ========== //

// GET next sequential invoice number
app.get('/api/invoices/nextInvoiceNumber', async (req, res) => {
    const currentYear = new Date().getFullYear();
  try {
    // Find the invoice with the highest invoiceNumber (assumes numeric sequence stored as a string)
    const Invoices = await Invoice.find({}, "invoiceNumber -_id")
    if(Invoices.length === 0) res.json(`INV/${currentYear}/001`)

    let maxNumber = 0;
    Invoices.forEach(inv => {
        const part = inv.invoiceNumber.split("/")
        if(part.length === 3 && part[1] === String(currentYear)){
            const invoicenum = Number(part[2])
            if(!isNaN(invoicenum) && invoicenum > maxNumber){
                maxNumber = invoicenum
            }
        }
    })


    const nextNumer = String(maxNumber + 1)
    res.json(`INV/${currentYear}/${nextNumer}`)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch next invoice number', details: error.message });
  }
});

// GET all invoices
app.get('/api/invoices', async (req, res) => {
  try {
    // Since invoice products store static details, no need to populate product IDs
    const invoices = await Invoice.find();
    res.json(invoices)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices', details: error.message })
  }
})

// CREATE a new invoice
app.post('/api/invoices', async (req, res) => {
  try {
    const newInvoice = new Invoice(req.body)
    console.log(newInvoice)
    const savedInvoice = await newInvoice.save()
    res.status(201).json(savedInvoice)
  } catch (error) {
    res.status(400).json({ error: 'Failed to create invoice', details: error.message })
  }
})

// UPDATE an invoice by id
app.put('/api/invoices/:id', async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if(updatedInvoice) res.json(updatedInvoice)
    else res.status(404).json({ error: 'Invoice not found' })
  } catch (error) {
    res.status(400).json({ error: 'Failed to update invoice', details: error.message })
  }
})

// DELETE an invoice by id
app.delete('/api/invoices/:id', async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id)
    if(deletedInvoice) res.status(200).json({ message: 'Invoice deleted successfully' })
    else res.status(404).json({ error: 'Invoice not found' })
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete invoice', details: error.message })
  }
})

// ========== Logging and Error Handlers ========== //

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
// Uncomment the line below to enable request logging
// app.use(requestLogger)

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

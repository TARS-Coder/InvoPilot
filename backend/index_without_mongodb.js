//const http = require('http')

const express = require('express')

const { createLogger, format, transports, Logger } = require('winston');
const logger = createLogger({
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  transports: [new transports.Console()]
});

const app = express()

app.use(express.static('dist'))

const cors = require('cors')
app.use(cors())

let products = [
          {
            "uid": 1,
            "title": "Helix",
            "hsn_code": 98102,
            "tax_slab": 2,
            "is_available": true,
            "id": "6f98"
          },
          {
            "uid": 2,
            "title": "Unicorn",
            "hsn_code": 97532,
            "tax_slab": 2,
            "is_available": true,
            "id": "f02c"
          },
          {
            "uid": 3,
            "title": "Thunder",
            "hsn_code": 12424,
            "tax_slab": 1,
            "is_available": false,
            "id": "c3b2"
          },
          {
            "id": "5178",
            "uid": 5,
            "title": "Deep",
            "hsn_code": 23,
            "tax_slab": 4,
            "is_available": false
          },
          {
            "id": "49f0",
            "uid": 6,
            "title": "Test product",
            "hsn_code": 345678,
            "tax_slab": 5,
            "is_available": true
          }
    ]

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(products))
// })

// When the header of the request is set to application/json the below the given JSON parser ( Express middleware)
// reads the raw JSON data from the request body and parses it into a JavaScript object giving request - body, path, method
app.use(express.json())


app.get('/', (request, response) => {
    const name = request.query.name || "Guest"
    logger.info("Received request for parameter %s", name)
    response.send(`<h1>Welcome ${name}, To S.B. Moters</h1>`)
})

app.get('/api/products', (request, response) => {
    response.json(products)
})

app.get('/api/products/:id', (request, response) => {
    const uid = request.params.id
    const product = products.find(product => product.uid == uid)
    console.log(uid, product)
    if(product)    response.json(product)
    else response.status(404).end()
})

app.delete('/api/products/:id', (request, response) => {
//    const uid = request.params.id
//    const product = products.filter(product => product.title !== uid)
    response.status(204).end()
})


const getuid = () => {
    const maxuid = products.length > 0
    ? Math.max(...products.map(p => p.uid))
    : 0
    return maxuid + 1
}

app.post('/api/products', (request, response) => {

    const body = request.body
    
    if(!body.title || !body.hsn_code || !body.tax_slab){
        response.status(400).json({
            error: "Incomplete data",
            body
        })
    }

    let product =  {
        uid: getuid(),
        title: body.title,
        hsn_code: body.hsn_code,
        tax_slab: body.tax_slab,
        is_available: (body.is_available === undefined || body.is_available === null)
                        ? true
                        : Boolean(body.is_available)
    }

    products = products.concat(product)
//    console.log(product)
    response.json(products)
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


const PORT = process.env.PORT || 8080 
app.listen(PORT, () => {
  logger.info("Server running on port %s", PORT)
})
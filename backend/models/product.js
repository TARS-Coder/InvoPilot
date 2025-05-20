require('dotenv').config();

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

console.log('Connecting to MongoDB...')

// MongoDB Atlas Connection
mongoose.connect(url)
    .then(result =>{
        console.log('Connected to MongoDB successfully')
    })
    .catch(error => {
        console.log('Error connection to MongoDb,', error.message)
    })

// Blue print of the Product
const productSchema = new mongoose.Schema({
    sku : {type: String, required: true}, 
    title : {type: String, required: true}, 
    description: {type: String, default: ""},
    category: {type: String, default: "undefined"},
    brand: {type: String, default: "undefined"},
    price: {type: Number, default: ""},
    hsn_code: {type: Number, default: ""},
    tax_slab: {type: Number, default: ""},
    is_available: {type: Boolean, default: true},
  })

// To modify the  returned data format
productSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
// Creating a collection/table with the defined schema and returns constructor func to interact with the coll
//const Product = mongoose.model('Product', productSchema)
/*
const newProduct = new Product({
  uid: 11,
  title: "Royal Enfield",
  hsn_code: 26827,
  tax_slab: 1,
  is_available: true,
})

//newProduct.save().then( result => console.log("Product saved", result) )
*/

module.exports = mongoose.model("Product", productSchema)  
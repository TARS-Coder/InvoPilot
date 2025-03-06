require('dotenv').config();

const { MongoOIDCError } = require('mongodb');
const mongoose = require('mongoose');
const url = process.env.MONGODB_URI;
/**
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);
 **/

mongoose.set('strictQuery', false)

mongoose.connect(url)

const productSchema = new mongoose.Schema({
  uid : Number, 
  title: String,
  hsn_code: Number,
  tax_slab: Number,
  is_available: Boolean,
  id: String,
})

const Product = mongoose.model('Product', productSchema)
/*
const newProduct = new Product({
  title : "Avenger 220 Street",
  tax_slab: 2,
  is_available : true,
})
newProduct.save().then(result => {
  console.log(" Product Saved!")
  mongoose.connection.close()
})
    */
   
Product.find({}).then(result => {
  result.forEach(p => {
    console.log(p)
  })
})

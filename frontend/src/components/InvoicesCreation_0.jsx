import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, MenuItem } from "@mui/material";
import invoicesActions from "../actions/invoicesActions";
import productsActions from "../actions/productsActions";

const InvoicesCreation = ({ refreshInvoices }) => {
  const [newInvoice, setNewInvoice] = useState({
    invoiceNumber: "",
    customerName: "",
    products: [],  // each product: { productId, quantity, price }
    totalAmount: 0
  });
  
  const [availableProducts, setAvailableProducts] = useState([]);

  // Fetch available products from DB to select from
  useEffect(() => {
    productsActions.getAll()
      .then((data) => setAvailableProducts(data))
      .catch((err) => console.error(err));
  }, []);

  // Example function: add a product from the available list into the invoice
  const addProductToInvoice = (product) => {
    const quantity = 1; // default quantity
    const invoiceProduct = {
      productId: product._id || product.id,
      quantity,
      price: product.price
    };
    setNewInvoice(prev => ({
      ...prev,
      products: [...prev.products, invoiceProduct],
      totalAmount: prev.totalAmount + product.price * quantity
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    invoicesActions.createInvoice(newInvoice)
      .then((result) => {
        console.log("Invoice created:", result);
        // Update the parent state with new list of invoices
        refreshInvoices(prev => [...prev, result]);
        // Reset the form after submission
        setNewInvoice({ invoiceNumber: "", customerName: "", products: [], totalAmount: 0 });
      })
      .catch((err) => console.error(err));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Create New Invoice</Typography>
      <form onSubmit={handleSubmit}>
        <TextField 
          label="Invoice Number" 
          fullWidth 
          margin="normal" 
          value={newInvoice.invoiceNumber} 
          onChange={(e) => setNewInvoice({ ...newInvoice, invoiceNumber: e.target.value })}
          required 
        />
        <TextField 
          label="Customer Name" 
          fullWidth 
          margin="normal" 
          value={newInvoice.customerName} 
          onChange={(e) => setNewInvoice({ ...newInvoice, customerName: e.target.value })}
          required 
        />

        <Typography variant="h6" gutterBottom>Available Products</Typography>
        {availableProducts.map(product => (
          <MenuItem key={product._id || product.id} onClick={() => addProductToInvoice(product)}>
            {product.title} - ₹{product.price}
          </MenuItem>
        ))}

        <Typography variant="h6" gutterBottom>Invoice Products</Typography>
        {newInvoice.products.map((p, index) => (
          <Typography key={index}>
            Product ID: {p.productId} | Quantity: {p.quantity} | Price: ₹{p.price}
          </Typography>
        ))}
        <Typography variant="h6">Total Amount: ₹{newInvoice.totalAmount}</Typography>

        <Button type="submit" variant="contained" color="primary">Create Invoice</Button>
      </form>
    </Container>
  );
};

export default InvoicesCreation;

import React, { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, TextField, MenuItem, Container, IconButton, Box, InputAdornment, 
} from "@mui/material";
import invoicesActions from "../actions/invoicesActions"
import productsActions from "../actions/productsActions"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import CallIcon from '@mui/icons-material/Call';

const InvoicesCreationDialog = ({ open, onClose, refreshInvoices, editInvoice }) => {
  const EMPTY_INVOICE = {
    invoiceNumber: "",
    customerName: "",
    customerAddress: "",
    customerContact: "",
    specifiedDate: "",
    products: [],
    totalAmount: 0,
    totalTax: 0,
    status: "draft", // can be "draft", "balance-due", "paid", etc.
    payments: [],
    balance: 0
  }
  const [invoiceState, setInvoice] = useState(EMPTY_INVOICE);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  // Fetch available products from DB
  useEffect(() => {
    productsActions.getAll()
      .then((data) => setAvailableProducts(data))
      .catch((err) => console.error(err));
  }, []);

  // Auto-generate invoice number when not editing, or load existing invoice for editing
  useEffect(() => {
    if (!editInvoice) {
      invoicesActions.getNextInvoiceNumber().then((num) => {
        setInvoice({...EMPTY_INVOICE, invoiceNumber: num})
      });
    } else {
      setInvoice({
        _id: editInvoice._id,
        invoiceNumber: editInvoice.invoiceNumber || "",
        customerName: editInvoice.customerName || "",
        customerAddress: editInvoice.customerAddress || "",
        customerContact: editInvoice.customerContact || "",
        specifiedDate: editInvoice.specifiedDate || "",
        products: editInvoice.products || [],
        totalAmount: editInvoice.totalAmount || 0,
        totalTax: editInvoice.totalTax || 0,
        status: editInvoice.status || "draft",
        payments: editInvoice.payments || [],
        balance: editInvoice.balance || 0
      });
    }
  }, [editInvoice]);

  const addProductToInvoice = (product) => {
    const invoiceProduct = {
      name: product.title,
      hsnCode: product.hsn_code,
      sku: product.sku,
      quantity: 1,
      price: product.price || "",
      taxSlab: product.tax_slab || 0
    };
    const updatedProducts = [...invoiceState.products, invoiceProduct];
    setInvoice(prev => ({ ...prev, products: updatedProducts }));

//   We could setInvoice by below better method also but for next func ComputeInvoiceTotals
//   setInvoice(prev => ({ ...prev, products: {...prev.products, invoiceProduct} }));

    setSearchQuery("");
    computeInvoiceTotals(updatedProducts);
  };

  const removeProductFromInvoice = (index) => {
    const updatedProducts = invoiceState.products.filter((_, i) => i !== index);
    computeInvoiceTotals(updatedProducts);
  };

  const updateProductDetails = (index, key, value) => {
    const updatedProducts = invoiceState.products.map((p, i) =>
      i === index ? { ...p, [key]: value } : p
    );
    computeInvoiceTotals(updatedProducts);
  };

  const computeInvoiceTotals = (products) => {
//    console.log(products)
    let subtotal = 0;
    let totalTax = 0;
    products.forEach(p => {
      const price = parseFloat(p.price) || 0;
      const quantity = parseInt(p.quantity) || 1;
      const taxRate = parseFloat(p.taxSlab) || 0;
      subtotal += price * quantity;
      totalTax += (price * quantity * taxRate) / 100;
    });
    const totalAmount = subtotal + totalTax;
    let balanceAmount = totalAmount
    invoiceState.payments.map(p => {
      balanceAmount -= p.amount
    })
//    console.log(balanceAmount);
//    const newStatus = balanceAmount <= 0 ? "paid" : "draft";
    setInvoice(prev => ({ ...prev, products, totalAmount, totalTax, balance: balanceAmount }));
  };

  // New: Handle adding payments and updating balance.
  const handlePayment = () => {
    const paymentAmt = parseFloat(paymentAmount) || 0;
    if (paymentAmt <= 0) return;
    const newPayments = [...invoiceState.payments, { amount: paymentAmt, date: new Date().toISOString() }];
    const newBalance = invoiceState.balance - paymentAmt;
    // Optionally update status if balance reaches zero.
    const newStatus = newBalance !== "draft" && newBalance <= 0 ? "paid" : invoiceState.status;
    setInvoice(prev => ({ ...prev, payments: newPayments, balance: newBalance, status: newStatus }));
    setPaymentAmount("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editInvoice) {
      invoicesActions.updateInvoice(invoiceState)
        .then(updatedInvoice => {
          refreshInvoices(prev => prev.map(inv => inv._id === updatedInvoice._id ? updatedInvoice : inv));
        })
        .catch(err => console.error(err));
    } else {
      invoicesActions.createInvoice(invoiceState)
        .then(createdInvoice => {
          refreshInvoices(prev => [...prev, createdInvoice]);
        })
        .catch(err => console.error(err));
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{editInvoice ? "Edit Invoice" : "Create New Invoice"}</DialogTitle>
      <DialogContent>
        <Container maxWidth="md">
          <form id="invoice-form" onSubmit={handleSubmit}>
            <TextField 
              label="Invoice Number" 
              fullWidth 
              margin="normal" 
              value={invoiceState.invoiceNumber || ""}
              disabled 
            />
            <Box display="flex" gap={2} flexWrap="wrap">
              <Box flex={1.75} minWidth="300px">
                <TextField label="Customer Name" fullWidth margin="normal" 
                  value={invoiceState.customerName || ""} 
                  onChange={(e) => setInvoice({ ...invoiceState, customerName: e.target.value })}
                  disabled={editInvoice && editInvoice.status !== "draft"}
                  required 
                />
              </Box>

              <Box flex={1} minWidth="200px">
                <TextField label="Date" fullWidth margin="normal" type="date" slotProps={{ inputLabel: { shrink: true } }}
                  value={invoiceState.specifiedDate ? new Date(invoiceState.specifiedDate).toISOString().split("T")[0] : ""}
                  onChange={(e) => setInvoice({ ...invoiceState, specifiedDate: e.target.value })}
                  disabled={editInvoice && editInvoice.status !== "draft"}
                  required
                />
              </Box>
            </Box>

            <Box display="flex" gap={2} flexWrap="wrap">
              <Box flex={2} minWidth="300px">
                <TextField label="Address" fullWidth margin="normal" 
                  value={invoiceState.customerAddress || ""} 
                  onChange={(e) => setInvoice({ ...invoiceState, customerAddress: e.target.value })}
                  disabled={editInvoice && editInvoice.status !== "draft"}
                />
              </Box>
              <Box flex={1} minWidth="200px">
              <TextField label="Contact" fullWidth margin="normal" type="tel"
                inputMode="numeric" pattern="[0-9]*"
                value={invoiceState.customerContact || ""}
                onChange={(e) => {
                                    const numericValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                                    setInvoice({ ...invoiceState, customerContact: numericValue });
                                }}
                slotProps={{
                  input: { startAdornment: (<InputAdornment position="start"><CallIcon /></InputAdornment>) },
                  htmlInput: { maxLength: 10 }
                }}
                  disabled={editInvoice && editInvoice.status !== "draft"}
              />
              </Box>
            </Box>
            <TextField 
              label="Search Products" 
              fullWidth 
              margin="normal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            {searchQuery.trim().length > 0 && availableProducts
              .filter(p => (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (p.hsn_code && p.hsn_code.toString().includes(searchQuery))
                      )
              .map(product => (
                <MenuItem key={product.id || product._id} onClick={() => addProductToInvoice(product)}>
                  {product.title} - ₹{product.price} &#40; HSN Code : {product.hsn_code} &#41;
                </MenuItem>
            ))}
            <Typography variant="h6" gutterBottom>
              Invoice Products
            </Typography>
            {invoiceState.products.map((p, index) => (
              <div key={index} style={{ marginBottom: 10, display: "flex", alignItems: "center", border: "1px solid rgba(0, 0, 0, 0.87)", padding: "3px 10px", borderRadius: "5px" }}>
                <Box style={{ flex: 1 }}>
                  <Typography style={{display: "inline"}}> {p.name} (HSN: {p.hsnCode}) </Typography>
                  {
                    editInvoice && (
                    <IconButton onClick={() => removeProductFromInvoice(index)} color="error">
                        <DeleteForeverIcon />
                      </IconButton>
                    )
                  }
                </Box>
                <Box style={{ flex: 1}}>
                  <TextField 
                    label="Price" 
                    type="number" 
                    variant="standard"
                    size="small" 
                    value={p.price !== undefined ? p.price : ""}
                    onChange={(e) => updateProductDetails(index, "price", e.target.value)}
                    slotProps={{
                      input: { startAdornment: <InputAdornment position="start">₹</InputAdornment>},
                      htmlInput: { maxLength: 6, min: 1}
                    }}
                    style={{ margin: "auto 10px", width: "100px" }}
                  disabled={editInvoice && editInvoice.status !== "draft"}
                  />
                  <TextField 
                    label="Quantity" 
                    type="number"
                    variant="standard" 
                    size="small" 
                    value={p.quantity || 1}
                    onChange={(e) => updateProductDetails(index, "quantity", parseInt(e.target.value))}
                    style={{ margin: "auto 10px", width: "50px" }}
                  disabled={editInvoice && editInvoice.status !== "draft"}
                  />
                  <TextField 
                    label="Tax (%)" 
                    type="number" 
                    variant="standard" 
                    size="small" 
                    value={p.taxSlab !== undefined ? p.taxSlab : 0}
                    onChange={(e) => updateProductDetails(index, "taxSlab", e.target.value)}
                    slotProps={{
                      htmlInput:{min:0}
                    }}
                    style={{ margin: "auto 10px", width: "50px" }}
                  disabled={editInvoice && editInvoice.status !== "draft"}
                  />
                  <TextField 
                    label="Total" 
                    type="number" 
                    variant="standard" 
                    size="small" 
                    value={((p.price || 0) * (p.quantity || 1) + ((p.price || 0) * (p.quantity || 1) * (p.taxSlab || 0) / 100)).toFixed(2)}
                    slotProps={{
                      input: {readOnly: true},
                      htmlInput:{min:0}
                    }}
                    style={{ margin: "auto 10px", width: "100px" }}
                  disabled={editInvoice && editInvoice.status !== "draft"}
                  />
                </Box>
              </div>
            ))}
            <Box display="flex" flexWrap="wrap">
              <Box flex={1.5}>
                {/* Payment Section */}
                <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>Payments</Typography>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextField 
                  label="Payment Amount" 
                  type="number"
                  value={paymentAmount} 
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    },htmlInput: { maxLength: 6}
                  }}
                  style={{ marginRight: "10px", width: "150px" }}
                  size="small"
                  />
                 <Button variant="outlined" onClick={handlePayment}>Add Payment</Button>
                </div>
                 {invoiceState.payments.map((p, idx) => (
                   <Typography key={idx}>
                    Payment of ₹{p.amount} on {new Date(p.date).toLocaleDateString()}
                  </Typography>
                  ))}
              </Box>
              <Box flex={1}>
                <Typography variant="subtitle1">Taxable Amount = ₹{invoiceState.totalAmount-invoiceState.totalTax}</Typography>
                <Typography variant="subtitle1">Total Tax = ₹{invoiceState.totalTax}</Typography>
                <Typography variant="subtitle1">Total Amount After Tax = ₹{invoiceState.totalAmount}</Typography>
                <Typography variant="subtitle1">Paid = ₹{invoiceState.totalAmount-invoiceState.balance}</Typography>
                <Typography variant="subtitle1">Balance Due = ₹{invoiceState.balance}</Typography>
              </Box>
            </Box>
            
          </form>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button type="submit" form="invoice-form" variant="contained" color="primary">
          {editInvoice ? "Update Invoice" : "Create Invoice"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoicesCreationDialog;
import React, { forwardRef } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Divider } from "@mui/material";

const InvoicePrint = forwardRef(({ invoice }, ref) => {
  return (
    <div ref={ref}>
    <title>{invoice.invoiceNumber}</title>
    <Container className="invoice-container">
      {/* Header Section */}
      <div className="invoice-header">
      <div style={{ display: "flex", justifyContent: "space-between"}}>
        <div>
          <img src="../logo.png" alt="Company Logo" style={{ height: "75px", marginBottom: "-12px" }} />
          <Typography variant="h5" fontWeight="bold">S.B Motors Pvt. Ltd.</Typography>
          <Typography variant="body2">123, Auto Market, Delhi - 110001</Typography>
          <Typography variant="body2">Email: contact@sbmotors.com | Phone: +91 9876543210</Typography>
          <Typography variant="body2">GST No: 07AABCS1234E1Z1</Typography>
        </div>
        <div>
          <Typography variant="h6">Invoice #{invoice.invoiceNumber}</Typography>
          <Typography variant="body2">Date: {new Date(invoice.specifiedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</Typography>
          <Typography variant="body2">Status: 
            {
              {
                "draft": " Draft Invoice",
                "partial": " Paid + Due",
                "paid": " Paid"
              }[invoice.status]
            }</Typography>
        </div>
      </div>

      <Divider style={{ margin: "10px 0" }} />
      
      {/* Customer Details */}
      <Typography variant="h6">Bill To:</Typography>
      <Typography variant="body1">{invoice.customerName}</Typography>
      <Typography variant="body2">{invoice.customerAddress}</Typography>
      <Typography variant="body2">Contact: {invoice.customerContact}</Typography>
      <Divider style={{ margin: "10px 0" }} />

      {/* Product Table */}
      <Table size="small" className="invoice-print-table">
        <TableHead>
          <TableRow>
          <TableCell><b>#</b></TableCell>
          <TableCell><b>Item</b></TableCell>
            <TableCell align="center"><b>HSN Code</b></TableCell>
            <TableCell align="center"><b>Qty</b></TableCell>
            <TableCell align="right"><b>Rate (₹)</b></TableCell>
            <TableCell align="right"><b>Amount (₹)</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoice.products.map((p, index) => (
            <TableRow key={index}>
              <TableCell>{index+1}</TableCell>
              <TableCell>{p.name} (SKU: {p.sku})</TableCell>
              <TableCell align="center">{p.hsnCode}</TableCell>
              <TableCell align="center">{p.quantity}</TableCell>
              <TableCell align="right">{p.price}</TableCell>
              <TableCell align="right">{p.quantity * p.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Divider style={{ margin: "10px 0", borderColor: "rgba(0, 0, 0, 0.12)" }} />
      </div>
      
      {/* Total Amounts */}
      <div className="invoice-summary">
      <Typography variant="h6" align="right">Subtotal: ₹{invoice.totalAmount-invoice.totalTax}</Typography>
      <Typography variant="body1" align="right">Total Tax: ₹{invoice.totalTax}</Typography>
      <Typography variant="h6" align="right"><b>Total: ₹{invoice.totalAmount}</b></Typography>
      <Typography variant="body1" align="right">Balance Due: ₹{invoice.balance}</Typography>
      
      <Divider style={{ margin: "10px 0", borderColor: "rgba(0, 0, 0, 0.12)" }} />
      {/* Signature */}
      <Typography variant="body1" align="right" padding={"0 25px 25px 0"}>Issued by:</Typography>
      </div>
      
      {/* Footer */}
      <div className="invoice-footer">
      <Divider style={{ margin: "10px 0", borderColor: "rgba(0, 0, 0, 0.12)" }} />
      <Typography variant="body2" align="center" position={"bottom"}>
        Thank you for your business! | Email: contact@sbmotors.com | Phone: +91 9876543210
      </Typography>
      </div>
    </Container>
      </div>
  );
})

export default InvoicePrint;

import React, { useState, useEffect } from "react";
import { Button, Container, Typography } from "@mui/material";
import InvoicesList from "./Components/InvoicesList";
import InvoicesCreationDialog from "./Components/InvoicesCreationDialog";
import invoicesActions from "./actions/invoicesActions";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);

  // Fetch invoices on mount
  useEffect(() => {
    invoicesActions.getInvoices()
      .then(data => setInvoices(data))
      .catch(err => console.error(err));
  }, []);

  const handleEdit = (invoice) => {
    setEditInvoice(invoice);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditInvoice(null);
  };

  const refreshInvoices = (updateFunc) => {
    if (typeof updateFunc === 'function') {
      setInvoices(updateFunc(invoices));
    } else {
      setInvoices(updateFunc);
    }
  };

  return (
    <Container maxWidth="lg" style={{textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
            Invoices List
        </Typography>
        
      <InvoicesList invoices={invoices} refreshInvoices={setInvoices} onEdit={handleEdit} />

      <Button 
        variant="contained" 
        color="primary" 
        style={{ position: "fixed", bottom: 20, right: 20 }} 
        onClick={() => setDialogOpen(true)}
      >
        Create New Invoice
      </Button>

      <InvoicesCreationDialog 
        open={dialogOpen} 
        onClose={handleDialogClose} 
        refreshInvoices={refreshInvoices} 
        editInvoice={editInvoice}
      />
    </Container>
  );
};

export default Invoices;

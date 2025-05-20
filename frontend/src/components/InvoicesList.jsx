import React, { useState } from 'react';
import { Container, TableContainer, Table, Typography, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Modal } from '@mui/material';
import AlertDialog from './subComponent/alertDialog';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import invoicesActions from '../actions/invoicesActions';
import DemoInvoicePrinter from './DemoInvoicePrinter'; // import the new component

const InvoicesList = ({ invoices, refreshInvoices, onEdit }) => {
  const [printInvoice, setPrintInvoice] = useState(null);
  const [alertDialog, setAlertDialog] = useState({ open: false, title: null, content: null, onConfirm: () => {} })

  const handleDelete = (id) => {
    setAlertDialog({
      open: true,
      title: "Delete Invoice",
      content: "Are you sure you want to delete this Invoice?",
      onConfirm: () => {
        invoicesActions.deleteInvoice(id)
          .then(() => {
            refreshInvoices(invoices.filter(invoice => invoice._id !== id));
          })
          .catch(err => console.error(err));
      }
    })
  }

  const issueInvoice = (invoice) => {
    setAlertDialog({
      open: true,
      title: "Issue Invoice",
      content: "You can only add payments to it after this, Are you sure you want to issue this invoice?",
      onConfirm: () => {
        invoicesActions.updateInvoice({ ...invoice, status: invoice.balance > 0 ? "partial" : "paid" })
          .then(() => {
            refreshInvoices(invoices.map(inv => (inv._id === invoice._id ? { ...inv, status: invoice.balance > 0 ? "partial" : "paid" } : inv)));
          })
          .catch(err => console.error(err));
      }})
  }

  // Instead of window.print(), set the invoice to be printed
  const handlePrint = (invoice) => {
    setPrintInvoice(invoice);
  };

  const closePrintModal = () => {
    setPrintInvoice(null);
  };

  return (
    <Paper>
    <AlertDialog dialog={alertDialog} setDialog={setAlertDialog} />
        <TableContainer sx={{overflowX: "auto"}}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Invoice No.</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Invoice Date</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Balance Due</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Updated at</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map(invoice => (
              <TableRow key={invoice._id}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>{new Date(invoice.specifiedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</TableCell>
                <TableCell>₹{invoice.totalAmount}</TableCell>
                <TableCell>₹{invoice.balance}</TableCell>
                <TableCell>{invoice.status === "partial" ? "Paid + due" : invoice.status}</TableCell>
                <TableCell>{new Date(invoice.updatedAt).toLocaleString("en-IN", { 
  hour: "2-digit", 
  minute: "2-digit", 
  day: "2-digit", 
  month: "short", 
  year: "numeric", 
})}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(invoice._id)}>
                    <DeleteForeverIcon />
                  </IconButton>
                  {invoice.status === "draft" && (
                    <IconButton color="primary" onClick={() => onEdit(invoice)}>
                      <EditIcon />
                    </IconButton>
                  )}
                  {invoice.status === "partial" && (
                    <IconButton color="success" onClick={() => onEdit(invoice)}>
                      <CurrencyRupeeIcon />
                    </IconButton>
                  )}
                  {
                    invoice.status === "draft" ? (
                      <IconButton color='success' onClick={() => issueInvoice(invoice)}>
                      <DoneAllIcon />
                      </IconButton>
                    ) : (
                      <IconButton color="default" onClick={() => handlePrint(invoice)}>
                        <PrintIcon />
                      </IconButton>
                    )
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Modal for printing the selected invoice */}
      <Modal open={!!printInvoice} onClose={closePrintModal}>
        <div style={{ position: "absolute", top: "10%", left: "10%", width: "80%",color: "#000", background: "#fff", padding: "20px", maxHeight: "80%", overflowY: "auto" }}>
          {printInvoice && <DemoInvoicePrinter invoice={printInvoice} onClose={closePrintModal} />}
        </div>
      </Modal>
    </Paper>
  );
};

export default InvoicesList;

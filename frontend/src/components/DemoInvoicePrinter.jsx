import React, { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@mui/material";
import InvoicePrint from "./InvoicePrint"; // Check this path


const DemoInvoicePrinter = ({ invoice, onClose }) => {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => {
      // Log immediately
//      console.log("Immediate ref:", componentRef.current);
      // Return the ref after a slight delay using a workaround
      if (!componentRef.current) {
        console.error("Ref is not available!");
      }
      return componentRef.current;
    },
  })
    
    return (
    <div>
        <InvoicePrint ref={componentRef} invoice={invoice} />
      <Button onClick={handlePrint} variant="contained" style={{ alignItems: "right", marginTop: "10px" }}>Print Invoice</Button>
      <Button onClick={onClose} style={{ textAlign: "right", marginTop: "10px" }}>Close</Button>
    </div>
  );
};

export default DemoInvoicePrinter;
/*
{isReady && (
  <ReactToPrint
    trigger={() => <Button>Print Invoice</Button>}
    content={() => {
      console.log("from r to p", componentRef.current)
    return componentRef.current }}
  />
)}

*/
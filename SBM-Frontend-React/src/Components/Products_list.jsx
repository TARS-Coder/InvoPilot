import { useState } from "react";
import actions from "../actions/productsActions";
import Alert_Dialog from "./subComponent/alertDialog"
import {  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Typography, Switch, FormControlLabel, Alert, Container,  Paper, Dialog,  DialogTitle, DialogContent, DialogActions, FormControl, TextField, Fab, Chip, IconButton, InputAdornment, MenuItem, Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add"
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart'
import EditIcon from "@mui/icons-material/Edit"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

const Notification = ({ message }) => {
  if (!message) return null;
  return <Alert severity="error">{message}</Alert>
}

const categories = [
    {
        value: 'part',
        label: 'Part',
    },
    {
        value: 'bike',
        label: 'Bike',
    },
    {
        value: 'undefined',
        label: 'Undefined',
    },
]

const brands = [
    {
        value: 'bajaj',
        label: 'Bajaj',
    },
    {
        value: 'hero',
        label: 'Hero Moters',
    },
    {
        value: 'honda',
        label: 'Honda'
    },
    {
        value: 'triumph',
        label: 'Triumph'
    },
    {
        value: 'undefined',
        label: 'Undefined',
    },
]

const tax_slab = [0, 5, 12, 18, 24]

function ProductsList({ products, refreshProducts }) {
  const [onlyAvailable, setOnlyAvailable] = useState(false)
  const [errorMessage, setError] = useState(null)
  const [productDialog, setProductDialog] = useState({
    open: false,
    dialogTitle: "Add New Product",
    dialogButton: "Add Product"
  })
  const [newProduct, setNewProduct] = useState("")
  const productsToShow = onlyAvailable ? products.filter((product) => product.is_available) : products

  const [addProductError, setaddProductError] = useState("")
  const [snackbar, setSnackbar] = useState({open: false, message: ""})
  const [alertdialog, setalertDialog] = useState({open: false, title: "", content: "", onConfirm: () => {}})


const validateAddProduct = () => {
    let tempErr = {}
    if(!newProduct.sku) tempErr.sku = "SKU is required"
    if(!newProduct.title) tempErr.title = "Title is required"
    if(isNaN(newProduct.price) || Number(newProduct.price) < 0) tempErr.price = "Invalid Price"
    if(isNaN(newProduct.hsn_code)) tempErr.hsn_code = "Invalid HSN Code"

    setaddProductError(tempErr)

    return Object.keys(tempErr).length === 0
}


  const toggleAvailability = (id) => {
    const product = products.find((p) => p.id === id);
    const updatedProduct = { ...product, is_available: !product.is_available };
    actions.updateProduct(id, updatedProduct)
      .then((updated) => {
        refreshProducts(products.map((p) => (p.id === id ? updated : p)));
      })
      .catch(() => {
        setError("Failed to update product availability");
        setTimeout(() => setError(null), 5000);
      });
  };

  const handleProductDialog = (event) => {
    event.preventDefault();
    if(validateAddProduct()){
    }else console.log("Error: Invalid product")

    if(newProduct.id) {
        actions.updateProduct(newProduct.id, newProduct)
        .then((updated) => {
            setSnackbar({open: true, message: "Product Updated Successfully"})
            refreshProducts(products.map((p) => (p.id === newProduct.id ? updated : p)));
        })
        .catch(() => {
          setError("Failed to update product availability");
          setTimeout(() => setError(null), 5000);
        });
    }
    else {
        actions.addProduct(newProduct).then((result) => {
            setSnackbar({open: true, message: "Product Added Successfully"})
            refreshProducts([...products, result])
        })
    }

    setProductDialog({ open: false, dialogTitle: "Add New Product", dialogButton: "Add Product",})
}

  const deleteProduct = (id) => {
    setalertDialog({ 
        open: true,
        title: "Delete Confirmation",
        content: "Are you sure you want this Product?",
        onConfirm: () => {
            actions.deleteProduct(id)
            .then((result) => {
                if(result.status == 200) {
                    console.log(id, result.data.message)
                    refreshProducts(products.filter(p => p.id != id))
                    setSnackbar({open: true, message: "Product Deleted Successfully"})
                }
                else if(result.data) console.log(result.data.error)
                else console.log("Status code: ", result.status, ", Status Text: ", result.statusText)
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
            })
        }
        })
  }

  const openProductEditDialog = (id) => {
    const product = products.find(p => p.id === id)

    setNewProduct(product) // Using newProduct state variable to edit the selected variable
    setProductDialog({ open: true, dialogTitle: "Edit Product", dialogButton: "Update Product", })
  }

  const openAddProductDialog = () => {
    setNewProduct({
        sku: "", title: "", description: "", category: "", brand: "", price: "", tax_slab: "",  hsn_code: "", is_available: true,
    })
      setProductDialog({
        open: true,
        dialogTitle: "Add New Product",
        dialogButton: "Add Product",
    })
}  

  return (
    <Container maxWidth="lg" style={{textAlign: "center" }}>
      <Notification message={errorMessage} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        message={snackbar.message}
      />
      <Alert_Dialog dialog={alertdialog} setDialog={setalertDialog}/>
      <Typography variant="h4" gutterBottom>
        Products List
      </Typography>
      <Paper style={{ padding: "20px" }}>
      <TableContainer sx={{overflowX: "auto"}}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Tax Slab</TableCell>
              <TableCell>HSN Code</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productsToShow.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell><Chip label={product.brand} variant="outlined" /></TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.tax_slab}</TableCell>
                <TableCell>{product.hsn_code}</TableCell>
                <TableCell>
                  <Chip
                    label={product.is_available ? "Available" : "Out of Stock"}
                    color={product.is_available ? "success" : "warning"}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => toggleAvailability(product.id)}>
                    {product.is_available ? <RemoveShoppingCartIcon color="warning" /> : <AddShoppingCartIcon color="success"/>}
                  </IconButton>
                  <IconButton onClick={() => openProductEditDialog(product.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteProduct(product.id)}>
                    <DeleteForeverIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        <FormControlLabel
          control={<Switch checked={onlyAvailable} onChange={() => setOnlyAvailable(!onlyAvailable)} />}
          label={onlyAvailable ? "Showing Only Available" : "Showing All Products"}
        />
      </Paper>

      <Fab
        color="primary"
        aria-label="add"
        style={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={() => openAddProductDialog()}
      >
        <AddIcon />
      </Fab>

      {/* Add Product Dialog */}
      <Dialog open={productDialog.open} onClose={() => setProductDialog({...productDialog, open: false})}>
        <DialogTitle>{productDialog.dialogTitle}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">Product Detail</Typography>
          <TextField label="SKU" fullWidth margin="normal" required
           value={newProduct.sku}
           onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
           error={!!addProductError.sku}
           helperText={addProductError.sku}
           slotProps={{ htmlInput: { maxLength: 10 } }}

            />
          <TextField label="Title" fullWidth margin="normal" required
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
            error={!!addProductError.title}
            helperText={addProductError.title}
            slotProps={{ htmlInput: { maxLength: 50 } }}
             />
          <TextField label="Description" fullWidth margin="normal"
           value={newProduct.description} 
           onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
           slotProps={{ htmlInput: { maxLength: 250 } }} 
           />
          <TextField select label="Category" fullWidth margin="normal" value={newProduct.category || ""} onChange={ (e) => setNewProduct({ ...newProduct, category: e.target.value})}>
            {categories.map( (option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
          </TextField>  
          <TextField select label="Brand" fullWidth margin="normal" value={newProduct.brand || ""} onChange={ (e) => setNewProduct({ ...newProduct, brand: e.target.value})}>
          {brands.map( (option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
          </TextField>  
          <Typography variant="subtitle1">Pricing & Tax</Typography>
          <TextField label="Price" fullWidth margin="normal"
          value={newProduct.price || ""}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            },htmlInput: { maxLength: 6}
          }}
          error={!!addProductError.price}
          helperText={addProductError.price}
          />
          <TextField select label="Tax Slab" fullWidth margin="normal" value={newProduct.tax_slab || ""} onChange={ (e) => setNewProduct({ ...newProduct, tax_slab: e.target.value})}>
          {tax_slab.map( (option) => (
                <MenuItem key={option} value={option}>
                    {option} %
                </MenuItem>
            ))}
          </TextField>  

          <TextField label="HSN Code" fullWidth margin="normal"
           value={newProduct.hsn_code || ""}
            onChange={(e) => setNewProduct({ ...newProduct, hsn_code: e.target.value })}
            slotProps={{ htmlInput: { maxLength: 10 } }}
            error={!!addProductError.hsn_code}
            helperText={addProductError.hsn_code}
            />
          </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductDialog({...productDialog, open: false})}>Cancel</Button>
          <Button onClick={handleProductDialog} variant="contained" color="primary">
            {productDialog.dialogButton}
          </Button>
       </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ProductsList;

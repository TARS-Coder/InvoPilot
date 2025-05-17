import { useState } from "react";
import actions from "../actions/productsActions";
import Alert_Dialog from "./subComponent/alertDialog"
import {  
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Typography, Switch, FormControlLabel, Alert, Container, Paper, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, TextField, Fab, Chip, IconButton, InputAdornment, MenuItem, Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add"
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart'
import EditIcon from "@mui/icons-material/Edit"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

const categories = [
    { value: 'part', label: 'Part' },
    { value: 'bike', label: 'Bike' },
    { value: 'undefined', label: 'Undefined' },
]

const brands = [
    { value: 'bajaj', label: 'Bajaj' },
    { value: 'hero', label: 'Hero Moters' },
    { value: 'honda', label: 'Honda' },
    { value: 'triumph', label: 'Triumph' },
    { value: 'undefined', label: 'Undefined' },
]

const tax_slab = [0, 5, 12, 18, 24]

function ProductsList({ products, refreshProducts }) {
  const [onlyAvailable, setOnlyAvailable] = useState(false)
  const [productDialog, setProductDialog] = useState({
    open: false,
    dialogTitle: "Add New Product",
    dialogButton: "Add Product"
  })
  const [productState, setNewProduct] = useState("")
  const productsToShow = onlyAvailable ? products.filter((product) => product.is_available) : products

  const [addProductError, setaddProductError] = useState("")
  const [snackbar, setSnackbar] = useState({open: false, message: ""})
  const [alertdialog, setalertDialog] = useState({open: false, title: "", content: "", onConfirm: () => {}})

  // New state for search and sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  function toggleAvailability(id) {
    const product = products.find((p) => p.id === id);
    const updatedProduct = { ...product, is_available: !product.is_available };
    actions.updateProduct(id, updatedProduct)
      .then((updated) => {
        refreshProducts(products.map((p) => (p.id === id ? updated : p)));
      })
      .catch(() => {
        setSnackbar("Failed to update product availability");
      });
  }

  const validateAddProduct = () => {
    let tempErr = {}
    if(!productState.sku) tempErr.sku = "SKU is required"
    if(!productState.title) tempErr.title = "Title is required"
    if(isNaN(productState.price) || Number(productState.price) < 0) tempErr.price = "Invalid Price"
    if(isNaN(productState.hsn_code)) tempErr.hsn_code = "Invalid HSN Code"

    setaddProductError(tempErr)
    return Object.keys(tempErr).length === 0
  }

  const handleProductDialog = (event) => {
    event.preventDefault();
    if(validateAddProduct()){
      // Proceed with add/update logic
    } else {
      console.log("Error: Invalid product")
    }

    if(productState.id) {
        actions.updateProduct(productState.id, productState)
        .then((updated) => {
            setSnackbar({open: true, message: "Product Updated Successfully"})
            refreshProducts(products.map((p) => (p.id === productState.id ? updated : p)));
        })
        .catch(() => {
          setSnackbar("Failed to update product availability");
        });
    }
    else {
        actions.addProduct(productState).then((result) => {
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
                if(result.status === 200) {
                    console.log(id, result.data.message)
                    refreshProducts(products.filter(p => p.id !== id))
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
    setNewProduct(product) // Using productState state variable to edit the selected product
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

  // Filter products based on searchQuery (search by SKU or Title)
  const filteredProducts = productsToShow.filter(product => {
    return (
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Sort filtered products if sortConfig.key is set
  let finalProducts = [...filteredProducts];
  if(sortConfig.key) {
    finalProducts.sort(
      (a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
      }
    );
  }

  // Toggle sorting on column header click
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // --- End New Code ---

  return (
    <Container maxWidth="lg" style={{ textAlign: "center" }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
      <Alert_Dialog dialog={alertdialog} setDialog={setalertDialog}/>
      <Typography variant="h4" gutterBottom>
        Products List
      </Typography>

      {/* Search Field */}
      <TextField
        label="Search Products (by SKU or Title)"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        style={{ marginBottom: "10px" }}
      />

      <Paper style={{ padding: "1px" }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {/* Sortable Columns */}
                <TableCell onClick={() => requestSort("sku")} style={{ cursor: "pointer" }}>
                  SKU {sortConfig.key === "sku" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "↕"}
                </TableCell>
                <TableCell onClick={() => requestSort("title")} style={{ cursor: "pointer" }}>
                  Title {sortConfig.key === "title" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "↕"}
                </TableCell>
                {/* Non-sortable Columns */} 
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell onClick={() => requestSort("price")} style={{ cursor: "pointer" }}>
                  Price {sortConfig.key === "price" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "↕"}
                </TableCell>
                <TableCell>Tax Slab</TableCell>
                <TableCell>HSN Code</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {finalProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Chip label={product.brand} variant="outlined" />
                  </TableCell>
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
                      {product.is_available ? <RemoveShoppingCartIcon color="warning" /> : <AddShoppingCartIcon color="success" />}
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

      {/* Add/Edit Product Dialog */}
      <Dialog open={productDialog.open} onClose={() => setProductDialog({ ...productDialog, open: false })}>
        <DialogTitle>{productDialog.dialogTitle}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">Product Details</Typography>
          <TextField 
            label="SKU" 
            fullWidth 
            margin="normal" 
            required
            value={productState.sku}
            onChange={(e) => setNewProduct({ ...productState, sku: e.target.value })}
            error={!!addProductError.sku}
            helperText={addProductError.sku}
            slotProps={{ htmlInput: { maxLength: 10 } }}
          />
          <TextField 
            label="Title" 
            fullWidth 
            margin="normal" 
            required
            value={productState.title}
            onChange={(e) => setNewProduct({ ...productState, title: e.target.value })}
            error={!!addProductError.title}
            helperText={addProductError.title}
            slotProps={{ htmlInput: { maxLength: 50 } }}
          />
          <TextField 
            label="Description" 
            fullWidth 
            margin="normal"
            value={productState.description} 
            onChange={(e) => setNewProduct({ ...productState, description: e.target.value })}
            slotProps={{ htmlInput: { maxLength: 250 } }} 
          />
          <TextField 
            select 
            label="Category" 
            fullWidth 
            margin="normal" 
            value={productState.category || ""} 
            onChange={(e) => setNewProduct({ ...productState, category: e.target.value })}
          >
            {categories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>  
          <TextField 
            select 
            label="Brand" 
            fullWidth 
            margin="normal" 
            value={productState.brand || ""} 
            onChange={(e) => setNewProduct({ ...productState, brand: e.target.value })}
          >
            {brands.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>  
          <Typography variant="subtitle1">Pricing & Tax</Typography>
          <TextField 
            label="Price" 
            fullWidth 
            margin="normal"
            value={productState.price || ""}
            onChange={(e) => setNewProduct({ ...productState, price: e.target.value })}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              },
              htmlInput: { maxLength: 6 }
            }}
            error={!!addProductError.price}
            helperText={addProductError.price}
          />
          <TextField 
            select 
            label="Tax Slab" 
            fullWidth 
            margin="normal" 
            value={productState.tax_slab || ""} 
            onChange={(e) => setNewProduct({ ...productState, tax_slab: e.target.value })}
          >
            {tax_slab.map((option) => (
              <MenuItem key={option} value={option}>
                {option} %
              </MenuItem>
            ))}
          </TextField>  
          <TextField 
            label="HSN Code" 
            fullWidth 
            margin="normal"
            value={productState.hsn_code || ""}
            onChange={(e) => setNewProduct({ ...productState, hsn_code: e.target.value })}
            slotProps={{ htmlInput: { maxLength: 10 } }}
            error={!!addProductError.hsn_code}
            helperText={addProductError.hsn_code}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductDialog({ ...productDialog, open: false })}>Cancel</Button>
          <Button onClick={handleProductDialog} variant="contained" color="primary">
            {productDialog.dialogButton}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ProductsList;

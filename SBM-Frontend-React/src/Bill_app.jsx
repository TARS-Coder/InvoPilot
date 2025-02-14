import { useState, useEffect } from "react";
import Products_list from './Components/Products_list.jsx'
import actions from './actions/productsActions.jsx'

const Footer = () => {
    const footerStyle = {
        color: 'green',
        fontStyle: 'italic',
        fontSize: 16,
        border: '2px solid green',
        borderRadius: '15px',
        padding: '5px',
        textAlign: 'center'

    }
    return (
        <div style={footerStyle}>
        <em>Billing App, Made by TARS 2024</em>
        </div>
    )
}

function Bill_app () {

    const [products_list, setProducts] = useState([]);

// Effect hook is used to connect and synchronise with external sytems
    useEffect(() => {
// Axios is a library used to fetch data through promises in a better way
        actions.getAll()
        .then(products => setProducts(products))
    }, [])

    const [product_uid, setuid] = useState("000")
    const [product_title, setTitle] = useState("Add Product Title ...")
    const [product_hsn_code, setHsnCode] = useState("Add 5 digits HSN Code")
    const [product_tax_slab, setTaxSlab] = useState(3)
    const [product_is_available, setAvailabilty] = useState(true);


//  To add new product    
    const addProduct = (event) => {
        event.preventDefault()
//        console.log("Add Product Button is Clicked", event.target)
        const formData = new FormData(event.target);
        const formJson = Object.fromEntries(formData.entries());
        formJson.uid = parseInt(formJson.uid,10);
        formJson.hsn_code = parseInt(formJson.hsn_code,10);
        formJson.tax_slab = parseInt(formJson.tax_slab,10);
        formJson.is_available = formJson.is_available === 'true'; // Convert is_available to boolean

        actions.addProduct(formJson)
        .then(result => setProducts(products_list.concat(result)))
    }

    const refreshProducts = (p) => setProducts(p)


    return (
        <>
        <h2>Products List</h2>
        <Products_list products={products_list} refreshProducts={refreshProducts}/>

        <h3>Add New Product</h3>
        <form onSubmit={addProduct}>
            <label className="formlabel">
                UID: 
                <input name="uid" value={product_uid} onChange={(e) => setuid(e.target.value)} />
            </label>
            <hr/>
            <label className="formlabel">
                Title: 
                <input name="title" value={product_title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <hr/>
            <label className="formlabel">
                HSN Code: 
                <input name="hsn_code" value={product_hsn_code} onChange={(e) => setHsnCode(e.target.value)} />
            </label>
            <hr/>
            <label className="formlabel">
                Tax Slab:
                <select name="tax_slab" value={product_tax_slab} onChange={e => setTaxSlab(e.target.value)}>
                    <option disabled={true}>Select the Applicable Tax Slab</option>    
                    <option value={1}>0%</option>    
                    <option value={2}>5%</option>    
                    <option value={3}>12%</option>    
                    <option value={4}>18%</option>    
                    <option value={5}>28%</option>    
                </select> 
            </label>
            <hr/>
            Inventory:  
            <label className="formlabel">
                <input type="radio" name="is_available" value={true} checked={product_is_available && true} onChange={() => setAvailabilty(true)} /> Available
            </label>
            <label className="formlabel">
                <input type="radio" name="is_available" value={false} checked={!product_is_available} onChange={() => setAvailabilty(false)}/> Not Available
            </label>
            <hr/>
            <button type="submit">Add Product</button>
        </form>
        <Footer/>
        </>
    )
}

export default Bill_app;
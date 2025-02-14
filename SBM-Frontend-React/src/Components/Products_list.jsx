import { useState } from "react";
import actions from "../actions/productsActions.jsx"

const Notification = ({message}) => {
    if(message === null) return null

    return (
        <div className="error">
            {message}
        </div>
    )
}


function Products_list ({products, refreshProducts}) {

    const [onlyavailable, toggleOnlyAvailable] = useState(true)
    const [error_message, setError] = useState(null);
    const productsToShow = onlyavailable ? products.filter(product => product.is_available === true) : products

    // Function to toggle availability of the product
    const inventoryUpdate = (uid) => {
        const findProduct = products.find(product => product.uid === uid)
        const updateProduct = { ...findProduct, "is_available": !findProduct.is_available}
        actions.toggleAvailabilty(uid, updateProduct)
        .then(updatedProduct => {
            refreshProducts(products.map( prod => prod.uid === uid ? updatedProduct : prod))
        })
        .catch(error => {
            setError("Failed to update product availability")
            setTimeout(() => {
                setError(null)
            }, 5000)
            refreshProducts(products.filter(prod => prod.uid !== uid))
        }
        )
    }                        

    return(
        <>
        <Notification message={error_message} />
        <table border='1px solid' cellPadding='5px'>
        <thead>
        <tr>
            <th>Unique Id</th>
            <th>HSN Code</th>
            <th>Title</th>
            <th>Tax Slab</th>
            <th>Inventory</th>
            <th></th>
        </tr></thead>
        <tbody>
        {productsToShow.map( product => 
            <tr key={product.id}>
                <td>{product.uid}</td>
                <td>{product.hsn_code}</td>
                <td>{product.title}</td>
                <td>{product.tax_slab}</td>
                <td>{product.is_available ? "Available" : "Not Available" }</td>
                <td>
                    <button onClick={() => {inventoryUpdate(product.uid)}}>
                        { product.is_available ? "Update as Out of Stock" : "Update Available " }
                    </button>
                </td>
            </tr>
         )}
         </tbody>
    </table><br/>
    <button onClick={() => toggleOnlyAvailable(!onlyavailable)}> {onlyavailable ? "Display All" : "Show only Available"} </button>
    <hr/>
    </>

    )
}

export default Products_list;
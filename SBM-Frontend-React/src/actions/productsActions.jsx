import axios from "axios";

// URl to connect to Insite JSON Server
// const baseUrl = "http://localhost:3001/products"

// URL to connect to Seperate Node package
const baseUrl = "/api/products"

const getAll = () => {
    const request = axios.get(baseUrl)
    const nonExist = {
        "uid": 12,
        "title": "Scrambler",
        "hsn_code": 97532,
        "tax_slab": 2,
        "is_available": true,
        "id": 23
      }
    return request.then(response => response.data.concat(nonExist))
}

const addProduct = (data) => {
    const request = axios.post(baseUrl, data)
    return request.then(response => response.data)
}

const toggleAvailabilty = (id,changeProduct) => {
    const url = `http://localhost:8080/api/products/${id}`;

    const request = axios.put(url, changeProduct)
    return request.then(response => response.data)

}

// export default {    getAll: getAll, addProduct: addProduct}
export default { getAll, addProduct, toggleAvailabilty}
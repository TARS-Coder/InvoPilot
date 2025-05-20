import axios from "axios";

// URl to connect to Insite JSON Server
// const baseUrl = "http://localhost:3001/products"

// URL to connect to Seperate Node package
const baseUrl = "/api/products"

const getAll = () => {
    const request = axios.get(baseUrl)
    const nonExist = {
        "uid": 12,
        "title": "Ducati",
        "hsn_code": 97532,
        "tax_slab": 2,
        "is_available": true,
        "id": 23
      }
//    return request.then(response => response.data.concat(nonExist))
      return request.then(response => response.data)
}

const addProduct = async (data) => {
    const request = axios.post(baseUrl, data)
    try {
        const response = await request
        return response.data
    } catch (error) {
        return error.response;
    }
}

const updateProduct = async (id,changeProduct) => {
    const url = `${baseUrl}/${id}`

    const request = axios.put(url, changeProduct)
    const response = await request;
    return response.data;

}

const deleteProduct = async (id) => {
    const url = `${baseUrl}/${id}`

    const request = axios.delete(url)
    try {
        const response = await request;
        return response;
    } catch (error) {
        return error.response
    }
}


// export default {    getAll: getAll, addProduct: addProduct}
export default { getAll, addProduct, updateProduct, deleteProduct}
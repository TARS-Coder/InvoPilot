import { useState, useEffect } from "react";
import Products_list from "./components/Products_list"
import actions from "./actions/productsActions";

function Products() {
  const [products_list, setProducts] = useState([]);

  useEffect(() => {
    actions.getAll().then((products) => setProducts(products));
  }, []);

  return (
      <Products_list products={products_list} refreshProducts={setProducts} />
  )
}

export default Products;

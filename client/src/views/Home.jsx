import React, { useState, useEffect } from "react";
import { FaCartShopping } from "react-icons/fa6";
import Product from "../components/Product";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Home() {
  const cart = useSelector((state) => state.productCart.cart);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((json) => {
        setProducts(json);
      })
      .catch((err) => console.log("Error Fetching Products !!"));
  }, []);

  const handleCartClick = () => {
    if (cart.length === 0) return alert("Cart is Empty");
    navigate("/checkout");
  };

  return (
    <div className="home">
      <div className="nav">
        <h1>Products</h1>
        <div className="cart-container" onClick={handleCartClick}>
          <FaCartShopping size={20} />
          <span className="totalProducts">
            {cart.reduce((acc, item) => {
              return acc + item.quantity;
            }, 0)}
          </span>
        </div>
      </div>
      <div className="main">
        {products?.map((item) => (
          <Product key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Home;

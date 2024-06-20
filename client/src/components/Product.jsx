import React from "react";
import { addToCart, removeFromCart } from "../reducers/productCart";
import { useDispatch, useSelector } from "react-redux";

const Product = ({ item }) => {
  const cart = useSelector((state) => state.productCart.cart);
  const dispatch = useDispatch();
  const handleAdd = (e, item) => {
    e.preventDefault();
    dispatch(addToCart(item));
  };
  const handleRemove = (e, item) => {
    e.preventDefault();
    dispatch(removeFromCart(item.id));
  };

  return (
    <div className="product">
      <div className="image-container">
        <img src={item.image} alt="product-image" />
      </div>
      <div className="product-detailContainer">
        <p className="title">{item.title}</p>
        <span className="price">₹{item.price}</span>

        {cart.findIndex((cartItem) => cartItem.id === item.id) === -1 ? (
          <button className="btn" onClick={(e) => handleAdd(e, item)}>
            Add to cart
          </button>
        ) : (
          <div className="cart-buttons">
            <button className="btn" onClick={(e) => handleRemove(e, item)}>
              -
            </button>
            <span>
              {cart.find((cartItem) => cartItem.id === item.id).quantity}
            </span>
            <button className="btn" onClick={(e) => handleAdd(e, item)}>
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Product from "../components/Product";
import { FaArrowLeft } from "react-icons/fa";

import { loadStripe } from "@stripe/stripe-js";

const ProductCart = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.productCart.cart);

  const [email, setEmail] = useState("");

  const uniqueCart = cart.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id)
  );

  const makePayment = async (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (email === "") {
      alert("Please enter your email");
      return;
    }

    const stripe = await loadStripe(
      "pk_test_51NqdmnSA0EJFzhq6vfCvW3BqsiYDzgProLLkrfOK3Vo6sg7MJeBMWlTsA2eqgTzQXefJo5TuWjcYPy8Qx2ORL6ss00cLcuSAcc"
    );

    const body = {
      products: cart,
      email: email,
    };

    const response = await fetch(
      "http://127.0.0.1:5000/api/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const session = await response.json();

    localStorage.setItem("orderId", session.id);
    localStorage.setItem("transactionId", session.payment_intent);

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <div className="product-cart">
      <div className="cartHeader">
        <h1>
          <span onClick={() => navigate("/")}>
            <FaArrowLeft />
          </span>
          Products cart
        </h1>
      </div>
      <div className="product-container">
        {uniqueCart.map((item) => (
          <Product key={item.id} item={item} />
        ))}
      </div>
      <div className="product-detail">
        <h2>
          Total Products: {cart.reduce((acc, item) => acc + item.quantity, 0)}
        </h2>
        <h2>
          Total Price:{" "}
          {"₹" +
            cart
              .reduce((acc, item) => acc + item.price * item.quantity, 0)
              .toFixed(2)}
        </h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn" onClick={makePayment}>
          Check out
        </button>
      </div>
    </div>
  );
};

export default ProductCart;

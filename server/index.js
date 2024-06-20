require("dotenv").config();
const stripe = require("stripe")(process.env.SECRET_KEY);
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/orderDetails");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  email: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      title: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  paymentStatus: { type: String, default: "pending" },
  transactionId: { type: String },
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", orderSchema);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { products, email } = req.body;

    const lineItems = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.title,
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    const newOrder = new Order({
      orderId: session.id,
      email: email,
      products: products.map((item) => ({
        productId: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    await newOrder.save();

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/update-payment-status", async (req, res) => {
  try {
    const { orderId, transactionId } = req.body;

    const order = await Order.findOne({ orderId: orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = "completed";

    await order.save();

    res.json({ message: "Payment status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

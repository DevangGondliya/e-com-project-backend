const express = require("express");
const {
  createOrder,
  deleteOrder,
  updateOrder,
  fetchAllOrders,
  fetchOrdersByUser,
} = require("../controller/Order");

const router = express.Router();

router
  .get("/user", fetchOrdersByUser)
  .post("/", createOrder)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder)
  .get("/", fetchAllOrders);

module.exports = router;

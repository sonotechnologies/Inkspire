const express = require("express");
const { PrismaClient } = require("@prisma/client");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
const prisma = new PrismaClient();

/*
CREATE ORDER FROM CART
*/

router.post("/create", protect, async (req, res) => {

  const userId = req.user.id;

  const {
    fullName,
    address,
    city,
    phone,
    note
  } = req.body;

  try {

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { book: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.book.price * item.quantity,
      0
    );

    const shipping = 1500;

    const order = await prisma.order.create({

      data: {
        userId,
        fullName,
        address,
        city,
        phone,
        note,
        total: subtotal + shipping,
        shipping,

        items: {
          create: cartItems.map(item => ({
            bookId: item.bookId,
            quantity: item.quantity,
            price: item.book.price
          }))
        }
      }

    });

    await prisma.cartItem.deleteMany({
      where: { userId }
    });

    res.json(order);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Order creation failed"
    });

  }

});

/*
GET USER ORDERS
*/

router.get("/", protect, async (req, res) => {

  const userId = req.user.id;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { book: true }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  res.json(orders);

});

module.exports = router;
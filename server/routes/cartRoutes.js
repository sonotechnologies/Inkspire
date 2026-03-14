const express = require("express");
const { PrismaClient } = require("@prisma/client");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
const prisma = new PrismaClient();

/*
=========================
ADD TO CART
POST /cart/add
=========================
*/

router.post("/add", protect, async (req, res) => {
  console.log("TOKEN USER:", req.user);
  console.log("BODY:", req.body);

  const userId = Number(req.user.userId);
  const bookId = Number(req.body.bookId);

  console.log("PARSED userId:", userId);
  console.log("PARSED bookId:", bookId);

  if (!userId || isNaN(bookId)) {
    return res.status(400).json({ error: "Invalid userId or bookId" });
  }

  

  try {

    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId
        }
      }
    });

    if (existing) {

      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + 1
        }
      });

      return res.json(updated);
    }

    const newItem = await prisma.cartItem.create({
      data: {
        userId,
        bookId,
        quantity: 1
      }
    });

    res.json(newItem);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to add item to cart"
    });

  }
});

/*
=========================
GET CART
GET /cart/:userId
=========================
*/

router.get("/:userId",protect, async (req, res) => {

  const userId = Number(req.params.userId);

  try {

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        book: true
      }
    });

    res.json(cartItems);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to fetch cart"
    });

  }
});

/*
=========================
UPDATE QUANTITY
PUT /cart/update/:cartItemId
=========================
*/

router.put("/update/:cartItemId", protect, async (req, res) => {

  const id = Number(req.params.cartItemId);
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({
      error: "Quantity must be at least 1"
    });
  }

  try {

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity }
    });

    res.json(updated);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to update quantity"
    });

  }

});

/*
=========================
REMOVE ITEM
DELETE /cart/remove/:cartItemId
=========================
*/

router.delete("/remove/:cartItemId", protect, async (req, res) => {

  const id = Number(req.params.cartItemId);

  try {

    await prisma.cartItem.delete({
      where: { id }
    });

    res.json({
      message: "Item removed from cart"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to remove item"
    });

  }

});

/*
=========================
CLEAR CART
DELETE /cart/clear/:userId
=========================
*/

router.delete("/clear/:userId", protect, async (req, res) => {

  const userId = Number(req.params.userId);

  try {

    await prisma.cartItem.deleteMany({
      where: { userId }
    });

    res.json({
      message: "Cart cleared"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to clear cart"
    });

  }

});

module.exports = router;
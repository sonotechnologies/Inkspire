const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const prisma = new PrismaClient();
const path = require("path");

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

/*
=========================
USE ROUTES
=========================
*/
app.use("/profile", require("./routes/profile"));
app.use("/orders", orderRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
/*
=========================
ROOT
=========================
*/

app.get("/", (req, res) => {
  res.send("API running 🚀");
});

/*
=========================
BOOKS ROUTES
=========================
*/

/* GET ALL BOOKS */

app.get("/books", async (req, res) => {
  try {

    const books = await prisma.book.findMany();

    res.json(books);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to fetch books"
    });

  }
});

/* GET SINGLE BOOK */

app.get("/books/:id", async (req, res) => {

  const id = Number(req.params.id);

  if (!id) {
    return res.status(400).json({
      error: "Invalid book ID"
    });
  }

  try {

    const book = await prisma.book.findUnique({
      where: { id }
    });

    if (!book) {
      return res.status(404).json({
        error: "Book not found"
      });
    }

    res.json(book);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to fetch book"
    });

  }

});

/*
=========================
SERVER
=========================
*/

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
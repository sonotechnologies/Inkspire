const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadAvatar");

const fs = require("fs");
const path = require("path");

router.post(
  "/avatar",
  protect,
  upload.single("avatar"),
  async (req, res) => {

    try {

      const user = await prisma.user.findUnique({
        where: { id: req.user.userId }
      });

      /*
      =========================
      DELETE OLD AVATAR
      =========================
      */

      if (user.avatar) {

        const oldAvatarPath = path.join(
          __dirname,
          "..",
          user.avatar
        );

        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }

      }

      /*
      =========================
      SAVE NEW AVATAR
      =========================
      */

      const avatarPath = `/uploads/avatars/${req.file.filename}`;

      const updatedUser = await prisma.user.update({

        where: {
          id: req.user.userId
        },

        data: {
          avatar: avatarPath
        }

      });

      res.json(updatedUser);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: "Avatar upload failed"
      });

    }

  }
);

/*
=========================
GET USER PROFILE
=========================
*/

router.get("/", protect, async (req, res) => {

  try {

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true
      }
    });

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }

});


/*
=========================
UPDATE USER PROFILE
=========================
*/

router.put("/update", protect, async (req, res) => {

  const { name, email } = req.body;

  try {

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        name,
        email
      }
    });

    res.json(updatedUser);

  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }

});


/*
=========================
DELETE ACCOUNT
=========================
*/

router.delete("/delete", protect, async (req, res) => {

  try {

    await prisma.user.delete({
      where: { id: req.user.userId }
    });

    res.json({ message: "Account deleted" });

  } catch (error) {
    res.status(500).json({ error: "Failed to delete account" });
  }

});


/*
=========================
TRANSACTION HISTORY
=========================
*/

router.get("/orders", protect, async (req, res) => {

  try {

    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: {
        items: {
          include: {
            book: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }

});

module.exports = router;
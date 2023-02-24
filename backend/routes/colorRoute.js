const express = require("express");
const { createColor, updateColor, deleteColor, getAllColor, getColor } = require("../controller/colorCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", getAllColor);
router.get("/:id", getColor);
router.post("/", authMiddleware, isAdmin, createColor);
router.put("/:id", authMiddleware, isAdmin, updateColor);
router.delete("/:id", authMiddleware, isAdmin, deleteColor);


module.exports = router;
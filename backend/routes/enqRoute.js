const express = require("express");
const { createEnquiry, updateEnquiry, deleteEnquiry, getAllEnquiry, getEnquiry } = require("../controller/enqCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", getAllEnquiry);
router.get("/:id", getEnquiry);
router.post("/", authMiddleware, createEnquiry);
router.put("/:id", authMiddleware, updateEnquiry);
router.delete("/:id", authMiddleware, deleteEnquiry);


module.exports = router;
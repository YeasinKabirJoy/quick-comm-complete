const express = require("express");
const { createBrnad, updateBrnad, deleteBrand, getAllBrand, getBrand } = require("../controller/brandCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/",getAllBrand);
router.get("/:id",getBrand);
router.post("/",authMiddleware,isAdmin,createBrnad);
router.put("/:id",authMiddleware,isAdmin,updateBrnad);
router.delete("/:id",authMiddleware,isAdmin,deleteBrand);


module.exports = router;
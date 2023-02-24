const express = require("express");
const {
    createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    rating,
    uploadImages,
    deleteImages,
} = require("../controller/productCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
    uploadPhoto,
    productImgResize,
} = require("../middlewares/uploadImages");
const router = express.Router();

router.put(
    "/upload/:id",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 10),
    productImgResize,
    uploadImages
);
router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);
router.post("/", authMiddleware, isAdmin, createProduct);

router.get("/:id", getProduct);
router.put("/rating", authMiddleware, rating);

router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/", getAllProduct);

module.exports = router;

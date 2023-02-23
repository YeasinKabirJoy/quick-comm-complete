const express = require('express');
const {
    createUser,
    loginUserCtrl,
    getAllUser,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    addToWishlist,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
} = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();




router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/all-users", getAllUser);

router.post("/cart", authMiddleware, userCart)
router.post("/cart/applycoupon", authMiddleware, applyCoupon)
router.get("/cart", authMiddleware, getUserCart)
router.delete("/empty-cart", authMiddleware, emptyCart)
router.put("/password", authMiddleware, updatePassword);
router.put("/wishlist", authMiddleware, addToWishlist);
router.get("/wishlist", authMiddleware, getWishlist);



router.put("/update-user", authMiddleware, updateUser);
router.put("/save-address", authMiddleware, saveAddress);

router.delete("/:id", authMiddleware, isAdmin, deleteUser);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);


module.exports = router;

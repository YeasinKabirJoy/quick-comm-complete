const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto")


// Create a User
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findAdmin = await User.findOne({ email: email });
    if (!findAdmin) {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error("User Already exists")
    }
});

// Login A User
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    //check if user exists or not
    const findAdmin = await User.findOne({ email: email });
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findAdmin?.id);
        const updateuser = await User.findByIdAndUpdate(
            findAdmin.id,
            {
                refreshToken: refreshToken,
            },
            {
                new: true
            });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });
    } else {
        throw new Error("Invalild Credentials")
    }
});

// Admin login

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    //check if user exists or not
    const findAdmin = await User.findOne({ email: email });
    if (findAdmin.role != 'admin') throw new Error("Not Authorized")
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findAdmin?.id);
        const updateuser = await User.findByIdAndUpdate(
            findAdmin.id,
            {
                refreshToken: refreshToken,
            },
            {
                new: true
            });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });
    } else {
        throw new Error("Invalild Credentials")
    }
});

// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error(" No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
});

// LOGOUT

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken)
        throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({ refreshToken });

    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        });
        res.sendStatus(204); // forbidden
    }

    await User.findOneAndUpdate(refreshToken,
        {
            refreshToken: ""
        });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });
    res.sendStatus(204);

});


// UPDATE A USER
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        const updatedUser = await User.findByIdAndUpdate(_id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body.email,
                mobile: req?.body.mobile,
            },

            {
                new: true,
            }

        );
        res.json(updatedUser)
    } catch (error) {
        throw new Error(error)
    }
});

// SAVE USER ADDRESS

const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        const updatedUser = await User.findByIdAndUpdate(_id,
            {
                address: req?.body.address,
            },

            {
                new: true,
            }

        );
        res.json(updatedUser)
    } catch (error) {
        throw new Error(error)
    }
});


// GET ALL USER
const getAllUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find()
        res.json(getUsers)
    } catch (error) {
        throw new Error(error)
    }
});

// GET A SINGLE USER
const getUser = asyncHandler(async (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    try {
        const getUser = await User.findById(id);
        res.json({ getUser });
    } catch (error) {
        throw new Error(error)
    }
});

// DELETE A USER
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deletedUser = await User.findByIdAndDelete(id)
        res.json(deletedUser == null ? "User Does not Exists" : deletedUser)
    } catch (error) {
        throw new Error(error)
    }
});

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true
            },
            {
                new: true
            }
        );
        res.json(block);
    } catch (error) {
        throw new Error(error)
    }
});

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false
            },
            {
                new: true
            }
        );
        res.json({
            msg: "User Unblocked",
        })
    } catch (error) {
        throw new Error(error)
    }
});

const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(user);
    }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    console.log(email)
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:8000/api/user/reset-password/${token}'>Click Here</a>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            htm: resetURL,
        };
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error);
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error(" Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    validateMongoDbId(_id);
    try {
        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);

        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull: { wishlist: prodId },
                },
                {
                    new: true,
                }
            );
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push: { wishlist: prodId },
                },
                {
                    new: true,
                }
            );
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
});

const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const findUser = await User.findById(_id).populate("wishlist");
        res.json(findUser)
    } catch (error) {
        throw new Error(error);
    }
});

const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    console.log(req.user);
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        let products = [];
        const user = await User.findById(_id);
        const alreadyExistCart = await Cart.findOne({ orderBy: user._id });
        if (alreadyExistCart) {
            alreadyExistCart.remove();
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;
            products.push(object);
        }
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count;
        }
        let newCart = await new Cart({
            products,
            cartTotal,
            orderBy: user?._id,
        }).save();
        res.json(newCart);
    } catch (error) {
        throw new Error(error);
    }
});

const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const cart = await Cart.findOne({ orderBy: _id }).populate("products.product");
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});
const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const user = await User.findById(_id);
        const cart = await Cart.findOneAndRemove({ orderBy: user });
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const validCoupon = await Coupon.findOne({ name: coupon });
        if (validCoupon === null) {
            throw new Error("Invalid Coupon");
        }
        const user = await User.findById(_id);
        let { cartTotal } = await Cart.findOne({ orderBy: user._id }).populate("products.product");
        let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(0);
        await Cart.findOneAndUpdate(
            { orderBy: user._id },
            { totalAfterDiscount },
            { new: true, }
        );
        res.json(totalAfterDiscount)
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createUser,
    loginUserCtrl,
    loginAdmin,
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
    addToWishlist,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
};
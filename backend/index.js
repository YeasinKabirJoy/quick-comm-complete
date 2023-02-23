const bodyParser = require("body-parser");
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const dbConnect = require("./config/dbConnect");
const { notFound,errorHandler } = require("./middlewares/errorHandler.js")

const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 8000;
const app = express();

const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const prodcategoryRouter = require("./routes/prodcategoryRoute");
const blogcategoryRouter = require("./routes/blogcategoryRoute");
const brandRouter = require("./routes/brandRoute")
const couponRouter = require("./routes/couponRoute")

dbConnect();
app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
  
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/pcategory", prodcategoryRouter);
app.use("/api/bcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () =>{
    console.log(`Server is running at ${PORT}....`)
});
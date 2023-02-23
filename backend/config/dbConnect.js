const {default:mongoose} = require("mongoose")
mongoose.set('strictQuery', true);

const dbConnect = () => {
    try{
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log("Database Connected Successfully");
    }catch(error){
        console.log("Database Error");
    }
};

module.exports = dbConnect;
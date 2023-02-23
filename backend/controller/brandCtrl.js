const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");


const createBrnad = asyncHandler(async (req,res)=>{
    try{
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
    }catch(error){
        throw new Error(error);
    }
});

const updateBrnad = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updatedBrand = await Brand.findByIdAndUpdate(id,req.body,
            {
                new:true
            }
         );
        res.json(updatedBrand);
    }catch(error){
        throw new Error(error);
    }
});

const deleteBrand = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deletedBrand = await Brand.findByIdAndDelete(id);
        res.json(deletedBrand);
    }catch(error){
        throw new Error(error);
    }
});

const getBrand = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getBrand = await Brand.findById(id);
        res.json(getBrand);
    }catch(error){
        throw new Error(error);
    }
});

const getAllBrand = asyncHandler(async (req,res)=>{
    try{
        const allBrand = await Brand.find();
        res.json(allBrand);
    }catch(error){
        throw new Error(error);
    }
});


module.exports = {createBrnad,updateBrnad,deleteBrand,getBrand,getAllBrand}
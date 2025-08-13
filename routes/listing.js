const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

 
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);  //jo bhi result ha use error lele bas
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");//ye sirf message dikaega else can use error
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//Index Route
router.get("/", wrapAsync(async (req,res)=>{
    let allListings = await Listing.find();
    // console.log(allListings);
    res.render("./listings/index.ejs",{allListings});
}));

//New
router.get("/new", isLoggedIn ,(req,res)=>{
    res.render("listings/new.ejs");
});

//Show
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing you requested doesn't Exist!");
        return res.redirect("/listings");//yaha return se niche wala error show nahi karega
    }
    res.render("listings/show.ejs",{listing});   // ./ and simple both correct
}));

//Create
router.post("/", isLoggedIn, validateListing, wrapAsync(async(req,res)=>{
    let listing = req.body.listing;  // ye data {} ase dega to sedha add karde
    // console.log(listing);
    
    let newListing = new Listing(listing);   //insertion
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

//Edit
router.get("/:id/edit", isLoggedIn, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested doesn't Exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));

//Update
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete
router.delete("/:id", isLoggedIn, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", " Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;
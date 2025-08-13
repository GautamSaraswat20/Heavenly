module.exports = (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}

// ye wrapAsync ko hamne arrow function me likha ha
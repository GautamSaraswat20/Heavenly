const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser("secretcode"));


app.get("/",(req,res)=>{
   console.dir(req.cookies);
   res.send("root here")
});

app.get("/getcookie",(req,res)=>{
    res.cookie("greet","Namaste")
    res.cookie("madeIn","India")
    res.send("cookie sent");
});

app.get("/greet",(req,res)=>{
    let {name = "anonymous"} =req.cookies;
    res.send(`Hi ${name}`);
});

app.get("/getsignedcookie",(req,res)=>{
    res.cookie("color","red",{signed:true});
    res.send("signed cookie send");
});

app.get("/verify", (req,res)=>{
    console.log(req.signedCookies);
    res.send("verified");
});


app.listen(3000,()=>{
    console.log("listining on 3000");
})
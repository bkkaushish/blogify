const express= require("express");
const routers= express.Router();

const user=require("../model/userPro");

const blog= require("../model/blog");

routers.get("/",async (req,res)=>{
    const allBlogs= await blog.find({});
 
    res.render("home",{
        user: req.user,
        blog: allBlogs,
    });
});


routers.get("/signup",(req,res)=>{
    return res.render("signup");
});
routers.get("/signin",(req,res)=>{
    return res.render("signin");
});

routers.post("/signup",async (req,res)=>{
   const {FullName,Email,Password}= req.body;
   await user.create({
    FullName,
    Email,
    Password,
   });
   return res.redirect("/signin");
});


routers.post("/signin",async (req,res)=>{
    const {Email,Password}= req.body;
try {
     //use vertual function made by us in model;
   const token= await user.MatchPasswordAndCreateToken(Email,Password);
   return res.cookie("token",token).redirect("/");
} catch (error) {
    return res.render("signin",{
        error: "INCORRECT EMAIL OR PASSWORD....",
    });
}
   
 });
routers.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/");
});
 module.exports= routers;
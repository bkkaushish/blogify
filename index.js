const express = require("express");
const app= express();
const PORT= 8000;

const cookieParser= require("cookie-parser");
const { checkEntry } = require("./middleware/Auth");
const path= require("path");

const mongoose= require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/blogify")
.then(e => console.log("Server connected to mongoDb"));


app.set("view engine", "ejs");
app.set("views",path.resolve("./views"));

//middleware
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use( checkEntry("token"));
app.use(express.static(path.resolve("./public")));


const routers= require("./routes/routers");
const blogRouter= require("./routes/blog");


app.use(routers);
app.use("/blog",blogRouter);




app.listen(PORT,()=> console.log("server started at port: "+PORT));
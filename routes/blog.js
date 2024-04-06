const express= require("express");
const routers= express.Router();

const path= require("path");
const multer= require("multer");


const comment = require("../model/comment");
const blog = require("../model/blog");

routers.get("/addblog",(req,res)=>{
    return res.render("addBlog",{
        user: req.user,//because nav bar is also used for this site:
    });
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
      const filename=`${Date.now()}-${file.originalname}`;
      cb(null,filename);
      
    },
  });
  
  const upload = multer({ storage: storage })

  routers.post("/addblog",upload.single("coverImage"),async (req,res)=>{
    const {Title,Content}=req.body;
    await blog.create({
      Content,
      Title,
      CreatedBy: req.user._id,
      coverImageUrl:`/uploads/${req.file.filename}`,
    });
    return res.redirect("/");
 });

 routers.get("/:id", async(req,res)=>{
  const blogs= await blog.findById(req.params.id).populate("CreatedBy");
  const comments= await comment.find({blogId: req.params.id}).populate("CreatedBy");
  return res.render("blog",{
    user: req.user,
    comments,
    blogs,

  });
  
 });

 routers.post("/comment/:blogId", async(req,res)=>{
 await comment.create({
  comment: req.body.comment,
  blogId: req.params.blogId,  
  CreatedBy: req.user._id,
});
return res.redirect(`/blog/${req.params.blogId}`);
 });

module.exports=routers;
const mongoose= require("mongoose");


const blogSchema= new mongoose.Schema({

    Title: {
        type: String,
        required: true,
    },
    Content: {
        type: String,
        required: true,
    },
    coverImageUrl:{
        type: String,
    },
    CreatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },

},{timestamps: true});

const blog= mongoose.model("blog",blogSchema);

module.exports= blog;